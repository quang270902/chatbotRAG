# Updated "YourApp/api/routes.py"
from . import api_blueprint
from flask import  request, jsonify, Response, stream_with_context, json
from langchain_community.chat_models import ChatOpenAI
from langchain_community.vectorstores import Chroma
from server.service import openai_service, chroma_service
from server.utils.helper_functions import build_prompt
from langchain_huggingface import HuggingFaceEmbeddings
from flask_cors import CORS

from server.model.History import ChatHistoryModel

import os
from dotenv import load_dotenv

load_dotenv()  # Tải biến môi trường từ tệp .env

api_key = os.getenv('OPENAI_API_KEY')  # Lấy giá trị của biến môi trường OPENAI_API_KEY


ST_MODEL_PATH = "VoVanPhuc/sup-SimCSE-VietNamese-phobert-base"
DB_PERSIST_PATH = "./vector/"
embeddings = HuggingFaceEmbeddings(model_name=ST_MODEL_PATH, model_kwargs={"device": "cpu"})
topic_vectordb = Chroma(embedding_function=embeddings,
                  persist_directory=DB_PERSIST_PATH)

@api_blueprint.route('/get-conversations', methods=['GET'])
def show_conversations():
    chat_model = ChatHistoryModel()
    response = chat_model.get_all_conversations()
    return jsonify(response)

@api_blueprint.route('/get-messages/<session_id>', methods=['GET'])
def show_messages_by_conversation(session_id):
    chat_model = ChatHistoryModel()
    response = chat_model.get_all_messages_by_conversation(session_id)
    return jsonify(response)

@api_blueprint.route('/handle-query', methods=['POST'])
def handle_query():
    question = request.json['input']
    chat_history = request.json['history']
    question_full = question
    #Nhận về các document liên quan nhất
    for message in chat_history:
        question_full += " ." + message['User']

    [context1, context2, context_chunks] = chroma_service.get_most_similar_chunks_for_query(question_full, topic_vectordb)

    data = openai_service.construct_llm_payload(question, context_chunks, chat_history)

    # Send to OpenAI's LLM to generate a completion
    chat = ChatOpenAI( 
        openai_api_key= api_key,
        model='gpt-3.5-turbo'
)
    res = chat(data)
  
    # Return the streamed response from the LLM to the frontend
    return jsonify({
        'response' : res.content,
        'context1' : context1,
        'context2' : context2
    })

# API để lưu lịch sử chat
@api_blueprint.route('/save-message', methods=['POST'])
def save_chat():
    data = request.json
    session_id = data.get('session_id')
    user = data.get('user')
    bot = data.get('bot')
    context1 = data.get('context1')
    context2 = data.get('context2')
    chat_model = ChatHistoryModel()
    response = chat_model.add_chat_history(session_id, user, bot, context1, context2)
    chat_model.close_connection()
    return response, 201

# API để xóa hội thoại
@api_blueprint.route('/delete-conversation/<session_id>', methods=['DELETE'])
def delete_conversation(session_id):
    chat_model = ChatHistoryModel()
    if chat_model.delete_conversation(session_id):
        response = jsonify({'message': "Delete successfully"}), 200 
    else:
        response = jsonify({"message": "Failed to delete"}), 404
    chat_model.close_connection()
    return response

# API để cập nhật tên hội thoại
@api_blueprint.route('/update-conversation/<session_id>', methods=['PUT'])
def update_conversation(session_id):
    data = request.json
    title = data.get('title')
    chat_model = ChatHistoryModel()
    if chat_model.update_conversation(session_id, title):
        response = jsonify({'message': "Update successfully"}), 200  
    else:
        response = jsonify({"message": "Failed to update"}), 400
    chat_model.close_connection()
    return response


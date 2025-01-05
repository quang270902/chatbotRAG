from langchain.schema import SystemMessage, HumanMessage, AIMessage
# add this to the top of the file:
PROMPT_LIMIT = 16380

# ... keep all the current content of the file

# and add the following code
def build_prompt(query, context_chunks):
    # create the start and end of the prompt
    prompt_end = (
        f"\n\Câu hỏi: {query}\nTrả lời:"
    )
    # Initialize prompt with the start
    prompt =  context_chunks + prompt_end


    return prompt



def construct_messages_list(chat_history, prompt):
    messages = [SystemMessage(content='''
    Bạn là một chuyên gia về Luật Pháp Việt Nam. 
    Nếu câu hỏi không liên quan đến luật pháp Việt Nam, hãy trả lời "Xin lỗi, câu hỏi của bạn không liên quan đến pháp luật."
    Hãy dựa vào ngữ cảnh dưới đây để trả lời câu hỏi. 
    Đảm bảo rằng phản hồi của bạn rõ ràng và dễ đọc, sử dụng các yếu tố như tiêu đề, danh sách, hoặc đoạn văn.
    Cung cấp câu trả lời chi tiết và chỉ dựa trên ngữ cảnh được cung cấp. Đừng bắt đầu phản hồi của bạn bằng từ 'Trả lời:'.
    Nếu bạn không biết câu trả lời dựa trên ngữ cảnh này, chỉ cần trả lời "Xin lỗi! Tôi không thể trả lời câu hỏi của bạn" thay vì đoán.
    Ngữ cảnh:
    '''
    )]

    for message in chat_history:
        messages.append(HumanMessage(content= message['User']))
        messages.append(AIMessage(content= message['Bot']))
    # Replace last message with the full prompt
    messages.append(HumanMessage(content=prompt))

    return messages


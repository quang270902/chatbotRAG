import os
from server.utils.helper_functions import build_prompt, construct_messages_list

def construct_llm_payload(question, context_chunks, chat_history):
  
  # Build the prompt with the context chunks and user's query
  prompt = build_prompt(question, context_chunks)
  #print("\n==== PROMPT ====\n")
  #print(prompt)
  # Construct messages array to send to OpenAI
  messages = construct_messages_list(chat_history, prompt)
  print(messages)
  total_length = sum(len(message.content) for message in messages)
  print("Total context length:", total_length)

  return messages
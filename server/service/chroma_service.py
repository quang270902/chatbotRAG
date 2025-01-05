# ... leave the rest of the file unchanged
# and add the following.

def get_most_similar_chunks_for_query(query: str, topic_vectordb):
    #quesion.append(query)
    # get top 2 results from knowledge base
    results = topic_vectordb.similarity_search(query, k=2)
    # get the text from the results
    context1 = results[0].page_content
    context2 = results[1].page_content
    source_knowledge = "\n".join([context1, context2])

    return [context1, context2, source_knowledge]
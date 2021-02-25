from gensim.scripts.glove2word2vec import glove2word2vec

emb_path = "embedding.txt"
model = KeyedVectors.load_word2vec_format(emb_path)
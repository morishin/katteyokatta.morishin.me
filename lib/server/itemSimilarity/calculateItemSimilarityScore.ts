type Item = {
  id: number;
  name: string;
};

export const calculateItemSimilarityScore = (itemA: Item, itemB: Item) =>
  calculateDocumentSimilarityScore(itemA.name, itemB.name);

const calculateDocumentSimilarityScore = (
  documentA: string,
  documentB: string
) => {
  const wordsA = documentA.toLowerCase().split(" ");
  const wordsB = documentB.toLowerCase().split(" ");
  const allWords = Array.from(new Set(wordsA.concat(wordsB)));
  const vectorA = allWords.map(
    (word) => wordsA.filter((w) => w === word).length / wordsA.length
  );
  const vectorB = allWords.map(
    (word) => wordsB.filter((w) => w === word).length / wordsB.length
  );
  const dotProduct = vectorA.reduce((acc, val, i) => acc + val * vectorB[i], 0);
  const normA = Math.sqrt(vectorA.reduce((acc, val) => acc + val ** 2, 0));
  const normB = Math.sqrt(vectorB.reduce((acc, val) => acc + val ** 2, 0));
  const cosineSimilarity = dotProduct / (normA * normB);
  return cosineSimilarity;
};

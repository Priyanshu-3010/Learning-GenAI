require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const movies = require("../data/movies.json");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function getEmbedding(text) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: text,
  });

  return response.embeddings[0].values;
}

async function main() {
  const textA = "A scientist travels through space to find another planet.";

  const textB = "An astronaut explores the universe looking for a new world.";

  const textC = "A chef prepares delicious food in a restaurant.";

  const vectorA = await getEmbedding(textA);
  const vectorB = await getEmbedding(textB);
  const vectorC = await getEmbedding(textC);

  console.log("A dimensions:", vectorA.length);
  console.log("B dimensions:", vectorB.length);
  console.log("C dimensions:", vectorC.length);

  const similarityAB = cosineSimilarity(vectorA, vectorB);
  const similarityAC = cosineSimilarity(vectorA, vectorC);

  console.log("Similarity A-B:", similarityAB);
  console.log("Similarity A-C:", similarityAC);
}

function cosineSimilarity(a, b) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  return dotProduct / (magnitudeA * magnitudeB);
}

main();

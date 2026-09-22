// require("dotenv").config();

// const { GoogleGenAI } = require("@google/genai");

// const movies = require("../data/movies.json");

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// async function getEmbedding(text) {
//   const response = await ai.models.embedContent({
//     model: "gemini-embedding-2",
//     contents: text,
//   });

//   return response.embeddings[0].values;
// }

// // async function main() {
// //   const textA = "A scientist travels through space to find another planet.";

// //   const textB = "An astronaut explores the universe looking for a new world.";

// //   const textC = "A chef prepares delicious food in a restaurant.";

// //   const vectorA = await getEmbedding(textA);
// //   const vectorB = await getEmbedding(textB);
// //   const vectorC = await getEmbedding(textC);

// //   console.log("A dimensions:", vectorA.length);
// //   console.log("B dimensions:", vectorB.length);
// //   console.log("C dimensions:", vectorC.length);

// //   const similarityAB = cosineSimilarity(vectorA, vectorB);
// //   const similarityAC = cosineSimilarity(vectorA, vectorC);

// //   console.log("Similarity A-B:", similarityAB);
// //   console.log("Similarity A-C:", similarityAC);
// // }

// async function main() {
//   const moviesWithEmbeddings = [];

//   for (const movie of movies) {
//     const embedding = await getEmbedding(movie.description);

//     moviesWithEmbeddings.push({
//       title: movie.title,
//       description: movie.description,
//       embedding: embedding,
//     });

//     console.log(`${movie.title} embedding generated`);
//   }

//   console.log("Total movies:", moviesWithEmbeddings.length);
//   console.log(
//     "First movie embedding dimensions:",
//     moviesWithEmbeddings[0].embedding.length
//   );
// }

// function cosineSimilarity(a, b) {
//   let dotProduct = 0;
//   let magnitudeA = 0;
//   let magnitudeB = 0;

//   for (let i = 0; i < a.length; i++) {
//     dotProduct += a[i] * b[i];
//     magnitudeA += a[i] * a[i];
//     magnitudeB += b[i] * b[i];
//   }

//   magnitudeA = Math.sqrt(magnitudeA);
//   magnitudeB = Math.sqrt(magnitudeB);

//   return dotProduct / (magnitudeA * magnitudeB);
// }

// main();

require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");
const readline = require("readline");

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

async function main() {
  const moviesWithEmbeddings = [];

  for (const movie of movies) {
    const embedding = await getEmbedding(movie.description);

    moviesWithEmbeddings.push({
      title: movie.title,
      description: movie.description,
      embedding: embedding,
    });
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("What type of movie are you looking for? ", async (query) => {
    const queryEmbedding = await getEmbedding(query);

    const results = [];

    for (const movie of moviesWithEmbeddings) {
      const similarity = cosineSimilarity(
        queryEmbedding,
        movie.embedding
      );

      results.push({
        title: movie.title,
        similarity: similarity,
      });
    }

    results.sort((a, b) => b.similarity - a.similarity);

    console.log("\nRecommended Movies:");

    for (const movie of results.slice(0, 5)) {
      console.log(
        `${movie.title} → ${movie.similarity.toFixed(4)}`
      );
    }

    rl.close();
  });
}

main();

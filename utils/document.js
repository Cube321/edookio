// utils.js
function splitTextIntoChunks(text, maxTokens) {
  console.log("Splitting text into chunks...");
  const approxCharsPerToken = 4; // Rough estimate
  const maxChunkSize = maxTokens * approxCharsPerToken;

  const chunks = [];
  let currentChunk = "";

  const sentences = text.split(/(?<=[.!?])\s+/);

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize) {
      chunks.push(currentChunk);
      currentChunk = "";
    }
    console.log("Chunk length:", currentChunk.length);
    currentChunk += sentence + " ";
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

module.exports = { splitTextIntoChunks };

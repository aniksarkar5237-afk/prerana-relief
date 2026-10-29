import sharp from 'sharp';

/**
 * Generates a 64-bit dHash for an image buffer.
 * Resizes to 9x8, converts to grayscale, and compares adjacent pixels.
 * @param {Buffer} imageBuffer
 * @returns {Promise<string>} 64-character binary string
 */
export async function generateDHash(imageBuffer) {
  try {
    const { data, info } = await sharp(imageBuffer)
      .resize(9, 8, { fit: 'fill' })
      .grayscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    let hash = '';
    
    // Compare adjacent pixels in each row
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const leftPixel = data[row * 9 + col];
        const rightPixel = data[row * 9 + col + 1];
        // If left > right -> 1, else 0
        hash += leftPixel > rightPixel ? '1' : '0';
      }
    }
    
    return hash;
  } catch (error) {
    console.error('Error generating dHash:', error);
    throw new Error('Failed to generate image hash');
  }
}

/**
 * Calculates the Hamming distance between two 64-bit hash strings.
 * @param {string} hash1
 * @param {string} hash2
 * @returns {number} distance
 */
export function calculateHammingDistance(hash1, hash2) {
  if (!hash1 || !hash2 || hash1.length !== hash2.length) {
    throw new Error('Hashes must be valid and of the same length');
  }
  
  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) {
      distance++;
    }
  }
  
  return distance;
}

/**
 * Evaluates the similarity between two images based on Hamming distance.
 * @param {number} distance
 * @returns {string} 'duplicate', 'near_duplicate', or 'distinct'
 */
export function evaluateSimilarity(distance) {
  if (distance <= 5) return 'duplicate';
  if (distance <= 10) return 'near_duplicate';
  return 'distinct';
}

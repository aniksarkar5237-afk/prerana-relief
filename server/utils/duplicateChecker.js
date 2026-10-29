import pool from '../config/db.js';
import { generateDHash, calculateHammingDistance, evaluateSimilarity } from './imageHasher.js';

/**
 * Checks an uploaded image buffer against all existing image_phash values in ngo_past_work.
 * @param {Buffer} imageBuffer 
 * @returns {Promise<{ hasDuplicate: boolean, matchedRecord: any, distance: number, newHash: string }>}
 */
export async function checkDuplicateImage(imageBuffer) {
  try {
    const newHash = await generateDHash(imageBuffer);
    
    // Fetch all existing hashes
    const result = await pool.query('SELECT id, charity_id, project_name, image_phash FROM ngo_past_work WHERE image_phash IS NOT NULL');
    const existingRecords = result.rows;
    
    let bestMatch = null;
    let minDistance = Infinity;
    
    for (const record of existingRecords) {
      const distance = calculateHammingDistance(newHash, record.image_phash);
      
      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = record;
      }
    }
    
    if (bestMatch && minDistance !== Infinity) {
      const similarity = evaluateSimilarity(minDistance);
      if (similarity === 'duplicate') {
        return {
          hasDuplicate: true,
          matchedRecord: bestMatch,
          distance: minDistance,
          newHash
        };
      }
    }
    
    return {
      hasDuplicate: false,
      matchedRecord: null,
      distance: minDistance,
      newHash
    };
  } catch (error) {
    console.error('Error checking duplicate image:', error);
    throw new Error('Failed to check for duplicate images');
  }
}

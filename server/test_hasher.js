import sharp from 'sharp';
import { generateDHash, calculateHammingDistance, evaluateSimilarity } from './utils/imageHasher.js';

async function runTest() {
  try {
    console.log('Generating dummy images for testing perceptual hashing...');
    
    // Create base image
    const baseImage = await sharp({
      create: {
        width: 300,
        height: 300,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 1 }
      }
    })
    .composite([{
      input: Buffer.from('<svg><circle cx="150" cy="150" r="100" fill="blue" /></svg>'),
      top: 0,
      left: 0,
    }])
    .png()
    .toBuffer();

    // Create modified image (resized, slight brightness adjustment)
    const modifiedImage = await sharp(baseImage)
      .resize(250, 250)
      .modulate({ brightness: 1.1 })
      .jpeg()
      .toBuffer();

    // Create distinct image
    const distinctImage = await sharp({
      create: {
        width: 300,
        height: 300,
        channels: 4,
        background: { r: 0, g: 255, b: 0, alpha: 1 }
      }
    })
    .png()
    .toBuffer();

    console.log('Computing hashes...');
    const hash1 = await generateDHash(baseImage);
    const hash2 = await generateDHash(modifiedImage);
    const hash3 = await generateDHash(distinctImage);

    console.log(`Hash 1 (Base):     ${hash1}`);
    console.log(`Hash 2 (Modified): ${hash2}`);
    console.log(`Hash 3 (Distinct): ${hash3}`);

    // Compare 1 and 2 (should be duplicate or near duplicate)
    const dist1 = calculateHammingDistance(hash1, hash2);
    console.log(`Distance between Base and Modified: ${dist1} -> ${evaluateSimilarity(dist1)}`);
    
    // Compare 1 and 3 (should be distinct)
    const dist2 = calculateHammingDistance(hash1, hash3);
    console.log(`Distance between Base and Distinct: ${dist2} -> ${evaluateSimilarity(dist2)}`);

    if (dist1 <= 5) {
      console.log('✅ Test passed: Modified image correctly identified as duplicate (distance <= 5).');
    } else {
      console.log('❌ Test failed: Modified image distance > 5.');
    }

  } catch (err) {
    console.error('Test error:', err);
  }
}

runTest();

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { glob } from 'glob';

// Get the current file's directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const IMAGES_DIR = path.join(__dirname, '../src/assets');
const QUALITY = 80; // Quality for WebP (1-100)
const MAX_WIDTH = 2000; // Max width for resizing large images

// Track processed files
const processedFiles = [];
let totalOriginalSize = 0;
let totalOptimizedSize = 0;

// Ensure output directory exists
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Process a single image
const processImage = async (filePath) => {
  try {
    const parsedPath = path.parse(filePath);
    const outputPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);
    
    // Skip if already processed or if it's a WebP file
    if (filePath.endsWith('.webp') || fs.existsSync(outputPath)) {
      return;
    }

    console.log(`Processing: ${filePath}`);
    
    // Get original file stats
    const stats = fs.statSync(filePath);
    const originalSize = stats.size;
    
    // Process image with sharp
    let image = sharp(filePath);
    
    // Get image metadata
    const metadata = await image.metadata();
    
    // Resize if image is too large
    if (metadata.width > MAX_WIDTH) {
      image = image.resize({ 
        width: MAX_WIDTH, 
        height: Math.round(metadata.height * (MAX_WIDTH / metadata.width)),
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Convert to WebP with specified quality
    await image.webp({ quality: QUALITY, effort: 6 }).toFile(outputPath);
    
    // Get optimized file stats
    const optimizedStats = fs.statSync(outputPath);
    const optimizedSize = optimizedStats.size;
    const savings = originalSize - optimizedSize;
    const savingsPercent = ((savings / originalSize) * 100).toFixed(2);
    
    // Add to processed files
    processedFiles.push({
      original: filePath,
      optimized: outputPath,
      originalSize,
      optimizedSize,
      savings,
      savingsPercent
    });
    
    totalOriginalSize += originalSize;
    totalOptimizedSize += optimizedSize;
    
    console.log(`✓ Optimized: ${path.basename(filePath)} (${formatFileSize(originalSize)} → ${formatFileSize(optimizedSize)}, saved ${savingsPercent}%)`);
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
};

// Format file size for display
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Generate a report of the optimization
const generateReport = () => {
  const totalSavings = totalOriginalSize - totalOptimizedSize;
  const totalSavingsPercent = ((totalSavings / totalOriginalSize) * 100).toFixed(2);
  
  console.log('\n--- Optimization Complete ---');
  console.log(`Processed ${processedFiles.length} files`);
  console.log(`Total original size: ${formatFileSize(totalOriginalSize)}`);
  console.log(`Total optimized size: ${formatFileSize(totalOptimizedSize)}`);
  console.log(`Total savings: ${formatFileSize(totalSavings)} (${totalSavingsPercent}%)`);
  
  // Save detailed report
  const report = {
    summary: {
      totalFiles: processedFiles.length,
      totalOriginalSize,
      totalOptimizedSize,
      totalSavings,
      totalSavingsPercent
    },
    files: processedFiles.map(file => ({
      original: path.relative(process.cwd(), file.original),
      optimized: path.relative(process.cwd(), file.optimized),
      originalSize: file.originalSize,
      optimizedSize: file.optimizedSize,
      savings: file.savings,
      savingsPercent: file.savingsPercent
    }))
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'optimization-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('\nDetailed report saved to scripts/optimization-report.json');
};

// Main function
const main = async () => {
  try {
    console.log('Starting image optimization...');
    
    // Find all image files
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const pattern = `**/*.{${imageExtensions.join(',')}}`;
    const files = await glob(pattern, { cwd: IMAGES_DIR, absolute: true, nodir: true });
    
    console.log(`Found ${files.length} image files to process\n`);
    
    // Process all images in parallel
    await Promise.all(files.map(file => processImage(file)));
    
    // Generate report
    generateReport();
    
    console.log('\nOptimization complete!');
    
  } catch (error) {
    console.error('Error during optimization:', error);
    process.exit(1);
  }
};

// Run the script
main();

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuración específica basada en el reporte de Lighthouse
const imagesConfig = [
  {
    name: 'spain-flag.webp',
    displayWidth: 28,
    displayHeight: 15,
    maxWidth: 56, // 2x para retina
    maxHeight: 30,
    quality: 60
  },
  {
    name: 'gradient.webp',
    displayWidth: 800, // Asumiendo que es para fondo
    displayHeight: 600,
    maxWidth: 800, // Reducir para mejor compresión
    maxHeight: 600,
    quality: 20 // Mayor compresión para gradientes
  },
  {
    name: 'angular.webp',
    displayWidth: 353,
    displayHeight: 200,
    maxWidth: 353, // Usar tamaño exacto de display
    maxHeight: 200,
    quality: 80 // Mejor calidad para logos
  },
  {
    name: 'angular-logo.webp',
    displayWidth: 57,
    displayHeight: 60,
    maxWidth: 114, // 2x para retina
    maxHeight: 120,
    quality: 70
  },
  {
    name: 'deve.webp',
    displayWidth: 353,
    displayHeight: 200,
    maxWidth: 353,
    maxHeight: 200,
    quality: 80
  },
  {
    name: 'piyon2.webp',
    displayWidth: 353,
    displayHeight: 200,
    maxWidth: 353,
    maxHeight: 200,
    quality: 80
  },
  {
    name: 'javascript.webp',
    displayWidth: 353,
    displayHeight: 200,
    maxWidth: 353,
    maxHeight: 200,
    quality: 80
  },
  {
    name: 'typescript.webp',
    displayWidth: 353,
    displayHeight: 200,
    maxWidth: 353,
    maxHeight: 200,
    quality: 80
  },
  {
    name: 'html.webp',
    displayWidth: 353,
    displayHeight: 200,
    maxWidth: 353,
    maxHeight: 200,
    quality: 80
  },
  {
    name: 'robitroll.webp',
    displayWidth: 100,
    displayHeight: 100,
    maxWidth: 100, // Usar tamaño exacto de display
    maxHeight: 100,
    quality: 85 // Mejor calidad para iconos pequeños
  }
];

async function optimizeImage(config) {
  const inputPath = path.join(__dirname, 'public', 'assets', config.name);
  const outputPath = path.join(__dirname, 'public', 'assets', `opt-${config.name}`);

  if (!fs.existsSync(inputPath)) {
    console.log(`❌ No se encuentra: ${inputPath}`);
    return null;
  }

  try {
    const originalStats = fs.statSync(inputPath);
    const originalSize = originalStats.size;

    console.log(`\n🔄 Procesando: ${config.name}`);
    console.log(`   Display: ${config.displayWidth}x${config.displayHeight}`);
    console.log(`   Máximo: ${config.maxWidth}x${config.maxHeight}`);
    console.log(`   Original: ${(originalSize/1024).toFixed(1)}KB`);

    await sharp(inputPath)
      .resize(config.maxWidth, config.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ 
        quality: config.quality,
        effort: 6 
      })
      .toFile(outputPath);

    const optimizedStats = fs.statSync(outputPath);
    const optimizedSize = optimizedStats.size;
    const savings = originalSize - optimizedSize;

    console.log(`✅ Optimizado: ${(optimizedSize/1024).toFixed(1)}KB`);
    console.log(`   Ahorro: ${(savings/1024).toFixed(1)}KB (${((savings/originalSize)*100).toFixed(1)}%)`);

    return { 
      originalSize, 
      optimizedSize, 
      savings,
      originalFile: config.name,
      optimizedFile: `opt-${config.name}`
    };

  } catch (error) {
    console.log(`❌ Error procesando ${config.name}:`, error.message);
    return null;
  }
}

async function generateImageManifest(results) {
  const manifest = {
    generated: new Date().toISOString(),
    images: results.map(result => ({
      original: result.originalFile,
      optimized: result.optimizedFile,
      originalSize: result.originalSize,
      optimizedSize: result.optimizedSize,
      savings: result.savings,
      savingsPercent: ((result.savings / result.originalSize) * 100).toFixed(1)
    }))
  };

  fs.writeFileSync(
    path.join(__dirname, 'public', 'assets', 'image-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  return manifest;
}

async function main() {
  console.log('🚀 Iniciando optimización completa de imágenes...\n');
  
  const results = [];
  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const config of imagesConfig) {
    const result = await optimizeImage(config);
    if (result) {
      results.push(result);
      totalOriginal += result.originalSize;
      totalOptimized += result.optimizedSize;
    }
  }

  const totalSavings = totalOriginal - totalOptimized;
  
  console.log('\n📊 RESUMEN FINAL:');
  console.log(`   Imágenes procesadas: ${results.length}`);
  console.log(`   Tamaño total original: ${(totalOriginal/1024).toFixed(1)}KB`);
  console.log(`   Tamaño total optimizado: ${(totalOptimized/1024).toFixed(1)}KB`);
  console.log(`   Ahorro total: ${(totalSavings/1024).toFixed(1)}KB (${((totalSavings/totalOriginal)*100).toFixed(1)}%)`);
  
  // Generar manifest para referencia
  await generateImageManifest(results);
  
  console.log('\n🎯 PRÓXIMOS PASOS:');
  console.log('   1. Reemplaza las referencias en tu HTML');
  console.log('   2. Ejecuta: ng build --configuration=production');
  console.log('   3. Verifica en Lighthouse');
  
  console.log('\n📝 LISTA DE ARCHIVOS OPTIMIZADOS:');
  results.forEach(result => {
    console.log(`   ${result.originalFile} → ${result.optimizedFile}`);
  });
}

main();
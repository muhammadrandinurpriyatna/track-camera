import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

// Helper functions
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

function createHash(buffer, algorithm) {
  return crypto.createHash(algorithm).update(buffer).digest('hex')
}

async function ensureUploadsDir() {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  try {
    await fs.access(uploadsDir)
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true })
  }
  return uploadsDir
}

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    
    if (!formData || !formData.length) {
      throw new Error('No data received')
    }
    
    const imageFile = formData.find(item => item.name === 'image')
    if (!imageFile) {
      throw new Error('No image file found')
    }
    
    // Create uploads directory
    const uploadsDir = await ensureUploadsDir()
    
    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `captured_${timestamp}.jpg`
    const filePath = path.join(uploadsDir, filename)
    const publicPath = `/uploads/${filename}`
    
    // Save file
    await fs.writeFile(filePath, imageFile.data)
    
    // Get file stats
    const stats = await fs.stat(filePath)
    const fileSize = stats.size
    const createdTime = stats.birthtime
    
    // Generate hashes
    const md5Hash = createHash(imageFile.data, 'md5')
    const sha1Hash = createHash(imageFile.data, 'sha1')
    
    let html = `<div class="success">✅ Gambar berhasil disimpan: ${filename}</div>`
    
    // Display captured image
    html += `<img class="captured-image" src="${publicPath}" alt="Captured Image">`
    
    // File information
    html += `
    <div class="metadata">
      <h3>📄 Informasi File:</h3>
      <strong>Nama File:</strong> ${filename}<br>
      <strong>Ukuran File:</strong> ${formatBytes(fileSize)} (${fileSize.toLocaleString()} bytes)<br>
      <strong>Tanggal Dibuat:</strong> ${createdTime.toLocaleString('id-ID')}<br>
      <strong>MIME Type:</strong> ${imageFile.type || 'image/jpeg'}<br>
    </div>
    `
    
    // Location information from browser
    const locationFields = ['latitude', 'longitude', 'accuracy', 'timestamp']
    const locationData = {}
    
    formData.forEach(item => {
      if (locationFields.includes(item.name)) {
        locationData[item.name] = item.data.toString()
      }
    })
    
    if (locationData.latitude && locationData.longitude) {
      const mapsUrl = `https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`
      html += `
      <div class="metadata">
        <h3>🌍 Informasi Lokasi (Browser):</h3>
        <strong>Latitude:</strong> ${locationData.latitude}<br>
        <strong>Longitude:</strong> ${locationData.longitude}<br>
        <strong>Akurasi:</strong> ${locationData.accuracy ? locationData.accuracy + ' meter' : 'N/A'}<br>
        <strong>Timestamp:</strong> ${locationData.timestamp || 'N/A'}<br>
        <strong>Google Maps:</strong> <a href="${mapsUrl}" target="_blank" style="color: #3498db;">Lihat di Maps</a><br>
      </div>
      `
    }
    
    // EXIF information (basic - browser captured images usually don't have much EXIF)
    html += `
    <div class="metadata">
      <h3>📷 Informasi EXIF:</h3>
      <p>⚠️ Gambar yang diambil melalui browser biasanya tidak memiliki data EXIF lengkap karena keterbatasan keamanan browser.</p>
      <p>Untuk data EXIF lengkap, gunakan kamera asli atau upload foto yang sudah ada.</p>
    </div>
    `
    
    // File integrity hashes
    html += `
    <div class="metadata">
      <h3>🔐 Hash File:</h3>
      <strong>MD5:</strong> <span style="font-family: monospace; word-break: break-all;">${md5Hash}</span><br>
      <strong>SHA1:</strong> <span style="font-family: monospace; word-break: break-all;">${sha1Hash}</span><br>
    </div>
    `
    
    return {
      success: true,
      html: html,
      filename: filename,
      path: publicPath
    }
    
  } catch (error) {
    console.error('Error processing image:', error)
    return {
      success: false,
      html: `<div class="error">❌ Error: ${error.message}</div>`
    }
  }
})
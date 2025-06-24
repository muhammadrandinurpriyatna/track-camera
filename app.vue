<template>
  <div class="container">
    <div class="header">
      <h1>🔍 User Info Finder</h1>
      <p>
        Klik tombol di bawah untuk mendapatkan informasi detail tentang browser
        dan lokasi Anda
      </p>
    </div>

    <div class="content">
      <div class="search-section">
        <button @click="getUserInfo" class="btn-cari" :disabled="loading">
          🔎 {{ loading ? "Memuat..." : "Cari Info Saya" }}
        </button>
      </div>

      <div v-if="userInfo" class="info-grid">
        <div class="info-card">
          <div class="info-title">🌐 IP Address</div>
          <div class="info-value">{{ userInfo.ip_address }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">🖥️ User Agent</div>
          <div class="info-value">{{ userInfo.user_agent }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">🌍 Browser</div>
          <div class="info-value">{{ userInfo.browser }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">💻 Platform</div>
          <div class="info-value">{{ userInfo.platform }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">🗣️ Bahasa</div>
          <div class="info-value">{{ userInfo.accept_language }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">🔗 Referer</div>
          <div class="info-value">{{ userInfo.referer }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">⏰ Timestamp</div>
          <div class="info-value">{{ userInfo.timestamp }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">🏠 Server</div>
          <div class="info-value">{{ userInfo.server_name }}</div>
        </div>
      </div>

      <div v-if="userInfo" class="location-section">
        <h3>📍 Informasi Lokasi</h3>
        <div class="alert alert-info">
          Klik tombol di bawah untuk mendapatkan koordinat latitude dan
          longitude Anda
        </div>

        <div v-if="locationLoading" class="loading">
          <div class="spinner"></div>
          <p>Mendapatkan lokasi...</p>
        </div>

        <div v-if="coordinates" class="coordinates">
          <p><strong>Latitude:</strong> {{ coordinates.latitude }}</p>
          <p><strong>Longitude:</strong> {{ coordinates.longitude }}</p>
          <p><strong>Akurasi:</strong> {{ coordinates.accuracy }} meter</p>
        </div>

        <button
          @click="getLocation"
          class="get-location-btn"
          :disabled="locationLoading"
        >
          📍 Dapatkan Koordinat Saya
        </button>

        <button v-if="coordinates" @click="openMap" class="get-location-btn">
          🗺️ Buka di Google Maps
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import yang diperlukan
import { ref, onMounted } from "vue";

// Reactive variables
const userInfo = ref(null);
const loading = ref(false);
const locationLoading = ref(false);
const coordinates = ref(null);

// Function untuk mendapatkan browser info
const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  let browser = "Tidak diketahui";

  if (userAgent.includes("Chrome")) {
    browser = "Google Chrome";
  } else if (userAgent.includes("Firefox")) {
    browser = "Mozilla Firefox";
  } else if (userAgent.includes("Safari")) {
    browser = "Safari";
  } else if (userAgent.includes("Edge")) {
    browser = "Microsoft Edge";
  } else if (userAgent.includes("Opera")) {
    browser = "Opera";
  }

  return browser;
};

// Function untuk mendapatkan platform info
const getPlatformInfo = () => {
  const platform = navigator.platform;
  let platformName = "Tidak diketahui";

  if (platform.includes("Win")) {
    platformName = "Windows";
  } else if (platform.includes("Mac")) {
    platformName = "macOS";
  } else if (platform.includes("Linux")) {
    platformName = "Linux";
  } else if (platform.includes("Android")) {
    platformName = "Android";
  } else if (platform.includes("iPhone") || platform.includes("iPad")) {
    platformName = "iOS";
  }

  return platformName;
};

// Function untuk mendapatkan IP address (menggunakan API eksternal)
const getIPAddress = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP:", error);
    return "Tidak dapat diambil";
  }
};

// Function untuk mendapatkan user info
const getUserInfo = async () => {
  loading.value = true;

  try {
    const ipAddress = await getIPAddress();

    userInfo.value = {
      ip_address: ipAddress,
      user_agent: navigator.userAgent,
      browser: getBrowserInfo(),
      platform: getPlatformInfo(),
      accept_language:
        navigator.language || navigator.languages?.[0] || "Tidak diketahui",
      referer: document.referrer || "Direct access",
      timestamp: new Date().toLocaleString("id-ID"),
      server_name: window.location.hostname,
      request_method: "GET",
      connection_type: navigator.connection?.effectiveType || "Tidak diketahui",
    };
  } catch (error) {
    console.error("Error getting user info:", error);
  } finally {
    loading.value = false;
  }
};

// Function untuk mendapatkan lokasi
const getLocation = () => {
  if (navigator.geolocation) {
    locationLoading.value = true;
    coordinates.value = null;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        coordinates.value = {
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
          accuracy: Math.round(position.coords.accuracy),
        };
        locationLoading.value = false;
      },
      (error) => {
        locationLoading.value = false;
        let errorMsg = "";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Akses lokasi ditolak oleh user.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Informasi lokasi tidak tersedia.";
            break;
          case error.TIMEOUT:
            errorMsg = "Permintaan lokasi timeout.";
            break;
          default:
            errorMsg = "Error tidak dikenal.";
            break;
        }
        alert("Error mendapatkan lokasi: " + errorMsg);
      }
    );
  } else {
    alert("Geolocation tidak didukung oleh browser ini.");
  }
};

// Function untuk membuka Google Maps
const openMap = () => {
  if (coordinates.value) {
    const url = `https://www.google.com/maps?q=${coordinates.value.latitude},${coordinates.value.longitude}`;
    window.open(url, "_blank");
  }
};

// Set page title
useHead({
  title: "User Info Finder - Nuxt.js",
  meta: [
    {
      name: "description",
      content:
        "Aplikasi untuk mendapatkan informasi browser dan lokasi pengguna",
    },
  ],
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-height: 100vh;
}

.header {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  text-align: center;
  padding: 30px;
}

.header h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.header p {
  opacity: 0.9;
  font-size: 1.1em;
}

.content {
  padding: 40px;
}

.search-section {
  text-align: center;
  margin-bottom: 40px;
}

.btn-cari {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 1.2em;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.btn-cari:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.btn-cari:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.info-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid #667eea;
  transition: transform 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
}

.info-title {
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  font-size: 1.1em;
}

.info-value {
  color: #666;
  word-break: break-all;
  line-height: 1.5;
}

.location-section {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border-radius: 12px;
  padding: 25px;
  margin: 30px 0;
  text-align: center;
}

.coordinates {
  font-size: 1.5em;
  margin: 15px 0;
}

.get-location-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 12px 30px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 10px;
}

.get-location-btn:hover:not(:disabled) {
  background: white;
  color: #667eea;
}

.get-location-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.alert {
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
}

.alert-info {
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.loading {
  text-align: center;
  margin: 20px 0;
}

.spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 2em;
  }

  .content {
    padding: 20px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<style>
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
</style>

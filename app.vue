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
        <!-- IP & Network Info -->
        <div class="info-card">
          <div class="info-title">🌐 IP Address</div>
          <div class="info-value">{{ userInfo.ip_address }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">📡 Connection Type</div>
          <div class="info-value">{{ userInfo.connection_type }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">⚡ Effective Type</div>
          <div class="info-value">{{ userInfo.effective_type }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">📊 Downlink Speed</div>
          <div class="info-value">{{ userInfo.downlink }}</div>
        </div>

        <!-- Browser Info -->
        <div class="info-card">
          <div class="info-title">🌍 Browser</div>
          <div class="info-value">{{ userInfo.browser }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">🔢 Browser Version</div>
          <div class="info-value">{{ userInfo.browser_version }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">🔧 Engine</div>
          <div class="info-value">{{ userInfo.engine }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">🖥️ User Agent</div>
          <div class="info-value">{{ userInfo.user_agent }}</div>
        </div>

        <!-- Device Info -->
        <div class="info-card">
          <div class="info-title">💻 Platform</div>
          <div class="info-value">{{ userInfo.platform }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">📱 Device Type</div>
          <div class="info-value">{{ userInfo.device_type }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">🏗️ Architecture</div>
          <div class="info-value">{{ userInfo.architecture }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">🖼️ Screen Resolution</div>
          <div class="info-value">{{ userInfo.screen_resolution }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">📐 Viewport Size</div>
          <div class="info-value">{{ userInfo.viewport_size }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">🌈 Color Depth</div>
          <div class="info-value">{{ userInfo.color_depth }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">📏 Pixel Ratio</div>
          <div class="info-value">{{ userInfo.pixel_ratio }}</div>
        </div>

        <!-- Language & Location -->
        <div class="info-card">
          <div class="info-title">🗣️ Bahasa</div>
          <div class="info-value">{{ userInfo.accept_language }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">🌍 All Languages</div>
          <div class="info-value">{{ userInfo.all_languages }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">🕐 Timezone</div>
          <div class="info-value">{{ userInfo.timezone }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">⏰ Local Time</div>
          <div class="info-value">{{ userInfo.local_time }}</div>
        </div>

        <!-- Browser Features -->
        <div class="info-card">
          <div class="info-title">🍪 Cookies Enabled</div>
          <div class="info-value">{{ userInfo.cookies_enabled }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">☕ Java Enabled</div>
          <div class="info-value">{{ userInfo.java_enabled }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">🔌 Plugins Count</div>
          <div class="info-value">{{ userInfo.plugins_count }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">🧠 Hardware Concurrency</div>
          <div class="info-value">{{ userInfo.hardware_concurrency }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">💾 Device Memory</div>
          <div class="info-value">{{ userInfo.device_memory }}</div>
        </div>

        <!-- Navigation Info -->
        <div class="info-card">
          <div class="info-title">🔗 Referer</div>
          <div class="info-value">{{ userInfo.referer }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">🏠 Server</div>
          <div class="info-value">{{ userInfo.server_name }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">📄 Current URL</div>
          <div class="info-value">{{ userInfo.current_url }}</div>
        </div>

        <!-- Performance Info -->
        <div class="info-card">
          <div class="info-title">📈 Page Load Time</div>
          <div class="info-value">{{ userInfo.page_load_time }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">🔄 Connection RTT</div>
          <div class="info-value">{{ userInfo.connection_rtt }}</div>
        </div>

        <!-- Security Info -->
        <div class="info-card">
          <div class="info-title">🔒 HTTPS</div>
          <div class="info-value">{{ userInfo.is_https }}</div>
        </div>

        <div class="info-card">
          <div class="info-title">🛡️ Do Not Track</div>
          <div class="info-value">{{ userInfo.do_not_track }}</div>
        </div>

        <!-- Battery Info (if available) -->
        <div v-if="userInfo.battery_info" class="info-card">
          <div class="info-title">🔋 Battery Level</div>
          <div class="info-value">{{ userInfo.battery_info }}</div>
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
          <p v-if="coordinates.altitude">
            <strong>Altitude:</strong> {{ coordinates.altitude }} meter
          </p>
          <p v-if="coordinates.heading">
            <strong>Heading:</strong> {{ coordinates.heading }}°
          </p>
          <p v-if="coordinates.speed">
            <strong>Speed:</strong> {{ coordinates.speed }} m/s
          </p>
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

// Function untuk mendapatkan browser info yang lebih detail
const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  let browser = "Tidak diketahui";
  let version = "Tidak diketahui";
  let engine = "Tidak diketahui";

  // Detect browser and version
  if (userAgent.includes("Chrome")) {
    browser = "Google Chrome";
    const match = userAgent.match(/Chrome\/(\d+\.\d+)/);
    version = match ? match[1] : "Tidak diketahui";
    engine = "Blink";
  } else if (userAgent.includes("Firefox")) {
    browser = "Mozilla Firefox";
    const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
    version = match ? match[1] : "Tidak diketahui";
    engine = "Gecko";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    browser = "Safari";
    const match = userAgent.match(/Safari\/(\d+\.\d+)/);
    version = match ? match[1] : "Tidak diketahui";
    engine = "WebKit";
  } else if (userAgent.includes("Edge")) {
    browser = "Microsoft Edge";
    const match = userAgent.match(/Edge\/(\d+\.\d+)/);
    version = match ? match[1] : "Tidak diketahui";
    engine = "EdgeHTML/Blink";
  } else if (userAgent.includes("Opera")) {
    browser = "Opera";
    const match = userAgent.match(/Opera\/(\d+\.\d+)/);
    version = match ? match[1] : "Tidak diketahui";
    engine = "Blink";
  }

  return { browser, version, engine };
};

// Function untuk mendapatkan device type
const getDeviceType = () => {
  const userAgent = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return "Tablet";
  }
  if (
    /mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(
      userAgent
    )
  ) {
    return "Mobile";
  }
  return "Desktop";
};

// Function untuk mendapatkan platform info yang lebih detail
const getPlatformInfo = () => {
  const platform = navigator.platform;
  const userAgent = navigator.userAgent;
  let platformName = "Tidak diketahui";
  let architecture = "Tidak diketahui";

  if (platform.includes("Win")) {
    platformName = "Windows";
    if (userAgent.includes("WOW64") || userAgent.includes("Win64")) {
      architecture = "64-bit";
    } else {
      architecture = "32-bit";
    }
  } else if (platform.includes("Mac")) {
    platformName = "macOS";
    architecture = userAgent.includes("Intel") ? "Intel" : "Apple Silicon";
  } else if (platform.includes("Linux")) {
    platformName = "Linux";
    architecture = userAgent.includes("x86_64") ? "64-bit" : "32-bit";
  } else if (platform.includes("Android")) {
    platformName = "Android";
    architecture = "ARM";
  } else if (platform.includes("iPhone") || platform.includes("iPad")) {
    platformName = "iOS";
    architecture = "ARM";
  }

  return { platformName, architecture };
};

// Function untuk mendapatkan network info
const getNetworkInfo = () => {
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  if (connection) {
    return {
      effectiveType: connection.effectiveType || "Tidak diketahui",
      downlink: connection.downlink
        ? `${connection.downlink} Mbps`
        : "Tidak diketahui",
      rtt: connection.rtt ? `${connection.rtt} ms` : "Tidak diketahui",
      saveData: connection.saveData ? "Ya" : "Tidak",
    };
  }
  return {
    effectiveType: "Tidak didukung",
    downlink: "Tidak didukung",
    rtt: "Tidak didukung",
    saveData: "Tidak didukung",
  };
};

// Function untuk mendapatkan battery info
const getBatteryInfo = async () => {
  try {
    if ("getBattery" in navigator) {
      const battery = await navigator.getBattery();
      return `${Math.round(battery.level * 100)}% (${
        battery.charging ? "Charging" : "Not charging"
      })`;
    }
    return "Tidak didukung";
  } catch (error) {
    return "Tidak dapat diakses";
  }
};

// Function untuk mendapatkan performance info
const getPerformanceInfo = () => {
  if (performance && performance.timing) {
    const loadTime =
      performance.timing.loadEventEnd - performance.timing.navigationStart;
    return loadTime > 0 ? `${loadTime} ms` : "Tidak tersedia";
  }
  return "Tidak didukung";
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

// Function untuk mendapatkan user info yang lebih lengkap
const getUserInfo = async () => {
  loading.value = true;

  try {
    const ipAddress = await getIPAddress();
    const browserInfo = getBrowserInfo();
    const platformInfo = getPlatformInfo();
    const networkInfo = getNetworkInfo();
    const batteryInfo = await getBatteryInfo();
    const performanceInfo = getPerformanceInfo();

    userInfo.value = {
      // Network Info
      ip_address: ipAddress,
      connection_type:
        networkInfo.saveData === "Ya" ? "Data Saver Mode" : "Normal",
      effective_type: networkInfo.effectiveType,
      downlink: networkInfo.downlink,
      connection_rtt: networkInfo.rtt,

      // Browser Info
      user_agent: navigator.userAgent,
      browser: browserInfo.browser,
      browser_version: browserInfo.version,
      engine: browserInfo.engine,

      // Device Info
      platform: platformInfo.platformName,
      architecture: platformInfo.architecture,
      device_type: getDeviceType(),
      screen_resolution: `${screen.width} x ${screen.height}`,
      viewport_size: `${window.innerWidth} x ${window.innerHeight}`,
      color_depth: `${screen.colorDepth} bit`,
      pixel_ratio: `${window.devicePixelRatio || 1}x`,

      // Language & Time
      accept_language: navigator.language || "Tidak diketahui",
      all_languages: navigator.languages?.join(", ") || "Tidak tersedia",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      local_time: new Date().toLocaleString("id-ID"),

      // Browser Features
      cookies_enabled: navigator.cookieEnabled ? "Ya" : "Tidak",
      java_enabled: navigator.javaEnabled
        ? navigator.javaEnabled()
          ? "Ya"
          : "Tidak"
        : "Tidak didukung",
      plugins_count: navigator.plugins
        ? navigator.plugins.length
        : "Tidak didukung",
      hardware_concurrency: navigator.hardwareConcurrency || "Tidak didukung",
      device_memory: navigator.deviceMemory
        ? `${navigator.deviceMemory} GB`
        : "Tidak didukung",

      // Navigation Info
      referer: document.referrer || "Direct access",
      server_name: window.location.hostname,
      current_url: window.location.href,

      // Performance Info
      page_load_time: performanceInfo,

      // Security Info
      is_https: window.location.protocol === "https:" ? "Ya" : "Tidak",
      do_not_track: navigator.doNotTrack === "1" ? "Ya" : "Tidak",

      // Battery Info
      battery_info: batteryInfo !== "Tidak didukung" ? batteryInfo : null,

      // Legacy fields
      timestamp: new Date().toLocaleString("id-ID"),
      request_method: "GET",
    };
  } catch (error) {
    console.error("Error getting user info:", error);
  } finally {
    loading.value = false;
  }
};

// Function untuk mendapatkan lokasi dengan info lebih detail
const getLocation = () => {
  if (navigator.geolocation) {
    locationLoading.value = true;
    coordinates.value = null;

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        coordinates.value = {
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
          accuracy: Math.round(position.coords.accuracy),
          altitude: position.coords.altitude
            ? Math.round(position.coords.altitude)
            : null,
          heading: position.coords.heading
            ? Math.round(position.coords.heading)
            : null,
          speed: position.coords.speed
            ? position.coords.speed.toFixed(2)
            : null,
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
      },
      options
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
  title: "Enhanced User Info Finder - Nuxt.js",
  meta: [
    {
      name: "description",
      content:
        "Aplikasi untuk mendapatkan informasi detail browser, device, dan lokasi pengguna",
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
  max-width: 1200px;
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
  font-size: 1.2em;
  margin: 15px 0;
  text-align: left;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
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

  .container {
    max-width: 100%;
    margin: 10px;
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

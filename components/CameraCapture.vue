<template>
  <div>
    <h1>📷 Camera Capture & Metadata Reader</h1>

    <div class="container">
      <video ref="video" autoplay playsinline muted></video>
      <canvas ref="canvas" style="display: none"></canvas>
      <br />
      <button @click="startCamera" :disabled="isLoading">
        <span v-if="isLoading" class="loading"></span>
        {{ cameraActive ? "Camera Aktif" : "Start Camera" }}
      </button>
      <button @click="captureImage" :disabled="!cameraActive || isProcessing">
        <span v-if="isProcessing" class="loading"></span>
        Capture Image
      </button>
      <button @click="stopCamera" :disabled="!cameraActive">Stop Camera</button>
    </div>

    <div v-if="message" :class="messageClass" v-html="message"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const video = ref(null);
const canvas = ref(null);
const stream = ref(null);
const cameraActive = ref(false);
const isLoading = ref(false);
const isProcessing = ref(false);
const message = ref("");
const messageClass = ref("");

const startCamera = async () => {
  try {
    isLoading.value = true;

    // Request location permission
    let locationData = null;
    if (navigator.geolocation) {
      try {
        const position = await getCurrentPosition();
        locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        console.log("Location accessed:", locationData);
      } catch (error) {
        console.log("Location access denied:", error);
      }
    }

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        facingMode: "environment",
      },
    });

    stream.value = mediaStream;
    video.value.srcObject = mediaStream;
    cameraActive.value = true;

    setMessage("✅ Camera berhasil diaktifkan!", "success");
  } catch (err) {
    setMessage(`❌ Error mengakses camera: ${err.message}`, "error");
  } finally {
    isLoading.value = false;
  }
};

const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach((track) => track.stop());
    video.value.srcObject = null;
    stream.value = null;
    cameraActive.value = false;
    setMessage("✅ Camera dihentikan!", "success");
  }
};

const captureImage = async () => {
  if (!stream.value) {
    alert("Silakan aktifkan camera terlebih dahulu!");
    return;
  }

  try {
    isProcessing.value = true;

    // Set canvas size
    canvas.value.width = video.value.videoWidth;
    canvas.value.height = video.value.videoHeight;

    // Draw video frame to canvas
    const ctx = canvas.value.getContext("2d");
    ctx.drawImage(video.value, 0, 0);

    // Convert to blob
    const blob = await new Promise((resolve) => {
      canvas.value.toBlob(resolve, "image/jpeg", 0.9);
    });

    // Get location
    let locationData = null;
    if (navigator.geolocation) {
      try {
        const position = await getCurrentPosition();
        locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        console.log("Location not available:", error);
      }
    }

    // Create FormData
    const formData = new FormData();
    formData.append("image", blob, "captured_image.jpg");

    if (locationData) {
      Object.keys(locationData).forEach((key) => {
        formData.append(key, locationData[key]);
      });
    } else {
      formData.append("timestamp", new Date().toISOString());
    }

    // Send to API
    const response = await $fetch("/api/process-image", {
      method: "POST",
      body: formData,
    });

    message.value = response.html;
    messageClass.value = "success";
  } catch (error) {
    setMessage(`❌ Error processing image: ${error.message}`, "error");
  } finally {
    isProcessing.value = false;
  }
};

const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    });
  });
};

const setMessage = (msg, type) => {
  message.value = msg;
  messageClass.value = type;
};

onUnmounted(() => {
  stopCamera();
});
</script>

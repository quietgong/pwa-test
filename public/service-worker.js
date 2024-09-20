// Axios 스크립트를 로드
importScripts("https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js");

// 설치 이벤트
self.addEventListener("install", (event) => {
  console.log("Service Worker installed");
  // 필요한 경우 초기 캐싱 작업 추가
});

// 활성화 이벤트
self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
  event.waitUntil(self.clients.claim());
});

// 주기적인 동기화 이벤트
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "location-sync") {
    // 주기적인 동기화 태그 이름
    console.log("Periodic Sync: Location sync event triggered");
    event.waitUntil(syncLocationToServer());
  }
});

// 서버로 위치 정보를 동기화하는 함수
function syncLocationToServer() {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // 위치 정보를 서버로 보내기 위한 데이터
        const data = {
          email: "pwa_periodic",
          latitude: latitude,
          longitude: longitude,
        };

        // Axios를 사용하여 위치 정보 서버로 전송
        axios
          .post("https://115.20.193.140.nip.io/gps", data)
          .then((response) => {
            console.log("Location synced successfully:", response.data);
            resolve();
          })
          .catch((error) => {
            console.error("Error syncing location:", error);
            reject(error);
          });
      });
    } else {
      console.error("Geolocation not supported");
      reject("Geolocation not supported");
    }
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("../public/service-worker.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.log("Service Worker registration failed:", error);
      });
  });
}

let trackingInterval;

document.getElementById("startTracking").addEventListener("click", () => {
  if ("geolocation" in navigator) {
    // 5초마다 위치를 가져오고 서버로 전송하는 인터벌 설정
    trackingInterval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("위도:", position.coords.latitude);
          console.log("경도:", position.coords.longitude);
          document.getElementById(
            "status"
          ).innerText = `위도 : ${position.coords.latitude}, 경도 : ${position.coords.longitude}`;

          // 서버로 위치 정보 전송
          sendPositionToServer(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (error) => {
          console.error("위치 정보를 가져오는데 실패:", error);
        },
        { enableHighAccuracy: true }
      );
    }, 5000); // 5초마다 위치 확인
  } else {
    console.log("Geolocation API를 지원하지 않습니다.");
  }
});

document.getElementById("stopTracking").addEventListener("click", () => {
  if (trackingInterval) {
    clearInterval(trackingInterval); // 인터벌 중지
    console.log("위치 추적 중지됨");
  }
});

async function sendPositionToServer(latitude, longitude) {
  const data = { email: "pwa", lat: latitude, lng: longitude };

  try {
    const res = await axios.post("https://115.20.193.140.nip.io/gps", data);
    console.log(`GPS DB 삽입 데이터: ${JSON.stringify(data)}`);
    console.log(res.data);
  } catch (error) {
    console.error("데이터베이스 저장 에러:", error);
  }
}

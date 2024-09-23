if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      // 서비스 워커 등록
      const registration = await navigator.serviceWorker.register(
        "/service-worker.js"
      );
      console.log("Service Worker registered with scope:", registration.scope);

      // 주기적인 백그라운드 동기화 기능이 지원되는지 확인
      if ("periodicSync" in registration) {
        const status = await navigator.permissions.query({
          name: "periodic-background-sync",
        });

        if (status.state === "granted") {
          // 주기적인 동기화 등록 (최소 간격 설정: 5분 = 300000 ms)
          await registration.periodicSync.register("location-sync", {
            minInterval: 5 * 60 * 1000, // 5분 간격으로 동기화
          });
          console.log("Periodic Background Sync registered");
        } else {
          console.log("Periodic Background Sync permission denied");
        }
      } else {
        console.log("Periodic Background Sync not supported");
      }
    } catch (error) {
      console.error(
        "Error registering Service Worker or Periodic Sync:",
        error
      );
    }
  });
}
else {
  console.log("serviceworker 찾을 수 없음");
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

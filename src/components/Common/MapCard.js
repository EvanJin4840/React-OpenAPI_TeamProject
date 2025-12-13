import React, { useEffect, useRef } from "react";

const MapCard = ({ lat, lng }) => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const { kakao } = window;
    
    // 1. 카카오 API 로드 확인
    if (!kakao) return;

    // 2. 좌표값 변환
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (!latitude || !longitude) return;

    // 3. 지도 옵션 설정
    const options = {
      center: new kakao.maps.LatLng(latitude, longitude),
      level: 3, 
    };

    // 4. 지도 생성
    const map = new kakao.maps.Map(mapContainer.current, options);

    // 5. 마커 표시
    const markerPosition = new kakao.maps.LatLng(latitude, longitude);
    const marker = new kakao.maps.Marker({
      position: markerPosition
    });
    marker.setMap(map);


    // 모달이 완전히 열린 후에 지도가 크기를 다시 계산하도록 0.1초 딜레이
    setTimeout(() => {
      map.relayout();
      map.setCenter(new kakao.maps.LatLng(latitude, longitude));
    }, 100); 

  }, [lat, lng]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "150px", 
        borderRadius: "8px", 
        backgroundColor: "#e9ecef"
      }}
    >
      {(!lat || !lng) && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#888", fontSize: "12px" }}>
          위치 정보 없음
        </div>
      )}
    </div>
  );
};

export default MapCard;
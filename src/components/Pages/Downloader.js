// 설명: API가 배포 환경에서는 작동하지 않아, API 주소에서 데이터를 로컬로 다운받아 db 파일을 만들어 이를 이용해 프로젝트를 진행하며 사용한 방법입니다.
// 교수님께서 지도해주신 방법대로 netlify function 동해 진행하니 해결하였으나 과정의 흔적으로 남기고자 유지하였습니다.

import React, { useState } from "react";
import { getLibraryList } from "../../services/openApi";

const Downloader = () => {
  const [status, setStatus] = useState("준비 완료. 버튼을 누르면 시작합니다.");
  const [progress, setProgress] = useState(0);

  const downloadAllData = async () => {
    setStatus("1. 전체 데이터 개수 파악 중...");
    
    try {
      // 1. 전체 개수(total)만 먼저 알아내기 위해 1개만 요청
      const initialData = await getLibraryList("", "", "", 1, 1);
      const totalCount = initialData.total;
      
      if (!totalCount || totalCount === 0) {
        setStatus("오류: 데이터를 찾을 수 없습니다.");
        return;
      }

      setStatus(`총 ${totalCount}개의 도서관을 발견했습니다. 수집 시작...`);

      // 2. 데이터 수집 설정
      const SIZE_PER_PAGE = 100; // 한 번에 가져올 개수
      const totalPages = Math.ceil(totalCount / SIZE_PER_PAGE);
      let collectedData = [];

      // 3. 반복문을 돌며 데이터 수집
      for (let page = 1; page <= totalPages; page++) {
        const response = await getLibraryList("", "", "", page, SIZE_PER_PAGE);
        
        if (response.list) {
          collectedData = [...collectedData, ...response.list];
        }

        // 진행률 업데이트
        const percent = Math.round((page / totalPages) * 100);
        setProgress(percent);
        setStatus(`수집 중... (${page}/${totalPages} 페이지) - 누적 ${collectedData.length}개`);
      }

      // 4. 파일 다운로드 트리거
      setStatus("데이터 병합 및 파일 생성 중...");
      
      const jsonString = JSON.stringify(collectedData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const href = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = href;
      link.download = "korea_libraries.json"; // 저장될 파일명
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setStatus(`완료! 총 ${collectedData.length}개의 데이터를 다운로드했습니다.`);
      
    } catch (error) {
      console.error(error);
      setStatus("수집 중 오류가 발생했습니다. 콘솔을 확인하세요.");
    }
  };

  return (
    <div style={{ padding: "50px", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
      <h1>전국 도서관 데이터 </h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        로컬 환경의 프록시를 통해 API의 모든 데이터를 안전하게 가져옵니다.
      </p>

      {/* 진행률 바 */}
      <div style={{ width: "100%", height: "20px", background: "#eee", borderRadius: "10px", marginBottom: "20px", overflow: "hidden" }}>
        <div style={{ width: `${progress}%`, height: "100%", background: "#007bff", transition: "width 0.3s" }}></div>
      </div>

      <button 
        onClick={downloadAllData} 
        style={{ 
          padding: "15px 30px", 
          fontSize: "18px", 
          cursor: "pointer", 
          background: progress === 100 ? "#28a745" : "#007bff", 
          color: "white", 
          border: "none", 
          borderRadius: "8px",
          fontWeight: "bold",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        }}
        disabled={progress > 0 && progress < 100} // 진행 중엔 버튼 비활성화
      >
        {progress > 0 && progress < 100 ? "데이터 수집 중..." : "전체 다운로드 시작"}
      </button>

      <h3 style={{ marginTop: "20px", fontSize: "16px", color: "#333" }}>{status}</h3>
    </div>
  );
};

export default Downloader;
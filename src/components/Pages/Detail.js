import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getLibraryById, deleteLibrary } from "../../services/dbApi";
import MapCard from "../Common/MapCard";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [library, setLibrary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLibraryById(id);
        setLibrary(data);
      } catch (error) {
        console.error("로딩 실패:", error);
        alert("데이터를 불러올 수 없습니다.");
        navigate("/mylist");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      await deleteLibrary(id);
      alert("삭제되었습니다.");
      navigate("/mylist");
    }
  };

  // 1. 로딩 화면 개선 (스피너 적용)
  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p style={{ color: "#64748b" }}>데이터를 불러오는 중입니다...</p>
    </div>
  );
  
  if (!library) return null;

  const isMySpot = library.libType === "나만의 장소";

  return (
    <div className="detail-container">
      {/* 헤더 영역 */}
      <div className="detail-header">
        <h2 style={{ margin: 0, fontSize: "1.8rem", color: "#1e293b" }}>
          {isMySpot ? "☕" : "📖"} {library.libName}
        </h2>
        <span style={{ 
          background: isMySpot ? "#8b5cf6" : "#e2e8f0", 
          color: isMySpot ? "white" : "#475569", 
          padding: "6px 14px", 
          borderRadius: "20px", 
          fontSize: "14px", 
          fontWeight: "700" 
        }}>
          {library.libType || "도서관"}
        </span>
      </div>

      {/* 지도 영역 */}
      <div style={{ height: "300px", marginBottom: "40px", borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
        <MapCard lat={library.geoY} lng={library.geoX} />
      </div>

      {/* 정보 리스트 (반응형 div 구조) */}
      <div style={{ marginBottom: "40px" }}>
        <div className="detail-row">
          <div className="detail-label">주소</div>
          <div className="detail-value">{library.addr} {library.addrDtl}</div>
        </div>
        
        {(!isMySpot || library.tel) && (
          <div className="detail-row">
            <div className="detail-label">전화번호</div>
            <div className="detail-value">{library.tel || "-"}</div>
          </div>
        )}

        {!isMySpot && (
          <>
            <div className="detail-row">
              <div className="detail-label">팩스번호</div>
              <div className="detail-value">{library.fax || "-"}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">홈페이지</div>
              <div className="detail-value">
                {library.homepage ? (
                  <a href={library.homepage} target="_blank" rel="noreferrer" style={{ color: "#4f46e5", textDecoration: "underline" }}>
                    {library.homepage}
                  </a>
                ) : "-"}
              </div>
            </div>
            <div className="detail-row">
              <div className="detail-label">개관년도</div>
              <div className="detail-value">{library.establishYear || "-"}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">운영기관</div>
              <div className="detail-value">{library.operatingAgency || "-"}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">휴관일</div>
              <div className="detail-value">{library.closedDay || "-"}</div>
            </div>
          </>
        )}

        <div className="detail-row">
          <div className="detail-label">운영시간</div>
          <div className="detail-value">{library.operatingTime || "-"}</div>
        </div>
        
        {/* 메모 강조 스타일 */}
        <div className="detail-row memo">
          <div className="detail-label" style={{ color: "#b45309" }}>📝 나의 메모</div>
          <div className="detail-value" style={{ fontWeight: "600", color: "#451a03" }}>
            {library.memo || "작성된 메모가 없습니다."}
          </div>
        </div>
      </div>

      {/* 버튼 그룹 (반응형 flex) */}
      <div className="btn-group" style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <Link to="/mylist" className="btn-secondary" style={{ textDecoration: "none", padding: "10px 20px", borderRadius: "8px", color: "white", fontWeight: "bold" }}>
          목록으로
        </Link>
        <Link to={`/update/${id}`} className="btn-warning" style={{ textDecoration: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold" }}>
          수정하기
        </Link>
        <button onClick={handleDelete} className="btn-danger">
          삭제하기
        </button>
      </div>
    </div>
  );
};

export default Detail;
import React, { useEffect, useState } from "react";
import { getMyLibraries, deleteLibrary } from "../../services/dbApi"; // API 함수 임포트
import MapCard from "../Common/MapCard";
import { Link } from "react-router-dom";

const MyList = () => {
  const [myLibraries, setMyLibraries] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyLibraries = async () => {
    setLoading(true);
    try {
      const data = await getMyLibraries();
      setMyLibraries(data);
    } catch (error) {
      console.error("불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLibraries();
  }, []);

  // 삭제 핸들러
  const handleDelete = async (id) => {
    if (window.confirm("정말 이 도서관을 삭제하시겠습니까?")) {
      try {
        await deleteLibrary(id);
        alert("삭제되었습니다.");
        // 삭제 후 목록 다시 불러오기
        fetchMyLibraries();
      } catch (error) {
        console.error("삭제 실패:", error);
        alert("삭제에 실패했습니다.");
      }
    }
  };

return (
<div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", // 양 끝으로 배치 (좌: 제목, 우: 버튼)
        alignItems: "center",            // 수직 중앙 정렬
        marginBottom: "20px", 
        borderBottom: "2px solid #333", 
        paddingBottom: "15px",
        gap: "10px"                      // 제목과 버튼 사이 최소 간격
      }}>
        
        {/* 제목 */}
        <h2 style={{ 
          margin: 0, 
          fontSize: "18px",
          flex: 1,          
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}>
          ⭐ 내 서재
        </h2>
        
        {/* 장소 등록 버튼 */}
        <Link 
          to="/create-spot" 
          style={{
            padding: "8px 12px",    
            background: "#6f42c1",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            fontSize: "13px",       
            whiteSpace: "nowrap",   
            flexShrink: 0          
          }}
        >
          + 장소 등록
        </Link>
      </div>

      {loading ? (
        <p>불러오는 중...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {myLibraries.length > 0 ? (
            myLibraries.map((lib) => (
              <div key={lib.id} style={cardStyle}>
                {/* 저장할 때 좌표가 없을 수도 있으니 체크 */}
                <MapCard lat={lib.geoY} lng={lib.geoX} />
                
                <div style={{ padding: "15px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h4 style={{ margin: "0 0 10px 0" }}>{lib.libName}</h4>
                  <p style={{ fontSize: "13px", color: "#666" }}>{lib.addr}</p>
                  
                  <div style={{ marginTop: "auto", display: "flex", gap: "5px" }}>
                    {/* 상세페이지 이동 버튼 */}
                    <Link to={`/detail/${lib.id}`} style={btnDetail}>
                      상세
                    </Link>
                    {/* 수정 버튼 */}
                    <Link to={`/update/${lib.id}`} style={btnUpdate}>
                      수정
                    </Link>
                    {/* 삭제 버튼 */}
                    <button onClick={() => handleDelete(lib.id)} style={btnDelete}>
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "50px", background: "#f9f9f9", borderRadius: "10px" }}>
              <h3>아직 찜한 도서관이 없습니다.</h3>
              <p>도서관 검색 메뉴에서 마음에 드는 도서관을 추가해보세요!</p>
              <Link to="/list" style={{ display: "inline-block", marginTop: "10px", padding: "10px 20px", background: "#007bff", color: "white", textDecoration: "none", borderRadius: "5px" }}>
                도서관 찾으러 가기
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 스타일
const cardStyle = { background: "white", border: "1px solid #ddd", borderRadius: "10px", overflow: "hidden", display: "flex", flexDirection: "column" };
const btnDetail = { flex: 1, textAlign: "center", padding: "8px", background: "#17a2b8", color: "white", textDecoration: "none", borderRadius: "4px", fontSize: "14px" };
const btnUpdate = { flex: 1, textAlign: "center", padding: "8px", background: "#ffc107", color: "black", textDecoration: "none", borderRadius: "4px", fontSize: "14px" };
const btnDelete = { flex: 1, padding: "8px", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px" };

export default MyList;
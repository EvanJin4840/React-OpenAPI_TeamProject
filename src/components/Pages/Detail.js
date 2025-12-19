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

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>로딩 중...</div>;
  if (!library) return null;

  const isMySpot = library.libType === "나만의 장소";

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", padding: "30px", border: "1px solid #ddd", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #333", paddingBottom: "15px", marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>{isMySpot ? "☕" : "📖"} {library.libName}</h2>
        <span style={{ background: isMySpot ? "#6f42c1" : "#e9ecef", color: isMySpot ? "white" : "#495057", padding: "5px 12px", borderRadius: "20px", fontSize: "14px", fontWeight: "bold" }}>
          {library.libType || "도서관"}
        </span>
      </div>

      <div style={{ height: "350px", marginBottom: "30px", borderRadius: "10px", overflow: "hidden", border: "1px solid #eee" }}>
        <MapCard lat={library.geoY} lng={library.geoX} />
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px" }}>
        <tbody>
          <tr><td style={thStyle}>주소</td><td style={tdStyle}>{library.addr} {library.addrDtl}</td></tr>
          
          {(!isMySpot || library.tel) && (
            <tr><td style={thStyle}>전화번호</td><td style={tdStyle}>{library.tel || "-"}</td></tr>
          )}

          {/* ▼▼▼ [조건부 렌더링] 공공도서관일 때만 보여주는 항목들 ▼▼▼ */}
          {!isMySpot && (
            <>
              <tr><td style={thStyle}>팩스번호</td><td style={tdStyle}>{library.fax || "-"}</td></tr>
              <tr><td style={thStyle}>홈페이지</td><td style={tdStyle}>
                {library.homepage ? <a href={library.homepage} target="_blank" rel="noreferrer" style={{ color: "#007bff", textDecoration: "none" }}>{library.homepage} 🔗</a> : "-"}
              </td></tr>
              <tr><td style={thStyle}>개관년도</td><td style={tdStyle}>{library.establishYear || "-"}</td></tr>
              <tr><td style={thStyle}>운영기관</td><td style={tdStyle}>{library.operatingAgency || "-"}</td></tr>
              {/* [수정] 휴관일: 나만의 장소에서는 아예 안 보이게 처리 */}
              <tr><td style={thStyle}>휴관일</td><td style={tdStyle}>{library.closedDay || "-"}</td></tr>
            </>
          )}

          {/* [수정] 운영시간: 나만의 장소라도 보여주되, 없으면 "-" 표시 */}
          <tr><td style={thStyle}>운영시간</td><td style={tdStyle}>{library.operatingTime || "-"}</td></tr>
          
          <tr>
            <td style={{ ...thStyle, background: "#fff3cd", borderBottom: "none" }}>📝 나의 메모</td>
            <td style={{ ...tdStyle, background: "#fff3cd", borderBottom: "none", fontWeight: "bold" }}>
              {library.memo || "작성된 메모가 없습니다."}
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <Link to="/mylist" style={{ ...btnStyle, background: "#6c757d" }}>목록으로</Link>
        <Link to={`/update/${id}`} style={{ ...btnStyle, background: "#ffc107", color: "black" }}>수정하기</Link>
        <button onClick={handleDelete} style={{ ...btnStyle, background: "#dc3545", border: "none" }}>삭제하기</button>
      </div>
    </div>
  );
};

// 스타일 (이전과 동일)
const thStyle = { padding: "12px 15px", background: "#f8f9fa", borderBottom: "1px solid #dee2e6", width: "140px", fontWeight: "600", color: "#495057", verticalAlign: "top" };
const tdStyle = { padding: "12px 15px", borderBottom: "1px solid #dee2e6", color: "#212529", lineHeight: "1.5" };
const btnStyle = { padding: "12px 25px", color: "white", textDecoration: "none", borderRadius: "6px", cursor: "pointer", fontSize: "16px", fontWeight: "bold", display: "inline-block" };

export default Detail;
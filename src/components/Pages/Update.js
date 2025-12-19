import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLibraryById, updateLibrary } from "../../services/dbApi";

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [isMySpot, setIsMySpot] = useState(false); // 나만의 장소 여부
  const [originalAddr, setOriginalAddr] = useState(""); // 주소 변경 감지용

  // 폼 상태 관리
  const [form, setForm] = useState({
    libName: "",
    addr: "", // [NEW] 주소 필드 추가
    tel: "",
    operatingTime: "",
    memo: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLibraryById(id);
        
        // 데이터 타입 확인
        const mySpotCheck = data.libType === "나만의 장소";
        setIsMySpot(mySpotCheck);
        setOriginalAddr(data.addr); // 원래 주소 저장

        setForm({
          libName: data.libName,
          addr: data.addr || "",
          tel: data.tel || "",
          operatingTime: data.operatingTime || "",
          memo: data.memo || ""
        });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. 나만의 장소이면서, 주소가 바뀌었을 경우 -> 좌표 다시 찾기 (Geocoding)
    if (isMySpot && form.addr !== originalAddr) {
      if (!form.addr) {
        alert("주소를 입력해주세요.");
        return;
      }

      const { kakao } = window;
      if (!kakao) {
        alert("지도 API 로드 실패");
        return;
      }

      const geocoder = new kakao.maps.services.Geocoder();
      
      // 주소로 좌표 검색
      geocoder.addressSearch(form.addr, async function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
          const coords = result[0]; // 새로운 좌표
          
          // 업데이트할 데이터 (좌표 포함)
          const updatedData = {
            ...form,
            geoX: coords.x,
            geoY: coords.y
          };

          await sendUpdate(updatedData); // 저장 함수 호출
        } else {
          alert("변경된 주소를 찾을 수 없습니다. 정확한 주소를 입력해주세요.");
        }
      });
    } else {
      // 2. 주소가 안 바뀌었거나 공공도서관인 경우 -> 그냥 내용만 업데이트
      await sendUpdate(form);
    }
  };

  // 실제 API로 수정 요청 보내는 함수
  const sendUpdate = async (data) => {
    try {
      await updateLibrary(id, data);
      alert("수정되었습니다!");
      navigate(`/detail/${id}`);
    } catch (error) {
      console.error("수정 실패:", error);
      alert("수정에 실패했습니다.");
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>로딩 중...</div>;

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "30px", border: "1px solid #ddd", borderRadius: "10px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        {isMySpot ? "☕ 나만의 장소 수정" : "✏️ 정보 수정"}
      </h2>
      
      <form onSubmit={handleSubmit}>
        {/* 공통: 이름 */}
        <div style={groupStyle}>
          <label style={labelStyle}>이름</label>
          <input type="text" name="libName" value={form.libName} onChange={handleChange} style={inputStyle} />
        </div>

        {/* 조건부 렌더링: 나만의 장소 -> 주소 수정 가능 / 공공도서관 -> 주소 수정 불가(보여주기만) */}
        <div style={groupStyle}>
          <label style={labelStyle}>주소 {isMySpot && "(변경 시 지도 위치도 바뀝니다)"}</label>
          {isMySpot ? (
            <input type="text" name="addr" value={form.addr} onChange={handleChange} style={inputStyle} placeholder="도로명 주소 입력" />
          ) : (
            <input type="text" value={form.addr} disabled style={{ ...inputStyle, background: "#f9f9f9", color: "#666" }} />
          )}
        </div>

        {/* 조건부 렌더링: 공공도서관만 전화번호 수정 */}
        {!isMySpot && (
          <div style={groupStyle}>
            <label style={labelStyle}>전화번호</label>
            <input type="text" name="tel" value={form.tel} onChange={handleChange} style={inputStyle} />
          </div>
        )}

        {/* 공통: 운영시간 */}
        <div style={groupStyle}>
          <label style={labelStyle}>운영시간</label>
          <input 
            type="text" 
            name="operatingTime" 
            value={form.operatingTime} 
            onChange={handleChange} 
            style={inputStyle} 
            placeholder={isMySpot ? "예: 10:00 - 22:00" : ""}
          />
        </div>

        {/* 공통: 메모 */}
        <div style={groupStyle}>
          <label style={labelStyle}>나만의 메모</label>
          <textarea 
            name="memo" 
            value={form.memo} 
            onChange={handleChange} 
            style={{ ...inputStyle, height: "120px", resize: "none" }} 
          />
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button type="submit" style={submitBtnStyle}>수정 완료</button>
          <button type="button" onClick={() => navigate(-1)} style={cancelBtnStyle}>취소</button>
        </div>
      </form>
    </div>
  );
};

// 스타일
const groupStyle = { marginBottom: "20px" };
const labelStyle = { display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box", fontSize: "15px" };
const submitBtnStyle = { flex: 2, padding: "12px", background: "#007bff", color: "white", border: "none", borderRadius: "6px", fontSize: "16px", cursor: "pointer", fontWeight: "bold" };
const cancelBtnStyle = { flex: 1, padding: "12px", background: "#f1f3f5", color: "#333", border: "1px solid #ccc", borderRadius: "6px", fontSize: "16px", cursor: "pointer" };

export default Update;
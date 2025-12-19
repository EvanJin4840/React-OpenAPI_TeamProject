import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addLibrary } from "../../services/dbApi";

const CreateSpot = () => {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    libName: "",
    addr: "",
    operatingTime: "", // [NEW] 운영시간 입력 추가
    memo: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.libName || !form.addr) {
      alert("장소 이름과 주소는 필수입니다!");
      return;
    }

    const { kakao } = window;
    if (!kakao) {
      alert("카카오 지도 API가 로드되지 않았습니다.");
      return;
    }
    
    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(form.addr, async function(result, status) {
      if (status === kakao.maps.services.Status.OK) {
        const coords = result[0];
        
        const spotData = {
          libName: form.libName,
          libType: "나만의 장소",
          libCode: "MySpot-" + Date.now(),
          addr: form.addr,
          addrDtl: "",
          geoX: coords.x, 
          geoY: coords.y,
          tel: "",
          homepage: "",
          
          // [NEW] 입력값 사용 (없으면 빈 문자열 저장 -> Detail에서 '-'로 처리됨)
          operatingTime: form.operatingTime, 
          closedDay: "", // 나만의 장소는 휴관일 없음
          
          memo: form.memo
        };

        try {
          await addLibrary(spotData);
          alert("나만의 장소가 등록되었습니다! 📍");
          navigate("/mylist");
        } catch (error) {
          console.error("저장 실패:", error);
          alert("저장에 실패했습니다.");
        }

      } else {
        alert("주소를 찾을 수 없습니다. 정확한 도로명 주소를 입력해주세요.");
      }
    });
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "30px", border: "1px solid #ddd", borderRadius: "10px" }}>
      <h2 style={{ textAlign: "center", color: "#6f42c1" }}>☕ 나만의 독서 스팟 등록</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={groupStyle}>
          <label style={labelStyle}>장소 이름 (필수)</label>
          <input type="text" name="libName" placeholder="예: 스타벅스 강남점" value={form.libName} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>주소 (필수)</label>
          <input type="text" name="addr" placeholder="예: 서울특별시 강남구 테헤란로 123" value={form.addr} onChange={handleChange} style={inputStyle} />
        </div>

        {/* [NEW] 운영시간 입력 필드 추가 */}
        <div style={groupStyle}>
          <label style={labelStyle}>운영시간</label>
          <input 
            type="text" 
            name="operatingTime" 
            placeholder="예: 매일 09:00 - 22:00 (비워두면 '-' 표시)" 
            value={form.operatingTime} 
            onChange={handleChange} 
            style={inputStyle} 
          />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>나만의 메모</label>
          <textarea name="memo" placeholder="이 장소의 특징을 적어주세요." value={form.memo} onChange={handleChange} style={{ ...inputStyle, height: "100px", resize: "none" }} />
        </div>

        <button type="submit" style={btnStyle}>등록하기</button>
      </form>
    </div>
  );
};

// 스타일
const groupStyle = { marginBottom: "20px" };
const labelStyle = { display: "block", marginBottom: "8px", fontWeight: "bold" };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" };
const btnStyle = { width: "100%", padding: "15px", background: "#6f42c1", color: "white", border: "none", borderRadius: "6px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" };

export default CreateSpot;
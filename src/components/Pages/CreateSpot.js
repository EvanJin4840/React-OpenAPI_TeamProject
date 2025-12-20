import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addLibrary } from "../../services/dbApi";

const CreateSpot = () => {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    libName: "",
    addr: "",
    operatingTime: "", 
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
          operatingTime: form.operatingTime, 
          closedDay: "",
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
    <div className="form-container">
      <h2 className="form-header" style={{ color: "#8b5cf6" }}>
        ☕ 나만의 독서 스팟 등록
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">장소 이름 (필수)</label>
          <input 
            type="text" 
            name="libName" 
            className="form-control"
            placeholder="예: 스타벅스 강남점" 
            value={form.libName} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-group">
          <label className="form-label">주소 (필수)</label>
          <input 
            type="text" 
            name="addr" 
            className="form-control"
            placeholder="예: 서울특별시 강남구 테헤란로 123" 
            value={form.addr} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-group">
          <label className="form-label">운영시간</label>
          <input 
            type="text" 
            name="operatingTime" 
            className="form-control"
            placeholder="예: 매일 09:00 - 22:00" 
            value={form.operatingTime} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-group">
          <label className="form-label">나만의 메모</label>
          <textarea 
            name="memo" 
            className="form-control"
            placeholder="이 장소의 분위기나 특징을 적어주세요." 
            value={form.memo} 
            onChange={handleChange} 
          />
        </div>

        {/* 보라색 버튼 적용 (나만의 장소 테마) */}
        <button 
          type="submit" 
          className="btn-primary" 
          style={{ width: "100%", backgroundColor: "#8b5cf6", marginTop: "10px" }}
        >
          등록하기
        </button>
      </form>
    </div>
  );
};

export default CreateSpot;
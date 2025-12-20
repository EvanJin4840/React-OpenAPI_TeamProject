import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLibraryById, updateLibrary } from "../../services/dbApi";

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [isMySpot, setIsMySpot] = useState(false);
  const [originalAddr, setOriginalAddr] = useState(""); 

  const [form, setForm] = useState({
    libName: "",
    addr: "",
    tel: "",
    operatingTime: "",
    memo: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLibraryById(id);
        
        const mySpotCheck = data.libType === "나만의 장소";
        setIsMySpot(mySpotCheck);
        setOriginalAddr(data.addr);

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
      
      geocoder.addressSearch(form.addr, async function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
          const coords = result[0];
          
          const updatedData = {
            ...form,
            geoX: coords.x,
            geoY: coords.y
          };

          await sendUpdate(updatedData);
        } else {
          alert("변경된 주소를 찾을 수 없습니다.");
        }
      });
    } else {
      await sendUpdate(form);
    }
  };

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

  // [디자인] 로딩 스피너 적용
  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p style={{ color: "#64748b" }}>정보를 불러오는 중입니다...</p>
    </div>
  );

  return (
    <div className="form-container">
      <h2 className="form-header">
        {isMySpot ? "☕ 나만의 장소 수정" : "✏️ 정보 수정"}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">이름</label>
          <input 
            type="text" 
            name="libName" 
            className="form-control"
            value={form.libName} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            주소 {isMySpot && <span style={{fontSize: "0.8rem", color: "#ef4444"}}>(변경 시 지도 위치도 이동됨)</span>}
          </label>
          {isMySpot ? (
            <input 
              type="text" 
              name="addr" 
              className="form-control"
              value={form.addr} 
              onChange={handleChange} 
              placeholder="도로명 주소 입력" 
            />
          ) : (
            <input 
              type="text" 
              className="form-control"
              value={form.addr} 
              disabled 
              style={{ background: "#f1f5f9", color: "#94a3b8" }} 
            />
          )}
        </div>

        {!isMySpot && (
          <div className="form-group">
            <label className="form-label">전화번호</label>
            <input 
              type="text" 
              name="tel" 
              className="form-control"
              value={form.tel} 
              onChange={handleChange} 
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">운영시간</label>
          <input 
            type="text" 
            name="operatingTime" 
            className="form-control"
            value={form.operatingTime} 
            onChange={handleChange} 
            placeholder={isMySpot ? "예: 10:00 - 22:00" : ""}
          />
        </div>

        <div className="form-group">
          <label className="form-label">나만의 메모</label>
          <textarea 
            name="memo" 
            className="form-control"
            value={form.memo} 
            onChange={handleChange} 
          />
        </div>

        {/* 버튼 그룹 (Flexbox) */}
        <div style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
          <button type="submit" className="btn-primary" style={{ flex: 2 }}>
            수정 완료
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="btn-secondary" /* index.css에 정의한 회색 버튼 */
            style={{ flex: 1, backgroundColor: "#94a3b8", color: "white" }} 
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default Update;
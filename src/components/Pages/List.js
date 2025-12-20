import React, { useEffect, useState } from "react";
import { getLibraryList } from "../../services/openApi";
import { addLibrary } from "../../services/dbApi";
import MapCard from "../Common/MapCard";

// 구/군 데이터 (기존과 동일)
const DISTRICTS = {
  서울: [
    "전체", "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", 
    "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", 
    "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"
  ],
  부산: [
    "전체", "강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구", 
    "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구"
  ],
  대구: [
    "전체", "군위군", "남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구"
  ],
  인천: [
    "전체", "강화군", "계양구", "남동구", "동구", "미추홀구", "부평구", "서구", "연수구", 
    "옹진군", "중구"
  ],
  광주: [ "전체", "광산구", "남구", "동구", "북구", "서구" ],
  대전: [ "전체", "대덕구", "동구", "서구", "유성구", "중구" ],
  울산: [ "전체", "남구", "동구", "북구", "울주군", "중구" ],
  세종: ["전체", "세종시"],
  경기: [
    "전체", "가평군", "고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", 
    "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", 
    "안양시", "양주시", "양평군", "여주시", "연천군", "오산시", "용인시", "의왕시", "의정부시", 
    "이천시", "파주시", "평택시", "포천시", "하남시", "화성시"
  ],
  강원: [
    "전체", "강릉시", "고성군", "동해시", "삼척시", "속초시", "양구군", "양양군", "영월군", 
    "원주시", "인제군", "정선군", "철원군", "춘천시", "태백시", "평창군", "홍천군", "화천군", "횡성군"
  ],
  충북: [ "전체", "괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "제천시", "증평군", "진천군", "청주시", "충주시" ],
  충남: [ "전체", "계룡시", "공주시", "금산군", "논산시", "당진시", "보령시", "부여군", "서산시", "서천군", "아산시", "예산군", "천안시", "청양군", "태안군", "홍성군" ],
  전북: [ "전체", "고창군", "군산시", "김제시", "남원시", "무주군", "부안군", "순창군", "완주군", "익산시", "임실군", "장수군", "전주시", "정읍시", "진안군" ],
  전남: [ "전체", "강진군", "고흥군", "곡성군", "광양시", "구례군", "나주시", "담양군", "목포시", "무안군", "보성군", "순천시", "신안군", "여수시", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군" ],
  경북: [ "전체", "경산시", "경주시", "고령군", "구미시", "김천시", "문경시", "봉화군", "상주시", "성주군", "안동시", "영덕군", "영양군", "영주시", "영천시", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군", "포항시" ],
  경남: [ "전체", "거제시", "거창군", "고성군", "김해시", "남해군", "밀양시", "사천시", "산청군", "양산시", "의령군", "진주시", "창녕군", "창원시", "통영시", "하동군", "함안군", "함양군", "합천군" ],
  제주: ["전체", "서귀포시", "제주시"]
};

const List = () => {
  const [libraries, setLibraries] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [region, setRegion] = useState("서울");
  const [city, setCity] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedLib, setSelectedLib] = useState(null);

  const fetchLibraries = async (pageNumber) => {
    setLoading(true);
    try {
      const searchCity = city === "전체" ? "" : city;
      const data = await getLibraryList(region, searchCity, keyword, pageNumber, 20);
      setLibraries(data.list);
      setTotalCount(data.total);
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraries(page);
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLibraries(1);
  };

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
    setCity("전체");
    setPage(1);
  };

  const handleSave = async (lib) => {
    const libraryData = {
      libName: lib.libName,
      libType: lib.libGubunNm,
      libCode: lib.libCode,
      addr: lib.addr,
      addrDtl: lib.addrDtl || "",
      geoX: lib.geoX,
      geoY: lib.geoY,
      tel: lib.tel || lib.phone,
      fax: lib.fax || "정보 없음",
      homepage: lib.libUrl || lib.liburl || lib.homepage || "",
      operatingTime: lib.openingTime,
      closedDay: lib.libClosed,
      establishYear: lib.establish,
      operatingAgency: lib.manageOrgan,
      memo: "-"
    };

    if (window.confirm(`[${lib.libName}]을(를) 내 서재에 저장하시겠습니까?`)) {
      try {
        await addLibrary(libraryData);
        alert("저장되었습니다!");
        setSelectedLib(null);
      } catch (error) {
        console.error("저장 실패:", error);
        alert("저장에 실패했습니다.");
      }
    }
  };

  const openModal = (lib) => setSelectedLib(lib);
  const closeModal = () => setSelectedLib(null);

  const totalPages = Math.ceil(totalCount / 20);
  const pageGroup = Math.ceil(page / 10);
  const lastPage = pageGroup * 10 > totalPages ? totalPages : pageGroup * 10;
  const firstPage = (pageGroup - 1) * 10 + 1;

  return (
    <div className="container" style={{maxWidth: "1200px"}}>
      <h2 className="text-center mb-4">전국 도서관 찾기</h2>

      {/* 검색 폼 */}
      <form onSubmit={handleSearch} style={searchFormStyle}>
        <select value={region} onChange={handleRegionChange} style={selectStyle}>
          {Object.keys(DISTRICTS).map((r) => <option key={r} value={r}>{r}</option>)}
        </select>

        <select value={city} onChange={(e) => setCity(e.target.value)} style={selectStyle}>
          {DISTRICTS[region] ? (
            DISTRICTS[region].map((c) => <option key={c} value={c}>{c}</option>)
          ) : (
            <option value="">전체</option>
          )}
        </select>

        <input
          type="text"
          placeholder="도서관명 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={inputStyle} 
        />

        {/* 인라인 스타일 대신 클래스 사용 추천 (btn-primary) */}
        <button type="submit" className="btn-primary" style={{width: "100px", flexShrink: 0}}>
          검색
        </button>
      </form>

      {/* 로딩 및 리스트 영역 */}
      {loading ? (
        <p style={{ textAlign: "center", padding: "50px" }}>데이터를 불러오는 중입니다...</p>
      ) : (
        <>
          {/* 카드 그리드 레이아웃 적용 */}
          <div className="card-grid">
            {libraries && libraries.length > 0 ? (
              libraries.map((lib, index) => (
                <div key={index} className="card">
                  {/* 지도 영역 */}
                  <div style={{ height: "180px", overflow: "hidden" }}>
                    <MapCard lat={lib.geoY} lng={lib.geoX} />
                  </div>

                  {/* 텍스트 내용 영역 */}
                  <div className="card-body">
                    <h4 
                      className="card-title"
                      onClick={() => openModal(lib)} 
                      title="클릭하여 상세 정보 보기"
                    >
                      {lib.libName}
                    </h4>
                    
                    <p className="card-text">📍 {lib.addr} {lib.addrDtl}</p>
                    <p className="card-text">📞 {lib.tel || lib.phone || "번호 없음"}</p>
                    
                    <div style={{ margin: "10px 0" }}>
                      {(lib.libUrl || lib.liburl || lib.homepage) ? (
                        <a 
                          href={lib.libUrl || lib.liburl || lib.homepage} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{ fontSize: "0.85rem", color: "#4f46e5", textDecoration: "none" }}
                        >
                          🌐 홈페이지 방문
                        </a>
                      ) : (
                        <span style={{ fontSize: "0.85rem", color: "#aaa" }}>🌐 정보 없음</span>
                      )}
                    </div>

                    {/* 저장 버튼 (btn-success 느낌의 초록 버튼) */}
                    <button 
                      onClick={() => handleSave(lib)} 
                      className="btn-primary"
                      style={{ marginTop: "auto", width: "100%", backgroundColor: "#10b981" }} // 초록색 오버라이딩
                    >
                      + 내 리스트 담기
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "50px" }}>
                검색 결과가 없습니다.
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          {totalCount > 0 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "5px", paddingBottom: "50px" }}>
              <button 
                onClick={() => setPage(firstPage - 1)} 
                disabled={firstPage === 1} 
                className="pagination-btn"
              >
                &lt;
              </button>
              {Array.from({ length: lastPage - firstPage + 1 }, (_, i) => (
                <button
                  key={firstPage + i}
                  onClick={() => setPage(firstPage + i)}
                  className={`pagination-btn ${page === firstPage + i ? "active" : ""}`}
                >
                  {firstPage + i}
                </button>
              ))}
              <button 
                onClick={() => setPage(lastPage + 1)} 
                disabled={lastPage === totalPages} 
                className="pagination-btn"
              >
                &gt;
              </button>
            </div>
          )}
        </>
      )}

      {/* 모달 (Modal) */}
      {selectedLib && (
        <div style={modalOverlayStyle} onClick={closeModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontSize: "1.25rem" }}>📖 {selectedLib.libName}</h3>
              <button onClick={closeModal} style={closeButtonStyle}>✖</button>
            </div>
            
            <div style={modalBodyStyle}>
              <div style={{ height: "250px", marginBottom: "20px", borderRadius: "8px", overflow: "hidden" }}>
                <MapCard lat={selectedLib.geoY} lng={selectedLib.geoX} />
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr><td style={thStyle}>구분</td><td style={tdStyle}>{selectedLib.libGubunNm}</td></tr>
                  <tr><td style={thStyle}>주소</td><td style={tdStyle}>{selectedLib.addr} {selectedLib.addrDtl}</td></tr>
                  <tr><td style={thStyle}>전화</td><td style={tdStyle}>{selectedLib.tel || selectedLib.phone || "-"}</td></tr>
                  <tr><td style={thStyle}>운영시간</td><td style={tdStyle}>{selectedLib.openingTime || "-"}</td></tr>
                  <tr><td style={thStyle}>휴관일</td><td style={tdStyle}>{selectedLib.libClosed || "-"}</td></tr>
                  <tr><td style={thStyle}>홈페이지</td><td style={tdStyle}>
                    {selectedLib.libUrl || selectedLib.liburl || selectedLib.homepage ? (
                      <a href={selectedLib.libUrl || selectedLib.liburl || selectedLib.homepage} target="_blank" rel="noreferrer" style={{color: "#4f46e5"}}>{selectedLib.libUrl}</a>
                    ) : "-"}
                  </td></tr>
                </tbody>
              </table>
            </div>

            <div style={modalFooterStyle}>
              <button onClick={() => handleSave(selectedLib)} className="btn-primary" style={{ width: "100%" }}>
                이 도서관 저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 남겨둔 인라인 스타일 (검색창 레이아웃 등 미세 조정용) ---
const searchFormStyle = { 
  width: "100%", marginBottom: "30px", padding: "20px", background: "#fff", 
  borderRadius: "12px", display: "flex", gap: "10px", flexWrap: "wrap",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0"
};
const commonInputStyle = { height: "45px", borderRadius: "8px", border: "1px solid #ddd", padding: "0 15px", fontSize: "15px", boxSizing: "border-box" };
const selectStyle = { ...commonInputStyle, flex: "1", cursor: "pointer", minWidth: "120px" };
const inputStyle = { ...commonInputStyle, flex: "2", minWidth: "200px" };

// 모달 스타일 (간단히 유지)
const modalOverlayStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, backdropFilter: "blur(2px)" };
const modalContentStyle = { background: "white", width: "90%", maxWidth: "600px", maxHeight: "90vh", borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" };
const modalHeaderStyle = { padding: "20px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" };
const modalBodyStyle = { padding: "20px", overflowY: "auto" };
const modalFooterStyle = { padding: "20px", borderTop: "1px solid #e2e8f0", background: "#fff" };
const closeButtonStyle = { background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", color: "#64748b" };
const thStyle = { padding: "12px 8px", background: "#f8fafc", color: "#64748b", fontWeight: "600", width: "80px", fontSize: "14px", verticalAlign: "top" };
const tdStyle = { padding: "12px 8px", color: "#333", fontSize: "14px", lineHeight: "1.5" };

export default List;
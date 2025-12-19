import React, { useEffect, useState } from "react";
import { getLibraryList } from "../../services/openApi";
import { addLibrary } from "../../services/dbApi";
import MapCard from "../Common/MapCard";

// 구/군 데이터
// 대한민국 전체 행정구역 데이터 (시/도 및 시/군/구): API 내 지역 이름을 역으로 카테고리화하기보다 이미 지역구는 고정되어 있음을 이용해 하드코딩했습니다.
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
  광주: [
    "전체", "광산구", "남구", "동구", "북구", "서구"
  ],
  대전: [
    "전체", "대덕구", "동구", "서구", "유성구", "중구"
  ],
  울산: [
    "전체", "남구", "동구", "북구", "울주군", "중구"
  ],
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
  충북: [
    "전체", "괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "제천시", "증평군", 
    "진천군", "청주시", "충주시"
  ],
  충남: [
    "전체", "계룡시", "공주시", "금산군", "논산시", "당진시", "보령시", "부여군", "서산시", 
    "서천군", "아산시", "예산군", "천안시", "청양군", "태안군", "홍성군"
  ],
  전북: [
    "전체", "고창군", "군산시", "김제시", "남원시", "무주군", "부안군", "순창군", "완주군", 
    "익산시", "임실군", "장수군", "전주시", "정읍시", "진안군"
  ],
  전남: [
    "전체", "강진군", "고흥군", "곡성군", "광양시", "구례군", "나주시", "담양군", "목포시", 
    "무안군", "보성군", "순천시", "신안군", "여수시", "영광군", "영암군", "완도군", "장성군", 
    "장흥군", "진도군", "함평군", "해남군", "화순군"
  ],
  경북: [
    "전체", "경산시", "경주시", "고령군", "구미시", "김천시", "문경시", "봉화군", "상주시", 
    "성주군", "안동시", "영덕군", "영양군", "영주시", "영천시", "예천군", "울릉군", "울진군", 
    "의성군", "청도군", "청송군", "칠곡군", "포항시"
  ],
  경남: [
    "전체", "거제시", "거창군", "고성군", "김해시", "남해군", "밀양시", "사천시", "산청군", 
    "양산시", "의령군", "진주시", "창녕군", "창원시", "통영시", "하동군", "함안군", "함양군", "합천군"
  ],
  제주: ["전체", "서귀포시", "제주시"]
};

const List = () => {
  // 상태 관리
  const [libraries, setLibraries] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [region, setRegion] = useState("서울");
  const [city, setCity] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // 선택된 도서관 (모달용) 상태
  const [selectedLib, setSelectedLib] = useState(null);

  // 데이터 가져오기
  const fetchLibraries = async (pageNumber) => {
    setLoading(true);
    try {
      const searchCity = city === "전체" ? "" : city;
      const data = await getLibraryList(region, searchCity, keyword, pageNumber, 20);
      console.log("API 원본 데이터 확인:", data.list[0]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // 찜하기 핸들러
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
        setSelectedLib(null); // 모달에서 저장했다면 모달 닫기
      } catch (error) {
        console.error("저장 실패:", error);
        alert("저장에 실패했습니다.");
      }
    }
  };

  // 도서관 제목 클릭 핸들러 (모달 열기)
  const openModal = (lib) => {
    setSelectedLib(lib);
  };

  // 모달 닫기 핸들러
  const closeModal = () => {
    setSelectedLib(null);
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(totalCount / 20);
  const pageGroup = Math.ceil(page / 10);
  const lastPage = pageGroup * 10 > totalPages ? totalPages : pageGroup * 10;
  const firstPage = (pageGroup - 1) * 10 + 1;

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>전국 도서관 찾기</h2>

      {/* 검색바 */}
{/* 검색바 영역 수정 */}
<form onSubmit={handleSearch} style={searchFormStyle}>
  
  {/* 지역 선택 */}
  <select value={region} onChange={handleRegionChange} style={selectStyle}>
    {Object.keys(DISTRICTS).map((r) => <option key={r} value={r}>{r}</option>)}
  </select>

  {/* 시군구 선택 */}
  <select value={city} onChange={(e) => setCity(e.target.value)} style={selectStyle}>
    {DISTRICTS[region] ? (
      DISTRICTS[region].map((c) => <option key={c} value={c}>{c}</option>)
    ) : (
      <option value="">전체</option>
    )}
  </select>

  {/* 검색어 입력 */}
  <input
    type="text"
    placeholder="도서관명 검색"
    value={keyword}
    onChange={(e) => setKeyword(e.target.value)}
    style={inputStyle} 
  />

  {/* 검색 버튼 */}
  <button type="submit" style={buttonStyle}>검색</button>
</form>

      {/* 리스트 영역 */}
      {loading ? (
        <p style={{ textAlign: "center" }}>데이터를 불러오는 중입니다...</p>
      ) : (
        <>
          <div style={gridStyle}>
            {libraries && libraries.length > 0 ? (
              libraries.map((lib, index) => (
                <div key={index} style={cardStyle}>
                  <MapCard lat={lib.geoY} lng={lib.geoX} />
                  <div style={{ padding: "15px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <h4 
                      onClick={() => openModal(lib)} 
                      style={titleLinkStyle}
                      title="클릭하여 상세 정보 보기"
                    >
                      {lib.libName}
                    </h4>
                    
                    <p style={infoStyle}>📍 {lib.addr} {lib.addrDtl}</p>
                    <p style={infoStyle}>📞 {lib.tel || lib.phone || "전화번호 없음"}</p>
                    {(lib.libUrl || lib.liburl || lib.homepage) ? (
                    <a 
                    href={lib.libUrl || lib.liburl || lib.homepage} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{
                      fontSize: "10px", 
                      color: "#000000ff", 
                      textDecoration: "none", 
                      marginBottom: "5px", 
                      display: "inline-block",
                    }}
                  >
                    🌐 {lib.libUrl}
                  </a>
                ) : (
                  <span style={{ fontSize: "13px", color: "#aaa", marginBottom: "5px", display: "inline-block" }}>
                    🌐 홈페이지 정보 없음
                  </span>
                )}
                    <button onClick={() => handleSave(lib)} style={saveButtonStyle}>
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
              <button onClick={() => setPage(firstPage - 1)} disabled={firstPage === 1} style={pageButtonStyle}>&lt;</button>
              {Array.from({ length: lastPage - firstPage + 1 }, (_, i) => (
                <button
                  key={firstPage + i}
                  onClick={() => setPage(firstPage + i)}
                  style={{
                    ...pageButtonStyle,
                    background: page === firstPage + i ? "#007bff" : "white",
                    color: page === firstPage + i ? "white" : "#333",
                    fontWeight: page === firstPage + i ? "bold" : "normal"
                  }}
                >
                  {firstPage + i}
                </button>
              ))}
              <button onClick={() => setPage(lastPage + 1)} disabled={lastPage === totalPages} style={pageButtonStyle}>&gt;</button>
            </div>
          )}
        </>
      )}

      {/* 상세 정보 모달 (Modal) */}
      {selectedLib && (
        <div style={modalOverlayStyle} onClick={closeModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0 }}>📖 {selectedLib.libName}</h3>
              <button onClick={closeModal} style={closeButtonStyle}>✖</button>
            </div>
            
            <div style={modalBodyStyle}>
              {/* 모달 내 지도 크게 보기 */}
              <div style={{ height: "250px", marginBottom: "20px", border: "1px solid #ddd" }}>
                <MapCard lat={selectedLib.geoY} lng={selectedLib.geoX} />
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr><td style={thStyle}>구분</td><td style={tdStyle}>{selectedLib.libGubunNm}</td></tr>
                  <tr><td style={thStyle}>주소</td><td style={tdStyle}>{selectedLib.addr} {selectedLib.addrDtl}</td></tr>
                  <tr><td style={thStyle}>전화</td><td style={tdStyle}>{selectedLib.tel || selectedLib.phone || "-"}</td></tr>
                  <tr><td style={thStyle}>팩스</td><td style={tdStyle}>{selectedLib.fax || "-"}</td></tr>
                  <tr><td style={thStyle}>운영시간</td><td style={tdStyle}>{selectedLib.openingTime || "-"}</td></tr>
                  <tr><td style={thStyle}>휴관일</td><td style={tdStyle}>{selectedLib.libClosed || "-"}</td></tr>
                  <tr><td style={thStyle}>개관년도</td><td style={tdStyle}>{selectedLib.establish || "-"}</td></tr>
                  <tr><td style={thStyle}>홈페이지</td><td style={tdStyle}>
                    {selectedLib.libUrl || selectedLib.liburl || selectedLib.homepage ? (
                      <a href={selectedLib.libUrl || selectedLib.liburl || selectedLib.homepage} target="_blank" rel="noreferrer" style={{color: "#007bff"}}>{selectedLib.libUrl}</a>
                    ) : "-"}
                  </td></tr>
                </tbody>
              </table>
            </div>

            <div style={modalFooterStyle}>
              <button onClick={() => handleSave(selectedLib)} style={{ ...saveButtonStyle, width: "auto", padding: "10px 20px", fontSize: "16px" }}>
                이 도서관 저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 1. 검색 폼 컨테이너: 가로로 꽉 차게 설정
const searchFormStyle = { 
  width: "100%", 
  marginBottom: "30px", 
  padding: "20px", 
  background: "#f8f9fa", 
  borderRadius: "12px", 
  display: "flex", 
  justifyContent: "space-between", 
  gap: "10px", 
  flexWrap: "wrap",
  boxSizing: "border-box"
};

// 2. 공통 입력 스타일 (높이 통일용)
const commonInputStyle = {
  height: "50px",
  borderRadius: "6px", 
  border: "1px solid #ddd",
  padding: "0 15px",
  fontSize: "16px",
  boxSizing: "border-box",
  minWidth: "150px"
};

// 3. 드롭다운(Select) 스타일: 공간을 1만큼 차지
const selectStyle = {
  ...commonInputStyle,    // 공통 스타일 상속
  flex: "1",              // 비율 1
  cursor: "pointer"
};

// 4. 검색창(Input) 스타일: 공간을 2만큼 차지 (더 길게)
const inputStyle = {
  ...commonInputStyle,    // 공통 스타일 상속
  flex: "2",              // 비율 2 (드롭다운보다 2배 김)
};

// 5. 버튼 스타일: 고정 너비 또는 비율 설정
const buttonStyle = {
  height: "50px",         // 버튼도 높이 50px
  width: "120px",         // 버튼 너비 고정
  borderRadius: "6px", 
  border: "none", 
  background: "#007bff", 
  color: "white", 
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
  flexShrink: 0           // 화면이 줄어도 버튼 크기는 줄지 않음
};

const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px"};
const cardStyle = { background: "white", border: "1px solid #eee", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", overflow: "hidden", display: "flex", flexDirection: "column" };
const titleLinkStyle = { margin: "0 0 10px 0", fontSize: "16px", color: "#333", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "4px" };
const infoStyle = { fontSize: "13px", color: "#555", margin: "5px 0", lineHeight: "1.4" };
const saveButtonStyle = { marginTop: "auto", padding: "8px", background: "#28a745", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", width: "100%", fontWeight: "bold" };
const pageButtonStyle = { padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px", background: "white", cursor: "pointer", color: "#333" };
const modalOverlayStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalContentStyle = { background: "white", width: "90%", maxWidth: "600px", maxHeight: "90vh", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 5px 20px rgba(0,0,0,0.3)" };
const modalHeaderStyle = { padding: "20px", background: "#f1f3f5", borderBottom: "1px solid #ddd", display: "flex", justifyContent: "space-between", alignItems: "center" };
const modalBodyStyle = { padding: "20px", overflowY: "auto" };
const modalFooterStyle = { padding: "20px", borderTop: "1px solid #ddd", textAlign: "center", background: "#fff" };
const closeButtonStyle = { background: "transparent", border: "none", fontSize: "20px", cursor: "pointer" };
const thStyle = { padding: "8px", background: "#f8f9fa", borderBottom: "1px solid #eee", fontWeight: "bold", width: "100px", fontSize: "14px" };
const tdStyle = { padding: "8px", borderBottom: "1px solid #eee", fontSize: "14px" };

export default List;
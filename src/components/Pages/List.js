import React, { useEffect, useState } from "react";
import { getLibraryList } from "../../services/openApi";
import { addLibrary } from "../../services/dbApi";

const DISTRICTS = {
  서울: ["전체", "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
  // ... (기존 시/도 데이터 유지)
};

const List = () => {
  const [libraries, setLibraries] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [region, setRegion] = useState("서울");
  const [city, setCity] = useState("전체");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchLibraries = async (pageNumber) => {
    setLoading(true);
    try {
      const searchCity = city === "전체" ? "" : city;
      const data = await getLibraryList(region, searchCity, keyword, pageNumber, 20);
      setLibraries(data.list || []);
      setTotalCount(data.total || 0);
    } catch (error) {
      console.error("데이터 로딩 실패", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLibraries(page); }, [page]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchLibraries(1); };

  const handleSave = async (lib) => {
    if (window.confirm(`[${lib.libName}]을(를) 내 리스트에 저장하시겠습니까?`)) {
      try {
        await addLibrary({ ...lib, memo: "-" });
        alert("저장되었습니다!");
      } catch (error) { alert("저장에 실패했습니다."); }
    }
  };

  const totalPages = Math.ceil(totalCount / 20);
  const firstPage = Math.floor((page - 1) / 10) * 10 + 1;
  const lastPage = Math.min(firstPage + 9, totalPages);

  return (
    <div className="container" style={{maxWidth: "1300px", marginTop: "40px"}}>
      <h2 className="text-center mb-5 fw-bold" style={{ color: "#1e293b" }}>📚 전국 도서관 찾기</h2>

      {/* 검색 섹션 디자인 */}
      <form onSubmit={handleSearch} className="card border-0 shadow-sm p-4 mb-5 bg-white rounded-4">
        <div className="row g-3">
          <div className="col-md-3">
            <select value={region} onChange={(e) => {setRegion(e.target.value); setCity("전체");}} className="form-select border-light bg-light py-2">
              {Object.keys(DISTRICTS).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <select value={city} onChange={(e) => setCity(e.target.value)} className="form-select border-light bg-light py-2">
              {(DISTRICTS[region] || ["전체"]).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <input type="text" className="form-control border-light bg-light py-2" placeholder="도서관명을 입력하세요" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100 fw-bold py-2 shadow-sm" style={{backgroundColor: "#4f46e5", border: "none"}}>검색</button>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner mx-auto"></div> {/* 로딩 스피너 시각화 */}
        </div>
      ) : (
        <>
          {/* 카드 그리드 섹션 (1열 4개 배치) */}
          <div className="card-grid">
            {libraries.map((lib, idx) => (
              <div key={idx} className="lib-card">
                {/* 지도 영역 자리 (디자인만 유지) */}
                <div style={{ height: "160px", backgroundColor: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
                   <span className="small">지도 준비 중</span>
                </div>
                
                <div className="p-4 d-flex flex-column flex-grow-1">
                  <h5 className="fw-bold mb-3 text-truncate" style={{color: "#334155"}}>{lib.libName}</h5>
                  <div className="small text-muted mb-2"><i className="bi bi-geo-alt-fill text-danger me-2"></i>{lib.addr}</div>
                  <div className="small text-muted mb-3"><i className="bi bi-telephone-fill me-2"></i>{lib.tel || "정보 없음"}</div>
                  
                  {/* 요청사항: 홈페이지 주소 직접 노출 */}
                  <div className="mb-4">
                    <p className="fw-bold small mb-1" style={{fontSize: "0.75rem", color: "#64748b"}}>🌐 공식 홈페이지 링크</p>
                    {lib.libUrl || lib.homepage ? (
                      <a href={lib.libUrl || lib.homepage} target="_blank" rel="noreferrer" className="text-primary text-decoration-none d-block text-truncate small" style={{fontSize: "0.85rem"}}>
                        {lib.libUrl || lib.homepage}
                      </a>
                    ) : (
                      <span className="text-muted small">주소 정보 없음</span>
                    )}
                  </div>

                  <button onClick={() => handleSave(lib)} className="btn btn-success w-100 fw-bold py-2 mt-auto" style={{backgroundColor: "#1db978", border: "none", borderRadius: "10px"}}>
                    + 내 리스트 담기
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 요청사항: 페이지네이션 마진 및 흰색-그림자 테두리 버튼 */}
          <div className="custom-pagination">
            <button className="page-btn" disabled={firstPage === 1} onClick={() => setPage(firstPage - 1)}>&lt;</button>
            {Array.from({ length: lastPage - firstPage + 1 }, (_, i) => (
              <button key={i} className={`page-btn ${page === firstPage + i ? "active" : ""}`} onClick={() => setPage(firstPage + i)}>
                {firstPage + i}
              </button>
            ))}
            <button className="page-btn" disabled={lastPage === totalPages} onClick={() => setPage(lastPage + 1)}>&gt;</button>
          </div>
        </>
      )}
    </div>
  );
};

export default List;
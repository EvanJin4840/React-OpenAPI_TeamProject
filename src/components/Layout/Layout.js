import { Outlet, Link, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation(); // 현재 경로 확인용

  return (
    <div>
      {/* --- 상단 네비게이션 바 --- */}
      <header style={{
        background: "#343a40",
        padding: "15px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white"
      }}>
          <Link 
            to="/list" 
            style={{ 
              color: "white",
              textDecoration: "none", 
              marginRight: "20px",
              fontWeight: "bold",
            }}
          >
            도서관 검색
          </Link>
        
        <nav>
          <Link 
            to="/mylist" 
            style={{ 
              color: location.pathname.includes("mylist") ? "#ffc107" : "white",
              textDecoration: "none",
              fontWeight: "bold"
            }}
          >
            내 서재
          </Link>
        </nav>
      </header>

      {/* --- 페이지 내용이 들어가는 곳 --- */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", minHeight: "80vh" }}>
        <Outlet />
      </main>

      {/* --- 푸터 --- */}
      <footer style={{ textAlign: "center", padding: "20px", background: "#f8f9fa", marginTop: "50px", color: "#666" }}>
        &copy; 2025 Library Project. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
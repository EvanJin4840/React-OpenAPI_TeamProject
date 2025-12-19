import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import List from "./components/Pages/List";
import MyList from "./components/Pages/MyList";
import Detail from "./components/Pages/Detail"; 
import Update from "./components/Pages/Update"; 
import CreateSpot from "./components/Pages/CreateSpot";

import Downloader from "./components/Pages/Downloader";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* 1. 기본 접속 시 List(검색) 페이지로 이동 */}
          <Route index element={<Navigate to="/list" replace />} />
          <Route path="/download" element={<Downloader />} />
          {/* 2. 도서관 검색 페이지 */}
          <Route path="/list" element={<List />} />
          
          {/* 3. 내 서재(저장된 목록) 페이지 */}
          <Route path="/mylist" element={<MyList />} />
          
          {/* 4. 상세 페이지 (id를 파라미터로 받음) */}
          <Route path="/detail/:id" element={<Detail />} />
          
          {/* 5. 수정 페이지 (id를 파라미터로 받음) */}
          <Route path="/update/:id" element={<Update />} />

          <Route path="create-spot" element={<CreateSpot />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
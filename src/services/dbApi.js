import axios from 'axios';

// ▼▼▼ 본인의 MockAPI 주소인지 꼭 확인하세요! ▼▼▼
const DB_URL = "https://692c0c97c829d464006e5213.mockapi.io/libraries"; 

// [Create] 도서관 찜하기
export const addLibrary = async (libraryData) => {
  const response = await axios.post(DB_URL, libraryData);
  return response.data;
};

// [Read] 내 도서관 전체 목록 보기
export const getMyLibraries = async () => {
  const response = await axios.get(DB_URL);
  return response.data;
};

// ▼▼▼ [NEW] 누락되었던 부분: 특정 도서관 1개 정보 가져오기 ▼▼▼
export const getLibraryById = async (id) => {
  const response = await axios.get(`${DB_URL}/${id}`);
  return response.data;
};
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

// [Update] 정보 수정
export const updateLibrary = async (id, updatedData) => {
  const response = await axios.put(`${DB_URL}/${id}`, updatedData);
  return response.data;
};

// [Delete] 삭제하기
export const deleteLibrary = async (id) => {
  const response = await axios.delete(`${DB_URL}/${id}`);
  return response.data;
};
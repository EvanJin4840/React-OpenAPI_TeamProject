import axios from 'axios';

const FUNCTION_URL = "/.netlify/functions/libraryProxy";

export const getLibraryList = async (region = "", city = "", libName = "", page = 1, size = 20) => {
  try {
    const response = await axios.get(FUNCTION_URL, {
      params: {
        region,
        city,
        libName,
        page,
        size
      }
    });

    console.log("Functions 응답:", response.data);

    if (response.data && response.data.result) {
      let rawList = response.data.result.list || [];
      const cleanList = rawList.filter((lib) => {
        const name = lib.libName || "";
        //코드 부연설명: API 내 도서관 데이터에 공립학교 도서관 및 교화시설 도서관도 포함이 되어있어, 대중 접근이 제한되는 시설은 검색에서 제외하고자 데이터를 필터링하는 기능을 추가했습니다.
        if (name.includes("구치소")) return false;
        if (name.includes("교도소")) return false;
        if (name.includes("보호소")) return false; 
        if (name.includes("초등학교")) return false;
        if (name.includes("중학교")) return false;
        if (name.includes("고등학교")) return false;
        
        return true; // 나머지는 통과
      });

      return {
        list: cleanList, 
        total: response.data.result.count || 0
      };
    } else {
      return { list: [], total: 0 };
    }
  } catch (error) {
    console.error("Functions 호출 실패:", error);
    return { list: [], total: 0 };
  }
};

// 외부 API 대신 내 프로젝트 안의 JSON 파일 사용
/*
import libraryData from '../data/korea_libraries.json'; 

export const getLibraryList = async (region = "", city = "", libName = "", page = 1, size = 20) => {
  try {
    // 1. 파일에서 데이터 가져오기
    let allData = libraryData;

    // 2. 필터링 로직 (자바스크립트로 직접 수행)
    
    // 지역(시/도) 필터링
    if (region && region !== "전체") {
      allData = allData.filter(item => item.addr && item.addr.includes(region));
    }
    
    // 시/군/구 필터링
    if (city && city !== "전체") {
      allData = allData.filter(item => item.addr && item.addr.includes(city));
    }
    
    // 도서관명 검색
    if (libName) {
      allData = allData.filter(item => item.libName && item.libName.includes(libName));
    }

    // 3. 전체 개수 계산 (페이지네이션용)
    const totalCount = allData.length;

    // 4. 페이지네이션
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const pagedData = allData.slice(startIndex, endIndex);

    // 5. 기존 API 응답 구조와 똑같이 반환
    return {
      list: pagedData,
      total: totalCount
    };

  } catch (error) {
    console.error("데이터 로딩 오류:", error);
    // 에러 발생 시 빈 목록 반환
    return { list: [], total: 0 };
  }
};
*/


//해외 주소 차단 문제로 json file 사용.
/*
import axios from 'axios';

// package.json의 proxy 설정을 타기 위해 상대 경로 사용
const OPEN_API_URL = "/nlstatapi/api/v1/libinfo";

export const getLibraryList = async (region = "", city = "", libName = "", page = 1, size = 20) => {
  try {
    const response = await axios.get(OPEN_API_URL, {
      params: {
        region: region,     // 시/도
        city: city,         // 시/군/구
        libName: libName,   // 도서관명
        page: page,         // 페이지 번호
        size: size          // 페이지당 개수
      }
    });
    
    // 데이터 구조 확인 및 반환
    if (response.data && response.data.result) {
      return {
        list: response.data.result.list || [],
        total: response.data.result.count || 0
      };
    } else {
      return { list: [], total: 0 };
    }
  } catch (error) {
    console.error("Open API Error:", error);
    return { list: [], total: 0 };
  }
};

*/
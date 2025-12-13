const axios = require('axios');

exports.handler = async function (event, context) {
  const { region, city, libName, page, size } = event.queryStringParameters;
  
  const TARGET_URL = "https://libsta.go.kr/nlstatapi/api/v1/libinfo";

  try {
    console.log(`[Proxy 요청] ${region} ${city} ${page}페이지`);
    const response = await axios.get(TARGET_URL, {
      params: {
        region: region || "",
        city: city || "",
        libName: libName || "",
        page: page || 1,
        size: size || 20
      },
      timeout: 8000 
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(response.data)
    };

  } catch (error) {
    console.error("Proxy Error:", error.message);
    
    return {
      statusCode: error.response ? error.response.status : 500,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        error: "API Proxy Failed",
        message: error.message,
        detail: "Proxy failed."
      })
    };
  }
};
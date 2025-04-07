const defaultHeaders = {
    "Access-Control-Allow-Origin": process.env.CORS_ORIGINS || "*",
    "Access-Control-Allow-Headers": process.env.CORS_HEADERS || "Content-Type",
  };
  
  function responseWithCors({ statusCode = 200, body = {} }) {
    return {
      statusCode,
      body: JSON.stringify(body),
      headers: defaultHeaders,
    };
  }
  
  module.exports = responseWithCors;
  
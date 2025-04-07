exports.handler = async (event) => {
    console.log('Received unhandled message:', event.body);
    return { statusCode: 200, body: 'Message received.' };
  };
  
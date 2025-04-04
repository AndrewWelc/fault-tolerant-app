exports.handler = async (event) => {
    for (const record of event.Records) {
      const body = record.body;
      let info;
      try {
        info = JSON.parse(body);
      } catch {
        info = null;
      }
      if (info && info.taskId) {
        console.error(`❗ Task ${info.taskId} permanently failed. Error: ${info.error || 'Unknown error'}`);
      } else {
        console.error(`❗ DLQ received malformed message: "${body}"`);
      }
    }
  };
  
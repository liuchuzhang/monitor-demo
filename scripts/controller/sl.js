const http = require('http');
const sourceMap = require('source-map');

const readFile = function(filePath, isJson) {
  return new Promise(function(resolve, reject) {
    http
      .get(filePath, res => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
          error = new Error('请求失败\n' + `状态码: ${statusCode}`);
        } else if (isJson && !/^application\/json/.test(contentType)) {
          error = new Error('无效的 content-type.\n' +
                            `期望的是 application/json 但接收到的是 ${contentType}`);
        }
        if (error) {
          console.error(error.message);
          // 消费响应数据来释放内存。
          res.resume();
          reject();
          return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', chunk => {
          rawData += chunk;
        });
        res.on('end', () => {
          try {
            resolve(isJson ? JSON.parse(rawData) : rawData)
          } catch (e) {
            reject()
          }
        });
      })
      .on('error', e => {
        console.error(`出现错误: ${e.message}`);
        reject()
      });
  });
};

async function searchSource(filePath, line, column) {
  console.log('---------------searchSource-------------------');
  console.log(filePath, line, column);
  // 读取 .map 文件
  const rawSourceMap = await readFile(`${filePath}.map`, 1);
  const consumer = await new sourceMap.SourceMapConsumer(rawSourceMap);
  const res = consumer.originalPositionFor({
    line: line,
    column: column,
  });
  consumer.destroy();
  console.log(res);
  return res;
}

module.exports = searchSource;

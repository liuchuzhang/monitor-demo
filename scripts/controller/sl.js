const http = require('http');
const sourceMap = require('source-map');

const readFile = (filePath, isJson) => {
  return new Promise((resolve, reject) => {
    http
      .get(filePath, res => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
          error = new Error('请求失败\n' + `状态码: ${statusCode}`);
        } else if (isJson && !/^application\/json/.test(contentType)) {
          error = new Error('无效的 content-type.\n' + `期望的是 application/json 但接收到的是 ${contentType}`);
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
            resolve(isJson ? JSON.parse(rawData) : rawData);
          } catch (e) {
            reject();
          }
        });
      })
      .on('error', e => {
        console.error(`出现错误: ${e.message}`);
        reject();
      });
  });
};

const searchSource = async ({ filePath, line, column, type, stacktrace }) => {
  console.log('---------------searchSource-------------------');
  console.log('error', stacktrace);

  if (type === 'vue') {
    const str = stacktrace;
    const reg = /[^(].+(?=\))/g;

    const fileList = str
      .split('at')
      .splice(1)
      .map(s => {
        const arr = s.trim().split(' ');
        // example: http://domain.com/index.js:1:2
        const [column, line, ...fileUrl] = arr[1]
          .match(reg)[0]
          .split(':')
          .reverse();
        return {
          line,
          column,
          fileUrl: fileUrl.reverse().join(':')
        };
      });
    console.log(fileList);

    const [first = {}] = fileList;
    console.log('first', first);
    filePath = first.fileUrl;
    line = first.line;
    column = first.column;
  }

  // 读取 .map 文件
  const rawSourceMap = await readFile(filePath, 1);
  const consumer = await new sourceMap.SourceMapConsumer(rawSourceMap);
  const res = consumer.originalPositionFor({
    line: Number(line),
    column: Number(column)
  });
  consumer.destroy();
  console.log(res);
  return res;
};

module.exports = searchSource;

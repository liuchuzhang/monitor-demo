const fs = require('fs');
const request = require('request');
const http = require('http');

const sourceMap = require('source-map');
const readFile = function(filePath) {
  return new Promise(function(resolve, reject) {
    http
      .get(filePath, res => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
          error = new Error('请求失败\n' + `状态码: ${statusCode}`);
        } 
        if (error) {
          console.error(error.message);
          // 消费响应数据来释放内存。
          res.resume();
          return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', chunk => {
          rawData += chunk;
        });
        res.on('end', () => {
          try {
            // console.log(rawData)
            resolve(rawData)
          } catch (e) {
            console.error(e.message);
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
  console.log('----------------------------------');
  console.log(filePath, line, column);
  // const rawSourceMap = await readFile(filePath);
  // console.log(rawSourceMap)
  const consumer = await new sourceMap.SourceMapConsumer({ sourceRoot: filePath });
  console.log(consumer)
  const res = consumer.originalPositionFor({
    line: line,
    column: column
  });
  consumer.destroy();
  console.log(res);
  return res;
}

module.exports = searchSource;

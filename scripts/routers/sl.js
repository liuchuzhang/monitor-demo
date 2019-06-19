const router = require('koa-router')();
const searchSource = require('./../controller/sl');

router.prefix('/sl');

router.post('/', async (ctx, next) => {
  const { filePath, line, column, type, stacktrace, ...options } = ctx.request.body;
  console.log(filePath);
  const source = await searchSource({ filePath, line, column, type, stacktrace })
  ctx.body = {
    ...source,
    ...options
  };
});

module.exports = router;

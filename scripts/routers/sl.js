const router = require('koa-router')();
const searchSource = require('./../controller/sl');

router.prefix('/sl');

router.post('/', async (ctx, next) => {
  const { filePath, line, column } = ctx.request.body;
  console.log(filePath);
  ctx.body = await searchSource(filePath, line, column);
});

module.exports = router;
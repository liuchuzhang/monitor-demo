const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('koa-cors');
const sl = require('./routers/sl');

// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
);
app.use(json());
// 允许跨域
app.use(cors());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

// routes
app.use(sl.routes(), sl.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

const server = app.listen(3000, () => {
  const address = server.address()
  console.log(`server run as ${address.address}:${address.port}`)
})

export default server;
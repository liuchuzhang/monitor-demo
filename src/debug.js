import axios from 'axios';

let debugConfig = {
  Vue: null,
  // 项目名称
  entryName: 'entryName',
  // 版本(分支)
  scriptVersion: '1.0',
  // 环境
  releaseStage: 'pro'
};

/**
 * 日志上报
 * @param {Object} param0
 */
const logReport = ({ type, severity, error, metaData, message, lineNumber, columnNumber, fileName }) => {
  message = message || (error && error.message) || '';
  const stacktrace = error && error.stack;
  const { entryName, releaseStage, scriptVersion } = debugConfig;
  const name = (error && error.name) || 'error';
  const time = Date.now();
  const title = document.title;
  const url = window.location.href;
  const client = {
    userAgent: window.navigator.userAgent,
    height: window.screen.height,
    width: window.screen.width,
    referrer: window.document.referrer
  };

  axios
    .post('http://localhost:3000/sl', {
      type,
      filePath: fileName,
      line: lineNumber,
      column: columnNumber,
      stacktrace,
      entryName,
      scriptVersion,
      message,
      metaData,
      name,
      releaseStage,
      severity,
      time,
      title,
      type,
      url,
      client,
      fileName,
      source,
      key
    })
    .then(res => {
      console.log(res.data);
    });
};

export default function(Vue, option = {}) {
  // if (!option.isPro) return;
  debugConfig = Object.assign(debugConfig, { Vue, ...option });

  const formatComponentName = vm => {
    if (vm.$root === vm) return 'root';
    const name = vm._isVue ? (vm.$options && vm.$options.name) || (vm.$options && vm.$options._componentTag) : vm.name;
    const component = name ? `component <${name}>` : 'anonymous component';
    const file = vm._isVue && vm.$options && vm.$options.__file ? ` at ${vm.$options && vm.$options.__file}` : '';
    return `${component}${file}`;
  };

  Vue.config.errorHandler = function(err, vm, info) {
    if (vm) {
      const componentName = formatComponentName(vm);
      const propsData = vm.$options && vm.$options.propsData;
      logReport({
        type: 'vue',
        error: err,
        metaData: {
          componentName,
          propsData,
          info
        }
      });
    } else {
      logReport({
        type: 'uncaught',
        error: err,
        metaData: {}
      });
    }
  };

  // 非 Vue 捕获的 Bug, 未知的 JavaScript Bug
  window.onerror = function(msg, url, lineNo, columnNo, error) {
    // 请求报错
    logReport({
      type: 'uncaught',
      error,
      metaData: {},
      message: msg,
      lineNumber: lineNo,
      columnNumber: columnNo,
      fileName: url
    });
  };
  httpError()
}

const httpError = () => {
  if (!XMLHttpRequest) {
    return;
  }

  const nativeAjaxSend = XMLHttpRequest.prototype.send; // 首先将原生的方法保存。
  const nativeAjaxOpen = XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype.open = function(mothod, url, ...args) {
    // 劫持open方法，是为了拿到请求的url
    const xhrInstance = this;
    xhrInstance._url = url;
    return nativeAjaxOpen.apply(this, [mothod, url].concat(args));
  };

  XMLHttpRequest.prototype.send = function(...args) {
    // 对于ajax请求的监控，主要是在send方法里处理。

    const oldCb = this.onreadystatechange;
    const oldErrorCb = this.onerror;
    const xhrInstance = this;

    xhrInstance.addEventListener('error', function(e) {
      // 这里捕获到的error是一个ProgressEvent。e.target 的值为 XMLHttpRequest的实例。当网络错误(ajax并没有发出去)或者发生跨域的时候，会触发XMLHttpRequest的error, 此时，e.target.status 的值为:0，e.target.statusText 的值为:''
      const errorObj = {
        error_msg: 'ajax filed',
        error_stack: JSON.stringify({
          status: e.target.status,
          statusText: e.target.statusText
        }),
        error_native: e
      };

      /*接下来可以对errorObj进行统一处理*/
    });

    xhrInstance.addEventListener('abort', function(e) {
      // 主动取消ajax的情况需要标注，否则可能会产生误报
      if (e.type === 'abort') {
        xhrInstance._isAbort = true;
      }
    });

    this.onreadystatechange = function(...innerArgs) {
      if (xhrInstance.readyState === 4) {
        if (!xhrInstance._isAbort && xhrInstance.status !== 200) {
          // 请求不成功时，拿到错误信息
          const errorObj = {
            error_msg: JSON.stringify({
              code: xhrInstance.status,
              msg: xhrInstance.statusText,
              url: xhrInstance._url
            }),
            error_stack: '',
            error_native: xhrInstance
          };
          console.log(xhrInstance);
          console.log(errorObj);

          /*接下来可以对errorObj进行统一处理*/
        }
      }
      oldCb && oldCb.apply(this, innerArgs);
    };
    return nativeAjaxSend.apply(this, args);
  };
};

export { logReport };

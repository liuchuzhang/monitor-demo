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
      stacktrace
    })
    .then(res => {
      const { line, column, source, name: key } = res.data;
      const data = {
        entryName,
        scriptVersion,
        message,
        metaData,
        name,
        releaseStage,
        severity,
        stacktrace,
        time,
        title,
        type,
        url,
        client,
        line,
        column,
        fileName,
        source,
        key
      };
      console.log(data);
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
}

export { logReport };

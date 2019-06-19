import Vue from 'vue';
import App from './App.vue';
// import * as fundebug from 'fundebug-javascript';
// import fundebugVue from 'fundebug-vue';
// fundebug.apikey = '1456d08e0390b852b047ebb20c0f84a979df777a303ebe58282d7ce442498109';
// fundebugVue(fundebug, Vue);
// require('fundebug-revideo');
// import BJ_REPORT from 'badjs-report';
//错误日志收集
//初始化错误处理
import debug from './debug';
Vue.use(debug, { entryName: 'index' });
// import listen from './listenError.js'
// console.log(listen.listen());

new Vue({
  render: h => h(App)
}).$mount('#app');


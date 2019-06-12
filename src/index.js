import Vue from 'vue';
import App from './App.vue'

new Vue({
  render: h => h(App)
}).$mount('#app');

const test = () => {
  const title = document.createElement('h1');
  title.innerText = 'webber';
  document.body.append(title);
};
test();

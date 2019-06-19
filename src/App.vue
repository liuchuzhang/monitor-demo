<template>
  <h2>
    <span>hello</span>
    <button @click="handleClickJs">JS 报错</button>
    <button @click="handleClickReq">请求报错</button>
  </h2>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      a: null,
    }
  },
  mounted() {
    // debug();
    // window.onerror = function(message, filePath, line, column, error) {
    //   axios.post('http://localhost:3000/sl', { filePath, line, column }).then(res => {
    //   })
    // };
    setTimeout(() => {
      const str = '12312321'
      sads
    }, 5000);
  },
  methods: {
    handleClickJs() {
      this.a.name
    },
    handleClickReq() {
      axios.get('https://www.qweqweqwe.com')
    }
  }
}
</script>

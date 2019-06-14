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

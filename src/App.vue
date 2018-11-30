<template>
  <div id="app">
    <router-view/>
    <footerC v-show="!$route.meta.showFooter"></footerC>
  </div>
</template>

<script>
  import footerC from '@/components/common/footerC'
  export default {
    name: 'App',
    data(){
      return {
        webConfigInfos: {},
      }
    },
    components: {
      footerC,
    },
    mounted(){
      this.getConfigInfo();
    },
    methods: {
      getConfigInfo(){
        this.$axios.post('/api/config/configInfo')
          .then(res => {
            if(res.data.code === 0){
              this.webConfigInfos = res.data.data;
              this.resetSetItem('webConfigInfos', JSON.stringify(res.data.data));
              window.localStorage.setItem('webConfigInfos',JSON.stringify(res.data.data));//把网站信息存储在本地存储中
              window.localStorage.setItem('userCode',res.data.data.trade_code.value);
            }else {
              this.$toast(res.data.msg)
            }
          })
          .catch(err => {
            this.$toast(err)
          })
      },
    }
  }
</script>

<style>
  #app {
    max-width: 600px;
    margin: auto;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #7a7a7a;
  }
  .content {
    margin-top: 3.3rem;
  }
</style>

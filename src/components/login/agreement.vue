<template>
  <section>
    <van-nav-bar
      title="注册协议"
      left-arrow
      fixed
      @click-left="$back()"
    />
    <div class="content">
      <div class="details" v-html="agreement.content"></div>
    </div>

  </section>
</template>

<script>
  export default {
    name: "agreement",
    data() {
      return {
        agreement: { //协议
          title: '',
          content: '',
        },
      }
    },
    created() {
      this.getAgreement()
    },
    methods: {
      getAgreement() {
        this.$axios.post('/api/contract/getInfo').then(res => {
          if(res.data.code === 0) {
            this.agreement.title = res.data.data[3].title
            this.openContentDetails(res.data.data[3].id)
          }
        })
      },
      openContentDetails(conDetails) { //获取协议详情
        // console.log(this.$aaa)
        this.$axios.post('/api/contract/getContent',{id: conDetails}).then(res => {
          if(res.data.code === 0) {
            this.agreement.content = res.data.data.content
          }
        })

      },
    }
  }
</script>

<style scoped>
  .details {
    background: #fff;
    padding: 0 1rem;
    text-align: left;
  }
</style>

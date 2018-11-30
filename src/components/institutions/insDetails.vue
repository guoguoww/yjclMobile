<template>
    <section>
      <van-nav-bar
        title="专业机构"
        left-arrow
        fixed
        @click-left="$back()"
      />
      <div class="content">
        <h4>{{paramsData.title}}</h4>
        <div class="insCon" v-html="paramsData.content"></div>
      </div>
    </section>
</template>

<script>
  export default {
    name: "insDetails",
    data() {
      return {
        paramsData: {},
      }
    },
    created() {
      if(this.$route.params.paramsData) {
        this.$cookie.set('insDet',this.$route.params.paramsData);
      }
      if(this.$cookie.get('insDet')) {
        this.paramsData = JSON.parse(this.$cookie.get('insDet'));
      }
    },
    beforeDestroy() {
      this.$cookie.delete('insDet'); //清除cookie
    }
  }
</script>

<style scoped>
  .content {
    background: #fff;
  }
  h4 {
    height: 3rem;
    line-height: 3rem;
    font-size: 1rem;
  }
  div.insCon {
    padding: 0 0.85rem;
    text-align: left;
    line-height: 1.8rem;
    font-size: 0.9rem;
  }
</style>

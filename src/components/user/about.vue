<template>
    <section>
      <van-nav-bar
        title="关于我们"
        left-arrow
        fixed
        @click-left="$back()"
      />
      <div class="content">
        <div class="agreement-section">
          <h3>{{content.title}}</h3>
          <div v-html="content.content"></div>
          <!--<dl>-->
            <!--<dd>-->
              <!--赢家策略（http://yingjiacelue.ronmei.net ）隶属于宁波杭州湾新区天群网络科技有限公司，是全国首批响应国家“普惠金融”号召的互联网创新企业。-->
            <!--</dd>-->
            <!--<dd>-->
              <!--赢家策略初创团队由国内知名互联网公司阿里、腾讯及多位金融领域的资深专家共同组建而成，产品由原百度研发团队开发完成并投入市场。依托四年线下客户投融资咨询及互联网产品开发的经验及资源，赢得了良好的用户口碑，随着平台快速的发展，借助互联网创新之势，强势推出各种互联网产品，赢家策略已成为互联网投融资领域的领军品牌。            </dd>-->
            <!--<dd>-->
              <!--赢家策略以"安全第一，用户至上"的理念，始终坚持严格的风险管理流程、创新的互联网技术、优质的客户服务确保投资者获得更好的产品体验，让投资者能够轻松简单的实现财富梦想。            </dd>-->
          <!--</dl>-->
        </div>
      </div>
    </section>
</template>

<script>
  export default {
    name: "about",
    data() {
      return {
        content: '', //内容
      }
    },
    mounted() {
      this.getArticleInfo();
    },
    methods: {
      getArticleInfo(){
        this.$axios.post('api/article/getInfoByType/type/4')
          .then(res => {
            if(!res.data.code){
              this.content = res.data.data[0];
            }
          })
      },
    },
  }
</script>

<style scoped>
  .agreement-section {
    padding: 1rem;
    background-color: #fff;
    font-size: 0.85rem;
    line-height: 1.4;
    word-break: normal;
    text-align: left;
    color: #212121;
  }
  .agreement-section h3 {
    text-align: center;
    font-size: 1rem;
    margin: 0 0 0.5rem 0;
  }
  .agreement-section dl {
    margin-top: 0.25rem;
  }
  .agreement-section dl dd {
    margin: 0 0 0.75rem 0;
    text-indent: 2rem;
  }
</style>

<template>
    <section>
      <van-nav-bar
        title="帮助中心"
        left-arrow
        fixed
        @click-left="$back()"
      />
      <div class="content">
        <ul class="rule-list">
          <li v-for="(item,i) in helpList" :key="i" @click="answerShow(i,item)" :class="answerNum === i? 'active': ''">
            <h4 class="row">
              <label>{{i + 1}}、{{item.title}}</label>
              <i class="icon-chevron-thin-right"></i>
            </h4>
            <p v-if="answerNum === i" v-html="item.content"></p>
          </li>
        </ul>
      </div>
    </section>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        helpList: [], //帮助列表
        answerNum: -1,
      }
    },
    mounted() {
      this.getInfo()
    },
    methods: {
      getInfo(){//文章
        this.$axios.post('/api/article/getInfo').then(res =>{
          if(res.data.code === 0){
            this.helpList = res.data.data[0].child;
          }
        })
      },
      answerShow(i,item) { //查看答案
        this.answerNum = this.answerNum === i ? -1 : i;
        if(this.answerNum !== -1) {
          this.$axios.post('/api/article/getArticleDetail', {article_id: item.id}).then(res => {
            if (res.data.code === 0) {
              item.content = res.data.data.content || '';
              this.$forceUpdate();
            }
          })
        }

      }
    }
  }
</script>

<style scoped>
  /*列表*/
  .rule-list li {
    border-bottom: 1px solid #f1f2f3;
  }
  /*问题*/
  .rule-list li h4 {
    background-color: #fff;
    padding: 0.8rem 1.4rem;
    position: relative;
  }
  .rule-list li h4:before {
    content: "";
    display: inline-block;
    height: 1.2rem;
    border-left: 3px solid #ff5e00;
    width: 2%;
    float: left;
  }
  .row {
    font-size: 0;
  }
  .rule-list li h4 label {
    width: 92%;
    font-size: 0.8rem;
    text-align: left;
  }
  .row > * {
    display: inline-block;
    font-size: 0.7rem;
    vertical-align: middle;
  }
  .rule-list li h4 i {
    font-weight: bold;
    font-size: 0.9rem;
    color: #e0e0e0;
    width: 4%;
    text-align: right;
    transition: transform 0.3s ease 0s;
  }
  .rule-list li.active i {
    transform: rotate(90deg);
  }
  /*答案*/
  .rule-list li p {
    padding: 0.6rem 1.2rem 0.8rem 1.6rem !important;
    line-height: 1.6;
    text-align: left;
  }
</style>

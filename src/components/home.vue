<template>
  <section>
    <header>
      <div class="header_nav">
        <a class="left-btn" :href="'tel:' + serviceTel"><i class="icon-service"></i></a>
        <span>赢家策略</span>
        <router-link class="right-btn" to="/help"><i class="icon-question"></i></router-link>
      </div>
    </header>
    <div id="lunbo">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(item, index) in images" :key="index">
          <router-link :to="index === 1? '/reg': '/'"> <img :src="item.bannerVal" /></router-link>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="optionalWrap">
      <ul>
        <li>
          <p class="title">上证指数</p>
          <p class="mainInfo"><i :class="shangThe.diff_rate > 0 ? 'arrowUp' : 'arrowDown'"></i> <span :class="shangThe.diff_rate > 0 ? 'red' : 'green'">{{shangThe.price_now}}</span></p>
          <p><span :class="shangThe.diff_rate > 0 ? 'red' : 'green'">{{shangThe.diff}} {{shangThe.diff_rate}}%</span></p>
        </li>
        <li>
          <p class="title">深证指数</p>
          <p class="mainInfo"><i :class="shenThe.diff_rate > 0 ? 'arrowUp' : 'arrowDown'"></i> <span :class="shenThe.diff_rate > 0 ? 'red' : 'green'">{{shenThe.price_now}}</span></p>
          <p><span :class="shenThe.diff_rate > 0 ? 'red' : 'green'">{{shenThe.diff}} {{shenThe.diff_rate}}%</span></p>
        </li>
        <li>
          <p class="title">创业指数</p>
          <p class="mainInfo"><i :class="entrepreneurship.diff_rate > 0 ? 'arrowUp' : 'arrowDown'"></i> <span :class="entrepreneurship.diff_rate > 0 ? 'red' : 'green'">{{entrepreneurship.price_now}}</span></p>
          <p><span :class="entrepreneurship.diff_rate > 0 ? 'red' : 'green'">{{entrepreneurship.diff}} {{entrepreneurship.diff_rate}}%</span></p>
        </li>
      </ul>
    </div>
    <div class="indexLink">
      <router-link to="/strategy/oneExperience">
        <img :src="indexLinkImg">
      </router-link>
      <ul class="nav">
        <li>
          <router-link to="/strategy/aPointBuy">
            <i class="icon-stock"></i>
            <p>发布策略</p>
          </router-link>
        </li>
        <li>
          <router-link to="/topUp">
            <i class="icon-purse "></i>
            <p>充值中心</p>
          </router-link>
        </li>
        <li>
          <router-link to="/strategy/oneExperience">
            <i class="icon-chart"></i>
            <p>免费体验</p>
          </router-link>
        </li>
        <li>
          <router-link to="/newGuide">
            <i class="icon-news"></i>
            <p>新手指引</p>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="list">
      <div class="titleTab clearfix">
        <ul class="tab">
          <li :class="tabActive === 1 ? 'active': ''" @click="switchTab(1)">
            <span>最新动态</span>
          </li>
          <li :class="tabActive === 2 ? 'active': ''" @click="switchTab(2)">
            <span>专业机构</span>
          </li>
        </ul>
        <p class="more" @click="moreLink(tabActive)">更多</p>
      </div>
      <ul class="listCon dynamic" v-if="tabActive === 1">
        <li v-for="item in tradingList" v-if="tradingList.length > 0">
          <label>
            <h4>{{item.nick_name}}</h4>
            <span >{{item.title}} {{item.code}}</span>
          </label>
          <label>
            <p class="red">{{item.amount}}</p>
            <span >{{item.transaction_money}}</span>
          </label>
          <router-link to="/strategy/aPointBuy">我要点买</router-link>
        </li>
        <li class="data-empty" v-if="tradingList.length === 0">
          <div class="data-empty">暂无数据</div>
        </li>
      </ul>
      <ul class="listCon institutions" v-if="tabActive === 2">
        <li v-for="item in proInsList" v-if="proInsList.length > 0" @click="insDet(item)">
          <p>{{item.title}}</p>
        </li>
        <!--暂无数据-->
        <li class="data-empty" v-if="proInsList.length === 0">
          <div class="data-empty">暂无数据</div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>

  export default {
  name: 'home',
  data () {
    return {
      serviceTel: '', //客服电话
      images: [], //轮播图片
      indexLinkImg: '', //发布充值等链接上边的图片
      tabActive: 1, //tab选中
      tradingList: [], //交易动态
      proInsList: [], //专业机构列表
      sccket: new this.$socketApi(this),
      damicPices: 0, //ws价格
      shangThe: {}, //上证指数
      shenThe: {}, //深证指数
      entrepreneurship: {}, //创业指数
    }
  },
  created() {
    if(!window.localStorage.getItem('webConfigInfos')) {
      window.addEventListener('setItem', ()=> {
        this.curWebInfos = JSON.parse(sessionStorage.getItem('webConfigInfos'));//获取初始化配置数据
        this.images.push( //轮播图
          {bannerVal: `${process.env.BASEURL}${this.curWebInfos.mobile_one.value}`},
          {bannerVal: `${process.env.BASEURL}${this.curWebInfos.mobile_two.value}`},
        );
        this.serviceTel = this.curWebInfos.service_hotline.value; //获取客服电话
        this.indexLinkImg = `${process.env.BASEURL}${this.curWebInfos.mobile_three.value}`; //获取发布充值等链接上边的图片
      })
    }else {
      this.curWebInfos = JSON.parse(window.localStorage.getItem('webConfigInfos'));
      this.images.push( //轮播图
        {bannerVal: `${process.env.BASEURL}${this.curWebInfos.mobile_one.value}`},
        {bannerVal: `${process.env.BASEURL}${this.curWebInfos.mobile_two.value}`},
      );
      this.serviceTel = this.curWebInfos.service_hotline.value; //获取客服电话
      this.indexLinkImg = `${process.env.BASEURL}${this.curWebInfos.mobile_three.value}`; //获取发布充值等链接上边的图片
    }
  },
  mounted() {
    //进入页面 开启ws链接调用
    this.sccket.initWebSocket();
    //获取最新行情
    this.getQuotation();
    this.getTradingList();
  },
  destroyed: function() {
    //页面销毁时关闭长连接,离开路由之后断开websocket连接
    this.sccket.websocketclose();
  },
  methods: {
    getDamicPice(damicPice){ //获取ws价格
      this.damicPices = damicPice;
    },
    switchTab(type) { //列表切换
      this.tabActive = type
      if(type === 2) { //获取专业机构前七个
        this.$axios({
          url: '/api/article/getInfoByType',
          method: 'post',
          data: {
            type: type
          },
        }).then(res => {
          if(res.data.code === 0) {
            this.proInsList = res.data.data.slice(0, 7)
          }
        })
      }
    },
    getTradingList() { //获取交易动态
      this.$axios.post('/api/common/getIndexInfo', {token: localStorage.getItem('_auth')}).then(res => {
        if (res.data.code === 0) {
          this.tradingList = res.data.data.data.slice(0, 7)
        }
      })
    },
    moreLink(type) { //更多跳转
      if(type === 1) {
        this.$router.push('/dynamic')
      }else {
        this.$router.push('/institutions')
      }
    },
    insDet(item) { //详情跳转
      this.$router.push({
        name: 'insDetails',
        params: {
          paramsData: item
        }
      })
    },
    // 获取行情 上证指数:sh000001 深证指数:sz399001 创业指数:sz399006
    getQuotation() {
      this.$axios.post('/api/ws/getQuotationNow', {code: 'sh000001'})
        .then(res => {
          if(res.data.code === 0) {

            this.shangThe = res.data.data.data;
            this.shangThe.price_now? this.shangThe.price_now = this.shangThe.price_now.toFixed(2) : this.shangThe.price_now = '--';
            this.shangThe.diff? this.shangThe.diff = this.shangThe.diff.toFixed(2): this.shangThe.diff = '--';
            this.shangThe.diff_rate? this.shangThe.diff_rate = (this.shangThe.diff_rate * 100).toFixed(2): this.shangThe.diff_rate = '--';
          }
      })
      this.$axios.post('/api/ws/getQuotationNow', {code: 'sz399001'})
        .then(res => {
          if(res.data.code === 0) {
            this.shenThe = res.data.data.data;
            this.shenThe.price_now? this.shenThe.price_now = this.shenThe.price_now.toFixed(2) : this.shenThe.price_now = '--';
            this.shenThe.diff? this.shenThe.diff = this.shenThe.diff.toFixed(2): this.shenThe.diff = '--';
            this.shenThe.diff_rate? this.shenThe.diff_rate = (this.shenThe.diff_rate * 100).toFixed(2): this.shenThe.diff_rate = '--';
          }
        })
      this.$axios.post('/api/ws/getQuotationNow', {code: 'sz399006'})
        .then(res => {
          if(res.data.code === 0) {
            this.entrepreneurship = res.data.data.data
            this.entrepreneurship.price_now? this.entrepreneurship.price_now = this.entrepreneurship.price_now.toFixed(2) : this.entrepreneurship.price_now = '--';
            this.entrepreneurship.diff? this.entrepreneurship.diff = this.entrepreneurship.diff.toFixed(2): this.entrepreneurship.diff = '--';
            this.entrepreneurship.diff_rate? this.entrepreneurship.diff_rate = (this.entrepreneurship.diff_rate * 100).toFixed(2): this.entrepreneurship.diff_rate = '--';
          }
        })
    },
  },
  watch: {
    damicPices() { //监听ws推送价格变动 获取股票最新行情
      this.getQuotation();
    },
    curWebInfos() {
      console.log(11)
    }
  }

}
</script>

<style scoped>
  /*头部*/
  header {
    background: #ff5e00;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 3rem;
    line-height: 3rem;
    color: #fff;
    z-index: 9;
    box-sizing: content-box;
  }
  header .header_nav {
    height: 3rem;
    position: relative;
  }
  header .header_nav a{
    padding: 0 1rem;
    color: #fff;
    display: inline-block;
  }
  header .header_nav a.left-btn {
    position: absolute;
    left: 0;
  }
  header .header_nav a.right-btn {
    position: absolute;
    right: 0;
  }
  header .header_nav i {
    font-size: 1.1rem;
    vertical-align: middle;
  }
  header .header_nav span {
    font-size: 1.1rem;
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    width: 65%;
    margin: 0 auto;
  }
  /*轮播*/
  #lunbo {
    margin-top: 3rem;
    height: 9.4rem;
  }
  /*指数*/
  .optionalWrap {
    background: #fff;
    padding: .8rem;
    font-size: .8rem;
  }
  .optionalWrap ul {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .optionalWrap ul li {
    flex: 1;
    border-right: 1px solid #f1f2f3 ;
  }
  .optionalList {
    margin-bottom: 55px;
  }
  .optionalList > ul li.title {
    padding: 1rem 0;
  }
  .optionalWrap ul li p{
    display: flex;
    justify-content: center;
    align-items: flex-start;
    line-height: 1.5;
  }
  .optionalWrap ul li p.title {
    color: #212121;
    padding-bottom: .2rem;
  }
  .optionalWrap ul li p.mainInfo {
    font-size: 1rem;
  }
  .optionalWrap ul li p:last-child{
    font-size: .6rem;
  }
  .optionalWrap ul li:last-child {
    border-right: none;
  }
  .red {
    color: #ff494b !important;
  }
  .green {
    color: #18b676 !important;
  }
  .arrowUp {
    width: 0;
    height: 0;
    margin-top: 0.2rem;
    border: .3rem solid transparent;
    border-bottom-color: #ff494b;
  }
  .arrowDown {
    width: 0;
    height: 0;
    margin-top: 0.5rem;
    border: .3rem solid transparent;
    border-top-color: #18b676;
    vertical-align: middle;
  }
  /*首页跳转区*/
  .indexLink {
    background-color: #fff;
    margin: 0.85rem 0;
  }
  .indexLink ul {
    display: flex;
    text-align: center;
    justify-content: space-between;
  }
  .indexLink .nav li {
    width: 25%;
    position: relative;
    padding: 1rem 0;
    background-color: #fff;
    outline: none;
  }
  .indexLink .nav li i {
    color: #ff5e00;
    height: 1.8rem;
    line-height: 1.8rem;
    font-size: 1.6rem;
    display: inline-block;
    margin: 0 0 0.2rem;
  }
  /*列表*/
  .list {
    background-color: #fff;
    margin-bottom: 3.7rem;
  }
  .list .titleTab {
    height: 3rem;
    line-height: 3rem;
    font-size: 0.9rem;
    padding: 0 0.85rem;
    border-bottom: 1px solid #f1f2f3;
  }
  .list .titleTab .tab {
    height: 100%;
    float: left;
  }
  .list .titleTab .tab li {
    float: left;
    padding: 0 0.5rem;
    height: 100%;
  }
  .list .titleTab .tab li span {
    display: inline-block;
    width: 100%;
    height: 100%;
    padding: 0 0.5rem
  }
  .list .titleTab .tab li.active span {
    border-bottom: 3px solid #ff5e00;
    color: #ff5e00;
  }
  .list .titleTab .tab li:first-child {
    border-right: 1px solid #f1f2f3;
  }
  .list .titleTab p {
    float: right;
    font-size: 0.8rem;
    color: #999;
  }
  .list .listCon {
    padding: 0 0.85rem;
  }
  .list .listCon li {
    border-bottom: 1px solid #f1f2f3;
    padding: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  /*最新动态*/
  .dynamic li label{
    width: 44%;
    text-align: left;
    font-size: 0.85rem;
  }
  .dynamic li label p {
    font-size: 0.85rem;
  }
  .dynamic li span {
    color: #7a7a7a;
  }
  .dynamic li label + label {
    width: 36%;
  }
  .dynamic li a {
    font-size: 0.7rem;
    height: 1.8em;
    line-height: 1.8rem;
    box-sizing: content-box;
    padding: 0 0.1rem;
    display: inline-block;
    width: 20%;
    background-color: transparent;
    border-radius: 0.3rem;
    text-align: center;
    outline: none;
    color: #ff5e00;
    border: 1px solid #ff5e00;
  }
  /*专业机构*/
  .institutions li p {
    font-size: 0.8rem;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
  }
</style>

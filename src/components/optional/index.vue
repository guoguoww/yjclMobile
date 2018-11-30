<template>
    <div>
      <header class="head">
        <div class="backTop" @click="$router.push('/')"><span class="icon-chevron-thin-left"></span></div>
        <div class="tab"><span>自选股</span></div>
        <!--<div class="searchIcon"><span class="icon-search"></span></div>-->
      </header>
      <div class="optionalWrap">
        <!--<ul>-->
          <!--<li>-->
            <!--<p class="title">上证指数</p>-->
            <!--<p class="mainInfo"><i class="arrowUp"></i><span class="red">2550.47</span></p>-->
            <!--<p><span class="red">+64.05 +2.58%</span></p>-->
          <!--</li>-->
          <!--<li>-->
            <!--<p class="title">上证指数</p>-->
            <!--<p class="mainInfo"><i class="arrowUp"></i><span class="red">2550.47</span></p>-->
            <!--<p><span class="red">+64.05 +2.58%</span></p>-->
          <!--</li>-->
          <!--<li>-->
            <!--<p class="title">创业指数</p>-->
            <!--<p class="mainInfo"><i class="arrowUp"></i><span class="red">1249.47</span></p>-->
            <!--<p><span class="red">+64.05 +2.58%</span></p>-->
          <!--</li>-->
        <!--</ul>-->
        <input type="text" class="searchCode" placeholder="输入股票名称/代码/拼音" v-model="searchCode">

      </div>
      <div class="searchListContent" v-show="defaultHide">
        <ul>
          <li><span>以下为查询记录</span></li>
          <li v-for="(item, index) of searchLists" :key="index">
            <span>{{item.title}}</span>
            <span>{{item.code}}</span>
            <i class="icon-remove green" v-show="item.choice == 1" @click="removeFreeCode(item.code)"></i>
            <i class="icon-add red" v-show="item.choice == 0" @click="addFreeCode(item.code)"></i>
          </li>
        </ul>
      </div>
      <div class="optionalList" style="margin-top: 8rem">
        <ul>
          <li class="title"><span>股票名称</span><span>当前价</span><span>涨跌</span><span>操作</span></li>
          <li v-for="(item, index) of freeCodeList" :key="index">
            <p><em>{{item.title}}</em><span>{{item.code}}</span></p>
            <p class="red">{{item.price_now  || '--' | keepTwoNum }}</p>
            <p class="res">{{item.diff  || '--' | keepTwoNum}}</p>
            <p class="res"><span class="remove" @click="removeFreeCode(item.code)">移除自选</span></p>
          </li>

        </ul>
      </div>
    </div>
</template>

<script>
    export default {
      name: "index",
      data(){
        return {
          freeCodeList: [],//自选股列表
          defaultHide: false,//默认搜索出来的数据内容为 false
          searchLists: [],//搜索出来后的数据列表
          searchCode: '',//搜索框中的值
          livExample: new this.$socketApi(this),//让本组件成为socket.js的子实例,把this 指向的这个组件传值到socket.js文件中
          dtPrice: '',//动态价格值
        }
      },
      mounted(){
        this.livExample.initWebSocket();//子实例调用socket.js中的initWebSocket方法
        this.getUserTrade();
      },
      destroyed: function() {
        //页面销毁时关闭长连接,离开路由之后断开websocket连接
        this.livExample.websocketclose();
      },
      methods: {
        getDamicPice(damicPice){
          this.dtPrice = damicPice;
        },
        getUserTrade(){//获取客户自选股股票
          this.$axios.post('/api/user/getUserTrade',{token: JSON.parse(this.$cookie.get('_auth'))})
            .then(res => {
              if(res.data.code === 0){
                if(res.data.data && res.data.data.length!=0){
                  this.freeCodeList = res.data.data;
                }
              }else {
                this.$toast(res.data.msg);
              }
            })
            .catch(err => {
              this.$toast(err)
            })

        },
        removeFreeCode(code){//移除自选股票
          this.$axios.post('/api/user/decUserTrade',{token: JSON.parse(this.$cookie.get('_auth')),trade_code:code})
            .then(res => {
              if(res.data.code === 0){
                this.$toast(res.data.msg);
                this.selectTradeInfo(code)
                this.getUserTrade();
              }else {
                this.$toast(res.data.msg);
              }
            })
            .catch(err => {
              this.$toast(err)
            })
        },
        addFreeCode(code){//添加到自选股票
          this.$axios.post('/api/user/addUserTrade',{token: JSON.parse(this.$cookie.get('_auth')),trade_code:code})
            .then(res => {
              if(res.data.code === 0){
                this.$toast(res.data.msg);
                this.selectTradeInfo(code)
                this.getUserTrade();
              }else {
                this.$toast(res.data.msg);
              }
            })
            .catch(err => {
              this.$toast(err)
            })
        },
        selectTradeInfo(trade_code){//模糊搜索股票信息
          this.$axios.post('/api/trade/selectTradeInfo',{token: JSON.parse(this.$cookie.get('_auth')),trade_code,})
            .then(res => {
              if(res.data.code == 0){
                if(res.data.data && res.data.data.length != 0){

                  this.searchLists = res.data.data;
                }
              }else {
                this.$toast(res.data.msg);
              }
            })
            .catch(err => {
              this.$toast(err);
            })
        },
      },
      watch: {
        searchCode(curV){

          if(curV) {
            this.defaultHide = true;
            this.selectTradeInfo(curV);
          }else {
            this.defaultHide = false;
          }

        },
        dtPrice(newP){
          if(newP){
            this.getUserTrade();
          }
        },
      }
    }
</script>

<style scoped>
  .head {
    padding: .3rem 0;
    background: #ff5e00;
    color: #fff;
    position: fixed;
    left: 0;
    width: 100%;
    top: 0;
    z-index: 9999;
  }
  .head div.backTop {
    font-size: 1.2rem;
    position: absolute;
    top: 1rem;
    left: 0;
    color: #fff;
    padding-left: .7rem;
    cursor: pointer;
  }
  .head  div.tab {
    height: 42px;
    line-height: 42px;
    font-size: 1rem;
    width: 50%;
    border-radius: 5px;
    margin: auto;
  }
  .optionalWrap {
    top: 52px;
    background: #fff;
    padding: .8rem;
    font-size: .8rem;
    position: fixed;
    left: 0;
    width: 100%;
    z-index: 9999;
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
    margin-top: 8rem;
    color: #999;
    margin-bottom: 55px;
  }
  .optionalList > ul li.title {
    padding: 1rem 0;
  }
  .optionalWrap ul li p{
    display: flex;
    justify-content: center;
    align-items: flex-start;
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
    border: .3rem solid transparent;
    border-bottom-color: #ff494b;
  }
  .arrowDown {
    width: 0;
    height: 0;
    border: .3rem solid transparent;
    border-top-color: #ff494b;
    vertical-align: middle;
  }
  p {
    margin: .1rem;
  }
  .optionalList {
    background: #fff;
    padding: 0 .8rem ;
    margin-top: .6rem;
  }
  .optionalList > ul li{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: .8rem;
    border-bottom: 1px solid #f1f2f3;
    padding: .7rem 0;
  }

  .optionalList > ul li p {
    display: flex;
    flex-direction: column;
    text-align: left;
    color: #999;
  }
  .optionalList > ul li p em{
    color: #999;
    font-size: 1rem;
    padding-bottom: .4rem;
  }
  .optionalList > ul li > span {
    /*flex: 1;*/
    /*text-align: left;*/
  }
  .optionalList > ul li p span.remove{
    display: inline-block;
    border: 1px solid #ff5e00;
    padding: .1rem .2rem;
    border-radius: .2rem;
  }
  .searchCode {
    width: 100%;
    border: 1px solid #f1f2f3;
    border-radius: .2rem;
    padding: .5rem;
  }
  .searchListContent {
    position: absolute;
    top: 7rem;
    left: 0;
    bottom: 3.5rem;
    width: 100%;
    z-index: 999;
    background: #fff;
    padding: .5rem 1rem;
    overflow: auto;
  }
  .searchListContent ul li {
    display: flex;
    justify-content: space-between;
    font-size: .9rem;
    line-height: 2.5rem;
    border-bottom: 1px solid #f1f2f3;
    align-items: center;
    padding-bottom: .5rem;
  }
  .searchListContent ul li span{
    flex: 1;
    text-align: left;
  }
  .searchListContent ul li i{
    font-size: 1.1rem;
  }
  .searchListContent ul li:first-child {
    border-top: none;
  }
</style>

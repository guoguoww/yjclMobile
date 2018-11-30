<template>
  <section>
    <van-nav-bar
      title="资金明细"
      left-arrow
      fixed
      @click-left="$back()"
    />
    <div class="content">
      <div class="detail">
        <label>{{balance}}</label>
        <p>账户余额</p>
        <div class="btn-row">
          <button class="btn" @click="routerLike('topUp')">充值</button>
          <button class="btn" @click="routerLike('withdrawal')">提现</button>
        </div>
      </div>
      <ul class="recordList">
        <li id="listTit" class="">
          <span>时间</span>
          <span>金额</span>
          <span>内容</span>
        </li>
        <li class="listItem" v-for="item in capital.capitalList" v-if="capital.total > 0">
          <span>{{item.create_time}}</span>
          <span>{{item.money}}</span>
          <span>{{item.remarks}}</span>
        </li>
        <!--暂无数据-->
        <li class="data-empty" v-if="capital.total === 0">
          <div class="data-empty">暂无数据,请先创建策略</div>
        </li>
      </ul>
      <van-pagination
        v-model="capitalData.page"
        :total-items="capital.total"
        :show-page-size="capitalData.pageNum"
        force-ellipses
        v-if="capital.total > capitalData.pageNum"
      />
    </div>

  </section>
</template>

<script>
  export default {
    name: "moneyRecord",
    data() {
      return {
        balance: '', //余额
        capitalData: { //提交获取资金流水信息
          token: JSON.parse(this.$cookie.get('_auth')) || '', //登录信息
          page: 1, //页码
          pageNum: 15, //页容量
          search: 0, //筛选时间
        },
        capital: { //资金流水列表
          capitalList: [], //列表
          total: 0, //总条数
        },
      }
    },
    mounted() {
      window.addEventListener("scroll", this.scrollTop);
      this.getShowBalance()
      this.getUserCapital()
    },
    destroyed() {
      //离开该页面需要移除这个监听的事件
      window.removeEventListener("scroll", this.scrollTop);
    },
    methods: {
      getShowBalance() { //获取可用余额
        this.$axios.post('/api/user/showBalance', {token: JSON.parse(this.$cookie.get('_auth'))}).then(res => {
          if (res.data.code === 0) {
            this.balance = res.data.data.balance
          }
        })
      },
      getUserCapital() { //获取用户资金流水
        this.$axios({
          url: '/api/user/getUserCapital',
          method: 'post',
          data: this.capitalData,
        }).then(res => {
          if(res.data.code === 0) {
            this.capital.total = res.data.data.total;
            this.capital.capitalList = res.data.data.data
          }
        })
      },
      routerLike(link) { //跳转
        this.$router.push('/' + link);
      },
      scrollTop() { //列表标题吸顶
        var tit = document.getElementById("listTit");
        //占位符的位置
        // var rect = tit.getBoundingClientRect();//获得页面中导航条相对于浏览器视窗的位置
        var inser = document.createElement("div");
        tit.parentNode.replaceChild(inser,tit);
        inser.appendChild(tit);
        //获取距离页面顶端的距离
        var titleTop = tit.offsetTop;
        //获取当前滚动的距离
        var btop = document.body.scrollTop || document.documentElement.scrollTop;
        //如果滚动距离大于导航条据顶部的距离
        if(btop > document.getElementsByClassName('detail')[0].offsetHeight){
          //为导航条设置fix
          tit.className = "fix";
          document.getElementsByClassName('listItem')[0].style.marginTop = tit.offsetHeight + 'px'
        }else if(btop < (document.getElementsByClassName('detail')[0].offsetHeight - titleTop + tit.offsetHeight)){
          //移除fixed
          tit.className = "";
          document.getElementsByClassName('listItem')[0].style.marginTop = '0px'
        }
      },
    }

  }
</script>

<style scoped>
  /*账户信息*/
  .detail {
    padding: 0.3rem 0 1.3rem;
    background: #fff;
  }
  .detail p {
    color: #adadad;
    font-size: 0.8rem;
    line-height: 0.8rem;
  }
  .detail label {
    color: #212121;
    font-size: 2rem;
    margin: 0.75rem 0;
    display: block;
  }
  .detail .btn-row {
    padding: 0 1.3rem;
    margin-top: 1.3rem;
    display: flex;
    justify-content: space-between;
  }
  .detail button {
    height: 2.5rem;
    line-height: 2.5rem;
    font-size: 0.8rem;
    width: 44%;
    background-color: #ff5e00;
    border-radius: 0.3rem;
    color: #fff;
    padding: 0 0.5rem;
    text-align: center;
    outline: none;
    border: none;
    display: block;
  }
  /*明细列表*/
  .recordList {
    padding: 0.5rem 0.7rem 0;
    background: #fff;
  }
  .recordList li {
    height: 2.6rem;
    line-height: 2.6rem;
    font-size: 0.8rem;
  }
  .recordList li:first-child {
    border-top: 1px solid #f2f2f2;
    background-color: #fafafa;
  }
  .recordList li span {
    display: inline-block;
    width: 28%;
    text-align: center;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
  }
  .recordList li span:last-child {
    width: 39%;
  }

  .fix {
    position: fixed;
    top: 3.3rem;
    left: 0;
    width: calc(100% - 2rem) !important;
    margin: 0 1rem !important;
    z-index: 999;
    background: #fff;
  }

  /*无数据*/
  .data-empty {
    text-align: center;
    font-size: 0.8rem;
    color: #bbb;
  }
</style>

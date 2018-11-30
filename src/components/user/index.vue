<template>
    <section>
      <div id="user_header">
        <header>
          <div class="header_nav">
            <a class="left-btn" :href="'tel:' + serviceTel"><i class="icon-service"></i></a>
            <span>{{userData.user_name}}</span>
            <a class="right-btn"><i class="icon-logout" @click="logout"></i></a>
          </div>
        </header>
        <div class="main">
          <div class="detail">
            <p>账户余额</p>
            <label>{{balance}}</label>
            <p>抵用券：{{tradeInfo.money}}元</p>
            <div class="btn-row">
              <button class="btn" @click="routerLike('topUp')">充值</button>
              <button class="btn" @click="routerLike('withdrawal')">提现</button>
            </div>
          </div>
        </div>
      </div>
      <div id="menu_list">
        <ul>
          <li>
            <router-link to="/moneyRecord"><i class="icon-list"></i><p>资金记录</p></router-link>
          </li>
        </ul>
        <ul>
          <li>
            <router-link to="/cardManage"><i class="icon-bankcard"></i><p>银行卡管理</p></router-link>
          </li>
          <li>
            <router-link to="/security"><i class="icon-password"></i><p>账号安全</p></router-link>
          </li>
        </ul>
        <ul>
          <li>
            <router-link to="/about"><i class="icon-wechat"></i><p>关于我们</p></router-link>
          </li>
          <li>
            <router-link to="/help"><i class="icon-question"></i><p>帮助中心</p></router-link>
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
          serviceTel: '', //客服电话
          userData: {}, //个人信息
          balance: '', //余额
          tradeInfo: {}, //策略信息
        }
      },
      created() {
        this.curWebInfos = JSON.parse(window.localStorage.getItem('webConfigInfos'));//获取初始化配置数据
        this.serviceTel = this.curWebInfos.service_hotline.value; //获取客服电话
      },
      mounted() {
        this.getUserData()
        this.getShowBalance()
        this.getTradeInfo()
      },
      methods: {
        getUserData() { //获取个人信息
          this.$axios.post('/api/user/userInfo', {token: JSON.parse(this.$cookie.get('_auth'))}).then(res => {
            if (res.data.code === 0) {
              this.userData = res.data.data
            }
          })
        },
        getShowBalance() { //获取可用余额
          this.$axios.post('/api/user/showBalance', {token: JSON.parse(this.$cookie.get('_auth'))}).then(res => {
            if (res.data.code === 0) {
              this.balance = res.data.data.balance
            }
          })
        },
        getTradeInfo() { //获取策略信息
          this.$axios.post('/api/user/tradeInfo', {token: JSON.parse(this.$cookie.get('_auth'))}).then(res => {
            if (res.data.code === 0) {
              this.tradeInfo = res.data.data
            }
          })
        },
        routerLike(link) { //跳转
          this.$router.push('/' + link);
        },
        logout(){  //退出登录
          this.$dialog.confirm({
            title: '退出登录',
            message: '确认退出?'
          }).then(() => {
            if(this.$cookie.get('_auth')){
              this.$cookie.clear(); //清除cookie
              this.$router.push('/login')//跳转登录页
            }else{
              this.$router.push('/login')
            }
          })
        },
      }
    }
</script>

<style scoped>
  /*头部*/
  #user_header {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('../../../static/imgs/user_header.jpg');
    padding: 3rem 1.3rem 0;
    box-sizing: border-box;
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 2;
  }
  header {
    background-color: transparent;
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
  /*账户信息*/
  .main {
    text-align: center;
  }
  #user_header .detail {
    padding: 0.3rem 0 1.3rem;
  }
  #user_header .detail p {
    color: #fff;
    font-size: 0.9rem;
    line-height: 0.8rem;
  }
  #user_header .detail label {
    color: #fff;
    font-size: 2rem;
    margin: 0.75rem 0;
    display: block;
  }
  #user_header .btn-row {
    padding: 0 1.3rem;
    margin-top: 1.3rem;
    display: flex;
    justify-content: space-between;
  }
  #user_header button {
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
  /*菜单列表*/
  #menu_list {
    padding-top: 15rem;
    padding-bottom: 3.7rem;
  }
  ul {
    margin-top: 0.7rem;
  }
  ul li {
    padding-left: 1rem;
    background-color: #fff;
    border-bottom: 1px solid #f1f2f3;
  }
  ul li a {
    display: flex;
    align-items: center;
    flex-basis: 100%;
    padding: 0.9rem 0;
    position: relative;
  }
  ul li a:after {
    content: "\E930";
    font-family: icomoon;
    color: #e0e0e0;
    font-size: 0.9rem;
    text-align: right;
    padding-right: 1.8rem;
    position: absolute;
    right: 0;
  }
  ul li a i {
    color: #ff5e00;
    font-size: 0.97rem;
    width: 10%;
    display: inline-block;
  }
  ul li a p {
    font-size: 0.8rem;
    color: #212121;
    padding: 0;
    margin: 0;
  }

</style>

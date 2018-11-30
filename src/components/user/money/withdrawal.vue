<template>
    <section>
      <van-nav-bar
        title="账户提现"
        left-arrow
        fixed
        @click-left="$back()"
      />
      <div class="content">
        <div class="item"><label>账户余额</label><span class="red">{{balance}}</span></div>
        <div class="item">
          <label>提现金额</label>
          <input placeholder="最低1元起提" v-model="submitWithdrawal.amount">
        </div>
        <div class="tip">提现银行卡</div>
        <div class="item bank">
          <label>
            <span>{{bankCardInfo.bank_name}}</span>
            <span>{{bankCardInfo.bank_card_num}}</span>
          </label>
          <span>{{userData.name}}</span>
        </div>
        <div class="padding-main">
          <button class="btn" @click="subWithdrawal()">确定</button>
        </div>
        <div class="time">
          <p>提现处理时间：</p>
          <p>上午8:45-下午17:00 (当天到账)</p>
          <p>下午17:00以后 (次日9点之前到账)</p>
          <p>到账时间以银行为准，节假日延后处理</p>
          <p>如急需到账,请电话 <a href="tel:4008762722">联系客服</a> </p>
        </div>
      </div>
    </section>
</template>

<script>
  export default {
    name: "withdrawal",
    data() {
      return {
        userData: {}, //个人信息
        balance: 0, //可用余额
        bankCardInfo: {}, //银行卡信息
        submitWithdrawal: { //上传提现信息
          token: JSON.parse(this.$cookie.get('_auth')) || '', //登录信息
          password: '', //提现密码
          amount: '', //金额
        },
      }
    },
    mounted() {
      this.getShowBalance();
      this.getBankCardInfo();
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
      getBankCardInfo() { //获取绑定银行卡信息
        this.$axios.post('/api/user/bankCardInfo', {token: JSON.parse(this.$cookie.get('_auth'))}).then(res => {
          if (res.data.code === 0) {
            this.bankCardInfo = res.data.data;
            if(this.bankCardInfo.length !== 0){
              this.getUserData();
            }
          }
        })
      },
      subWithdrawal() {
        if(!this.submitWithdrawal.amount) {
          this.$toast.fail({
            duration: 1000,   // 持续展示 toast
            message: '请输入提现金额'
          });
          return
        }
        if(this.submitWithdrawal.amount > this.balance) {
          this.$toast.fail({
            duration: 1000,   // 持续展示 toast
            message: '余额不足'
          });
          return
        }
        this.$axios({
          url: '/api/pay/baifuWithdraw',
          method: 'post',
          data: this.submitWithdrawal
        }).then(res => {
          if(res.data.code === 0) {
            this.$toast.success({
              duration: 2000,   // 持续展示 toast
              message: '提取成功 请注意查看'
            });
            this.getShowBalance();
            this.getBankCardInfo();
          }
        })
      }
    },
  }
</script>

<style scoped>
  .item {
    text-align: left;
    background-color: #fff;
    margin-bottom: 0.8rem;
    padding: 0 1.4rem;
    display: flex;
    align-items: center;
    height: 3.2rem;
    font-size: 0.9rem;
  }
  .item label {
    width: 25%;
  }
  .red {
    color: #ff494b !important;
  }
  .item input {
    height: 100%;
    width: 75%;
    font-size: 0.9rem;
    outline: none;
    border: none;
    padding: 0;
    border-radius: 0.3rem;
    box-sizing: border-box;
    line-height: 1;
  }
  .tip {
    margin-bottom: 0.8rem;
    padding-left: 1.4rem;
    color: #7a7a7a;
    text-align: left;
    font-size: 0.8rem;
  }
  /*银行卡*/
  .bank {
    justify-content: space-between;
  }
  .bank label {
    width: 80%;
  }
  .bank span {
    margin-right: 0.8rem;
  }
  /*按钮*/
  .padding-main {
    padding: 1rem;
  }
  .btn {
    background-color: #ff5e00;
    border-radius: 0.3rem;
    color: #fff;
    height: 2.6rem;
    line-height: 2.6rem;
    padding: 0 0.5rem;
    font-size: 0.9rem;
    text-align: center;
    outline: none;
    border: none;
    display: block;
    width: 100%;
  }
  /*注意*/
  .time p {
    font-size: 0.7rem;
  }
  .time p a {
    color: #249fed;
  }
</style>

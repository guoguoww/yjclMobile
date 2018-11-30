<template>
    <section>
      <van-nav-bar
        title="充值"
        left-arrow
        fixed
        @click-left="$back()"
      />
      <div class="content">
        <div class="item"><label>账户余额</label><span class="red">{{balance}}</span></div>
        <div class="item">
          <label>充值金额</label>
          <input placeholder="输入充值金额" v-model="submitTopUp.amount">
        </div>
        <div class="item">
          <label>充值方式</label>
          <select name="" id="" v-model="payType">
            <!--<option value="1">网银充值</option>-->
            <option value="2">支付宝充值</option>
            <!--<option value="3">微信充值</option>-->
          </select>
        </div>
        <div class="item bank" v-if="payType === '1' && haveCard">
          <label>
            <span>{{bankCardInfo.bank_name}}</span>
            <span>{{bankCardInfo.bank_card_num}}</span>
          </label>
          <span>{{userData.name}}</span>
        </div>
        <div class="item bank" v-if="payType === '1' && !haveCard">
          <router-link class="btn" to="/bankcardAdd">绑定银行卡</router-link>
        </div>
        <!--<div class="item" v-if="payType === '2'">-->
          <!--<label>支付宝账号</label>-->
          <!--<input placeholder="输入支付宝账号">-->
        <!--</div>-->
        <!--<div class="item" v-if="payType === '3'">-->
          <!--<label>微信账号</label>-->
          <!--<input placeholder="输入微信账号">-->
        <!--</div>-->
        <div class="padding-main" v-if="haveCard || (!haveCard && payType !== '1')">
          <button class="btn" @click="submitData()">确定</button>
        </div>
      </div>
      <div v-show="load" style="text-align: center">
        <div class="loadingBg">
            <van-loading color="white" />
        </div>
      </div>
    </section>
</template>

<script>
  export default {
    name: "topUp",
    data() {
      return {
        payType: '2', //支付方式
        userData: {}, //个人信息
        balance: 0, //可用余额
        bankCardInfo: {}, //银行卡信息
        haveCard: false, //绑定银行卡状态
        submitTopUp: { //上传充值信息
          amount: '', //金额
        },
        load: false,
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
              this.haveCard = true
            }else {
              this.haveCard = false
            }
          }
        })
      },
      submitData() {
        if(!this.submitTopUp.amount) {
          this.$toast.fail({
            duration: 1000,   // 持续展示 toast
            message: '请输入充值金额'
          });
          return
        }
        // if(this.submitTopUp.amount > this.balance) {
        //   this.$toast.fail({
        //     duration: 1000,   // 持续展示 toast
        //     message: '余额不足'
        //   });
        //   return
        // }
        // this.getShowBalance();
        // this.getBankCardInfo();

        this.pay();
        // this.$toast.success({
        //   duration: 1000,   // 持续展示 toast
        //   message: '充值成功（假）'
        // })

      },
      pay(){
          this.load = true;
          this.$axios.post('/api/pay/kuaiDianPay',{token: JSON.parse(this.$cookie.get('_auth')),amount: this.submitTopUp.amount,type: 2})
              .then(res => {
                  if(!res.data.code){
                      this.load = false;
                      window.location.href = res.data.data.pay_url;
                  }

              })
              .catch(err => {
                  this.$toast(err)
              })
      },
    }
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
  .item input,  .item select {
    height: 100%;
    width: 75%;
    font-size: 0.9rem;
    outline: none;
    border: none;
    padding: 0;
    border-radius: 0.3rem;
    line-height: 1;
    background: #fff;
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
  .loadingBg {
    display:flex;
    width: 50px;
    height: 50px;
    background: #666;
    line-height: 50px;
    margin: auto;
  }
  .van-loading {
    margin: auto;
  }
</style>

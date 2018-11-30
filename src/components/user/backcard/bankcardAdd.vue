<template>
    <section>
      <van-nav-bar
        title="绑定银行卡"
        left-arrow
        fixed
        @click-left="$back()"
      />
      <div class="content">
        <ul class="form">
          <li>
            <span>开户人</span>
            <input type="text" placeholder="" v-model="userData.name" readonly>
          </li>
          <li>
            <span>开户银行</span>
            <input type="text" placeholder="请输入开户银行" v-model="submitBankCardData.bankname">
          </li>
          <li>
            <span>银行卡号</span>
            <input type="text" placeholder="请输入银行卡号" v-model="submitBankCardData.cardnum">
          </li>
          <li>
            <span>开户省份</span>
            <input type="text" placeholder="请输入开户省份" v-model="submitBankCardData.bankprovince">
          </li>
          <li>
            <span>开户城市</span>
            <input type="text" placeholder="请输入开户城市" v-model="submitBankCardData.bankcity">
          </li>
          <li>
            <span>支行名称</span>
            <input type="text" placeholder="请输入支行名称" v-model="submitBankCardData.branch">
          </li>
        </ul>
        <div class="submitBtn">
          <button class="add_btn">确定</button>
          <div class="tip">
            <p>1. 绑定银行卡前先进行实名认证，请务必认真填写真实资料</p>
            <p>2. 一个身份证只能绑定一个帐号</p>
            <p>3. 如有疑问，请 <a href="tel:4008762722">联系客服</a> </p>
          </div>
        </div>
      </div>
    </section>
</template>

<script>
  export default {
    name: "bankcardAdd",
    data() {
      return {
        userData: {}, //个人中心
        bankCardInfo: {}, //银行卡信息
        submitBankCardData: { //需要提交的银行卡信息
          token: JSON.parse(this.$cookie.get('_auth')) || '', //登录信息
          bankname: '', //银行名称
          bankprovince: '', //支行省市
          bankcity: '', //支行城市
          branch: '', //支行名称
          cardnum: '', //银行卡号
        },
      }
    },
    mounted() {
      this.getUserData()
      this.getBankCardInfo()
    },
    methods: {
      getUserData() { //获取个人信息
        this.$axios.post('/api/user/userInfo', {token: JSON.parse(this.$cookie.get('_auth'))}).then(res => {
          if (res.data.code === 0) {
            this.userData = res.data.data
          }
        })
      },
      getBankCardInfo() { //获取绑定银行卡信息
        this.$axios.post('/api/user/bankCardInfo', {token: JSON.parse(this.$cookie.get('_auth'))}).then(res => {
          if (res.data.code === 0) {
            this.bankCardInfo = res.data.data;
            if(this.bankCardInfo.length !== 0) {
              this.submitBankCardData.bankname = this.bankCardInfo.bank_name;
              this.submitBankCardData.bankprovince = this.bankCardInfo.bank_province;
              this.submitBankCardData.bankcity = this.bankCardInfo.bank_city;
              this.submitBankCardData.branch = this.bankCardInfo.bank_branch;
              this.submitBankCardData.cardnum = this.bankCardInfo.bank_card_num;
            }
          }
        })
      },
    }
  }
</script>

<style scoped>
  /*输入框*/
  .form {
    background-color: #fff;
    margin-bottom: 0.8rem;
  }
  .form li {
    display: flex;
    align-items: center;
    padding: 0 1.35rem;
    border-bottom: 1px solid #f1f2f3;
    font-size: 1rem;
    height: 3.3rem;
  }
  .form li span {
    display: inline-block;
    width: 30%;
    font-size: 0.9rem;
    text-align: left;
  }
  .form li input {
    width: 70%;
    font-size: 0.9rem;
    outline: none;
    border: none;
    padding: 0;
    border-radius: 0.3rem;
    box-sizing: border-box;
    line-height: 1;
  }
  /*提交按钮*/
  .submitBtn {
    padding: 1.3rem;
  }
  .submitBtn .add_btn {
    background-color: #ff5e00;
    border-radius: 0.3rem;
    color: #fff;
    height: 2.6rem;
    line-height: 2.6rem;
    padding: 0 0.8rem;
    font-size: 0.9rem;
    text-align: center;
    outline: none;
    border: none;
    display: block;
    width: 100%;
  }
  /*注意*/
  .tip {
    margin-top: 0.8rem;
  }
  .tip p {
    color: #adadad;
    line-height: 1;
    font-size: 0.7rem;
    text-align: left;
    padding: 0;
  }
  .tip p a {
    color: #249fed;
  }
</style>

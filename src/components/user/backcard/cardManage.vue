<template>
    <section>
      <van-nav-bar
        title="银行卡管理"
        left-arrow
        fixed
        @click-left="$back()"
      />
      <div class="content">
        <div class="edit-guide" v-if="!bankCardInfoModify">
          <i class="icon-bankcard"></i>
          <p>您还没有绑定银行卡</p>
          <span>请先实名认证再进行绑定银行卡</span>
          <router-link class="btn" v-if="realNameStatus === 0 || realNameStatus === 3" to="/verifiedEdit">前往实名认证</router-link>
          <a class="btn disabled" href="javascript:void (0);" v-if="realNameStatus === 1">实名审核中</a>
          <router-link class="btn" v-if="realNameStatus === 2" to="/bankcardAdd">立即绑定银行卡</router-link>
        </div>
        <div class="info" v-if="bankCardInfoModify">
          <div class="card">
            <div>
              <label>
                <span>{{bankCardInfo.bank_name}}</span>
              </label>
              <span>储蓄卡</span>
            </div>
            <p>{{bankCardInfo.bank_card_num}}</p>
            <b>{{userData.name}}</b>
          </div>
          <p>为了保障您的资金安全，请确认银行卡信息</p>
          <p>如有疑问，请 <a href="tel:4008762722">联系客服</a> </p>
          <router-link class="btn" to="/bankcardAdd">修改</router-link>
        </div>
      </div>
    </section>
</template>

<script>
  export default {
    name: "cardManage",
    data() {
      return {
        userData: {}, //个人信息
        realNameStatus: 0, //实名认证状态
        bankCardInfo: {}, //银行卡信息
        bankCardInfoModify: true, //是否存在银行卡
      }
    },
    mounted() {
      this.getUserData();
      this.getRealNameStatus();
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
      getRealNameStatus() { //获取实名状态
        this.$axios.post('/api/user/getRealNameStatus', {token: JSON.parse(this.$cookie.get('_auth'))}).then(res => {
          if (res.data.code === 0) {
            this.realNameStatus = res.data.data.status;
          }
        })
      },
      getBankCardInfo() { //获取绑定银行卡信息
        this.$axios.post('/api/user/bankCardInfo', {token: JSON.parse(this.$cookie.get('_auth'))}).then(res => {
          if (res.data.code === 0) {
            this.bankCardInfo = res.data.data;
            if(this.bankCardInfo.length === 0){
              this.bankCardInfoModify = false;
            }else {
              this.bankCardInfoModify = true;
            }
          }
        })
      },
    }
  }
</script>

<style scoped>
  /*未绑定银行卡*/
  .edit-guide {
    text-align: center;
    padding: 0.6rem 1rem;
  }
  .edit-guide i {
    color: #e0e0e0;
    font-size: 14rem;
  }
  .edit-guide p {
    font-size: 1rem;
    margin-top: 0.2rem;
    color: #212121;
  }
  .edit-guide > span {
    display: block;
    text-align: center;
    font-size: 0.85rem;
    color: #adadad;
  }
  a.btn {
    margin-top: 1.5rem;
    background-color: #ff5e00;
    border-radius: 0.3rem;
    color: #fff;
    height: 2.6rem;
    line-height: 2.6rem;
    padding: 0 0.5rem;
    font-size: 0.85rem;
    text-align: center;
    outline: none;
    border: none;
    display: block;
    width: 100%;
  }
  /*已绑定*/
  .info {
    padding: 0.7rem 1.6rem;
  }
  .card {
    background: -webkit-linear-gradient(0, #f97384, #fe5359);
    border-radius: 1rem;
    color: #fff;
    font-size: 0.9rem;
    padding: 1.6rem;
    position: relative;
    overflow: hidden;
    margin-bottom: 1.6rem;
  }
  .card > div {
    border-bottom: 1px solid #fff;
    padding-bottom: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .card > div label {
    width: 80%;
    text-align: left;
    font-size: 0.9rem;
  }
  .card p {
    color: #fff !important;
    font-size: 1rem !important;
    padding: 0.85rem 0;
  }
  .card b {
    display: block;
    text-align: right;
  }
  .info p {
    color: #adadad;
    text-align: center;
    font-size: 0.7rem;
    line-height: 1;
  }
  .info p a {
    color: #249fed;
  }

  .disabled {
    background: #c7c7c7 !important;
    border: 1px solid #c7c7c7 !important;
    color: #fff !important;
  }
</style>

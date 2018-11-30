<template>
  <div>
    <div class="pointBuyC" >
      <ul class="options">
        <li>
          <div class="strategyMoney"><span>策略金额</span></div>
          <ul class="selMoneyC">
            <li>
              <span class="active">{{initStrMoney}}</span>
            </li>
          </ul>
        </li>
        <li>
          <p><span>买入数量</span><span>{{buyNum}}股</span></p>
          <p><span>资金使用率</span><span>{{buyRate}}%</span></p>
        </li>
        <li>
          <div><span>触发止盈</span> <p><em class="active">{{experGain}}%</em></p></div>
        </li>
      </ul>
    </div>
    <ul class="optionsSecond" style="margin-bottom: 135px">
      <li><p><span>持仓时间</span><span class="orange"> T+1|D</span></p><p><span>支付交易综合费 <em class="orange">0</em> 元</span><br><span>(含前两个交易日的费用)</span></p></li>
      <li><p><span>履约保证金</span></p><p><span class="orange">免费</span></p></li>
    </ul>

    <!--固定定位-->
    <div class="optionsBottom">
      <ul>
        <li><p><span>总计</span><span class="orange"> 1</span>元</p><p><span>余额</span><span class="orange"> 0元</span></p></li>
        <li><p><span>点买时间段:交易日09:30-11:30 13:00-14:55</span></p></li>
        <li><p @click="modPointBuy">模拟点买</p></li>
      </ul>
    </div>
  </div>
</template>

<script>
    export default {
      name: "oneExperience",
      data(){
        return {
          initStrMoney: 3000,
          buyNum: '',//可买入的数量
          buyRate: '',//买入的资金使用率
          experGain: '',//免费体验触发止盈线
        }
      },
      props: ['latestPrice','parentOjb'],
      mounted(){

          console.log(this.parentOjb)

        //初始化计算购买数量和资金使用率
        if(this.latestPrice != '--'){
          this.buyNum = parseInt((this.initStrMoney / this.latestPrice)/100)*100;
          this.buyRate = ((this.buyNum) / (this.initStrMoney / this.latestPrice))*100;
          this.buyRate = Number(this.buyRate).toFixed(2);
        }else {
          this.buyNum = '--';
          this.buyRate = '--';
        }
        //触发止盈线
        this.experGain = JSON.parse(window.localStorage.getItem('webConfigInfos')).experience_gain.value;
      },
      methods: {
          modPointBuy(){
              if(this.$cookie.get('_auth')){
                  //
                  if (!this.buyNum) {
                      return this.$toast('请换其他股票购买');
                  }

                  this.submitTrade(this.buyNum);


              }else {
                  this.$toast('请先登录');
                  setTimeout(() => {
                      this.$router.push('/login');
                  },1000)
              }
          },
          submitTrade(amount){
              this.$axios.post('/api/trade/submitTrade',
                  {
                      token: JSON.parse(this.$cookie.get('_auth')),
                      trade_code: this.parentOjb.defaultCode,
                      update_type: 1,
                      bs_price: this.latestPrice,
                      amount,
                      is_experience: 1,
                      multiple: 0,
                      transaction_money: this.initStrMoney,
                  }
              ).then(res => {

              }).catch(err => {
                  this.$toast(err);
              })
          },
      },
      computed: {

      },
      watch: {
        latestPrice(curPrice){
          //可买入的数量和资金使用率的计算   策略金额/当前最新价格,
          if(curPrice != '--'){
            this.buyNum = parseInt((this.initStrMoney / curPrice)/100)*100;
            this.buyRate = ((this.buyNum) / (this.initStrMoney / curPrice))*100;
            this.buyRate = Number(this.buyRate).toFixed(2);
          }else {
            this.buyNum = '--';
            this.buyRate = '--';
          }
        },
      }
    }
</script>

<style scoped>
  p {
    margin: .3rem 0;
  }
  .pointBuyC {
    margin-top: .6rem;
    background: #fff;
    padding: .6rem .8rem;
    font-size: .8rem;
    text-align: left;
  }
  .pointBuyC .options > li{
    border-bottom: 1px solid #f1f2f3;
    padding: .3rem 0 ;
  }
  .pointBuyC .options > li:last-child{
    border-bottom: none;
  }
  .pointBuyC .options > li:nth-child(2) span:nth-child(2){
    color: #ff5e00;
  }
  .pointBuyC .options > li:last-child div{
    display: flex;
    align-items: center;
  }
  .pointBuyC .options > li:last-child span{
    display: inline-block;
    width: 26%;
    text-align: left;
  }
  .pointBuyC .options > li:last-child p em{
    font-style: normal;
    display: inline-block;
    border: 1px solid #f1f2f3;
    padding: .2rem 1rem;
    margin-right: .3rem;
    border-radius: .2rem;
  }
  .pointBuyC .options > li:last-child p em.active{
    border: 1px solid #ff5e00;
    color: #ff5e00;
  }
  .pointBuyC .options > li > p span:first-child{
    display: inline-block;
    width: 26%;
    text-align: left;
  }
  .pointBuyC .strategyMoney {
    text-align: left;
  }
  .selMoneyC li{
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    text-align: center;
    font-size: .8rem;
    padding-bottom: .3rem;
  }
  .selMoneyC li span {
    width: 23%;
    display: inline-block;
    font-style: normal;
    border: 1px solid #e0e0e0;
    margin-top: .5rem;
    border-radius: .2rem;
    padding: .4rem 0;
  }
  .selMoneyC li span.active {
    border: 1px solid #ff5e00;
    color: #ff5e00;
  }
  .optionsSecond {
    margin-top: .6rem;
    background: #fff;
    font-size: .8rem;
    padding: .6rem .8rem;
  }
  .optionsSecond li {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f1f2f3;
    padding: .2rem 0;
  }
  .optionsSecond li:last-child {
    border-bottom: none;
  }
  .orange {
    color: #ff5e00;
  }

  .optionsBottom {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    font-size: .8rem;
    border-top: 1px solid #f1f2f3;
  }
  .optionsBottom ul {
    padding: .3rem .8rem;
  }
  .optionsBottom ul li {
    display: flex;
    justify-content: space-between;
  }
  .optionsBottom ul li:last-child p {
    display: inline-block;
    width: 100%;
    background: #ff5e00;
    color: #fff;
    padding: .6rem 0;
    border-radius: .2rem;
  }
</style>

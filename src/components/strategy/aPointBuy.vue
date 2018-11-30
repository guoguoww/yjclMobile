<template>
    <div>
      <div class="pointBuyC" >
        <ul class="options">
          <li>
            <div>
              <div class="strategyMoney">
                <span>策略金额</span>
                <div>
                  <span>购买方式：</span>
                  <select v-model="buyTypeVal" @change="selBuyType">
                    <option value="" disabled>请选择</option>
                    <option :value="item.i" v-for="(item, index) of buyType" :key="index">{{item.name}}</option>
                  </select>
                </div>
              </div>
              <ul class="selMoneyC">
                <li>
                  <span :class="{active: defaultIndex == index || item == defineMoney}" v-for="(item, index) of strategyAmount" :key="index" @click="selStrMoney(index,item)">{{item}}万</span>
                </li>

              </ul>
            </div>
          </li>
          <li class="specialLi">
            <p><span>点买金额</span><input type="number" v-model.trim="defineMoney" placeholder="请输入点买金额" class="orange"> 万元</p>
            <p v-show="limitPriceShow"><span>限价价格</span><input type="number" v-model.trim="limitPriceVal" placeholder="请输入限价价格"> 元</p>
          </li>
          <li>
            <p><span>买入数量</span><span class="orange">{{buyNum}}</span>股</p>
            <p><span>资金使用率</span><span class="orange">{{buyRate}}</span>%</p>
          </li>
          <li>
            <div><span>触发止盈</span> <p><em class="active">{{trigPlus}}</em></p></div>
            <div>
              <span>触发止损</span>
              <p><em :class="{active: trigLossIndex == index}" v-for="(item, index) of trigLossVal" :key="index" @click="trigLossEvent(index,item.multiple)">-{{item.val}}</em></p>
            </div>
          </li>
        </ul>
      </div>
      <ul class="optionsSecond" style="margin-bottom: 135px">
        <li><p><span>持仓时间</span><span class="orange"> T+1|D</span></p><p><span>支付交易综合费</span> <span class="orange">{{tradeZHCost}}</span><br><span>(含前两个交易日的费用)</span></p></li>
        <li><p><span>履约保证金</span></p><p><span class="orange">{{perMargin}}</span>元</p></li>
      </ul>

      <!--固定定位-->
      <div class="optionsBottom">
        <ul>
          <li><p><span>总计</span><span class="orange"> {{perMargin + tradeZHCost}}</span>元</p><p><span>余额</span><span class="orange"> {{showBanlance}}</span>元</p></li>
          <li><p><span>浮动盈亏大于</span><span class="orange">{{perMargin*0.6}}</span>元自动递延， 递延费<span class="orange">{{deferredFees}}</span>元/天</p></li>
          <li><p><van-checkbox v-model="checked" class="orange" @change="isCheckBox">使用递延费用折扣券</van-checkbox></p></li>
          <li><p @click="imPointBuy">立即点买</p></li>
        </ul>
      </div>

      <van-dialog
        title="确认点买"
        v-model="imPointBuyShow"
        show-cancel-button
        :before-close="beforeClose"
      >
        <div class="confirmInfo" style="color: #333">
          <ul style="padding: 1rem">
            <li style="display: flex;justify-content: space-between;line-height: 2"><span>股票名称</span><span style="color: #ff494b ">{{parentOjb.defaultCodeName}}</span></li>
            <li style="display: flex;justify-content: space-between;line-height: 2"><span>股票代码</span><span style="color: #ff494b ">{{parentOjb.defaultCode}}</span></li>
            <li style="display: flex;justify-content: space-between;line-height: 2"><span>交易本金</span><span style="color: #ff494b ">{{initStrMoney * 10000}}元</span></li>
            <li style="display: flex;justify-content: space-between;line-height: 2"><span>买入数量</span><span>{{buyNum}}</span></li>
            <li style="display: flex;justify-content: space-between;line-height: 2"><span>买入价格</span><span>{{buyTypeVal== 1? sellPrice:limitPriceVal}} </span></li>
          </ul>
        </div>
      </van-dialog>
    </div>
</template>

<script>
    export default {
      name: "aPointBuy",
      props: ['latestPrice','parentOjb','sellPrice'],
      data(){
        return {
          checked: false,//是否使用递延费折扣券
          showBanlance: '',//用户资金余额
          selMoney: [],
          defaultIndex: 0,//默认策略金额下标
          strategyAmount: [1,2,3,5,10,20,30,50],//策略金额列表
          initStrMoney: 1,//默认的策略金额  1万
          buyType: [{i: 1,name: '立即买入'},{i: 2,name: '限价委托'}],
          buyTypeVal: 1,//股票购买方式
          buyNum: '',//可买入的数量
          buyRate: '',//买入的资金使用率
          limitPriceShow: false,//初始化限价价格不显示
          limitPriceVal: '',//限价价格显示出来后，用户输入的价格
          defineMoney: 1,//自定义输入策略金额
          trigPlus: '',//触发止盈
          trigPlusRate: '',//触发止盈率
          trigLoss: [],//触发止损值  8,6,5,倍杠杆
          trigLossRate: '',//触发止损率
          trigLossIndex: 0,//默认触发止损的值下标
          leverage: 10,//杠杆倍数，默认8倍
          imPointBuyShow: false, //确认点买模态显示
        }
      },
      mounted(){
        //初始化计算触发止盈  止盈=交易金额*（1+止盈率）
        this.trigPlusRate = JSON.parse(window.localStorage.getItem('webConfigInfos')).interference_ratio.value;
        this.trigPlus = (this.initStrMoney *10000) * (1 + Number(this.trigPlusRate));
        //初始化计算触发止损  股票点买杠杆分为5 6 8倍 如：买入一万块钱8倍杠杆为1250元   6倍杠杆为1666元  5倍杠杆为2000元
        // 分别对应止损为：-1000                   -1332             -1600
        // 1250/1.25                1666/1.25          2000/1.25
        this.trigLossRate = JSON.parse(window.localStorage.getItem('webConfigInfos')).stop_loss.value;

        //初始化计算购买数量和资金使用率
        if(this.latestPrice != '--'){
          this.buyNum = parseInt((this.initStrMoney *10000 / this.latestPrice)/100)*100;
          this.buyRate = ((this.buyNum) / (this.initStrMoney*10000 / this.latestPrice))*100;
          this.buyRate = Number(this.buyRate).toFixed(2);
        }else {
          this.buyNum = '--';
          this.buyRate = '--';
          this.buyRate = '--';
        }


        //初始化计算交易综合费
        if(JSON.parse(this.$cookie.get('_auth'))){
            this.getShowBalance();//调用用户余额接口
        }


      },
      methods: {
        isCheckBox(){//是否选中使用递延费折扣券
          if(this.checked){
            this.tradeInfo();
          }
        },
        tradeInfo() { //获取策略信息
          this.$axios.post('/api/user/tradeInfo', {token: JSON.parse(this.$cookie.get('_auth'))}).then(res => {
            if (res.data.code === 0) {
              if(res.data.data.money >= this.deferredFees){
                this.checked = true;
              }else {
                this.checked = false;
              }
            }
          })
        },
        selStrMoney(index,item){//选择策略金额点击事件
          this.defaultIndex = index;
          this.initStrMoney = item;//当选择策略金额时，策略金额就是这选中的值
          this.defineMoney = item;//让自定义的策略金额为空

        },
        getShowBalance() { //获取可用余额
          this.$axios.post('/api/user/showBalance', {token: JSON.parse(this.$cookie.get('_auth'))}).then(res => {
            if (res.data.code === 0) {
              this.showBanlance = res.data.data.balance;
            }
          })
        },
        selBuyType(){//选择购买方式点击事件
          if(this.buyTypeVal == 2){//当点击是限价的购买方式时，让限价价格显示出来
            this.limitPriceShow = true;

            //当用户一旦选择限价购买，那么购买数量和资金使用率初始化为0
            this.buyNum = 0;
            this.buyRate = 0;
            this.buyRate = Number(this.buyRate).toFixed(2);

          }else if(this.buyTypeVal == 1){
            this.limitPriceShow = false;
            if(this.latestPrice != '--'){

              this.buyNum = parseInt((this.initStrMoney *10000 / this.latestPrice)/100)*100;
              this.buyRate = ((this.buyNum) / (this.initStrMoney*10000 / this.latestPrice))*100;
              this.buyRate = Number(this.buyRate).toFixed(2);
            }else {
              this.buyNum = '--';
              this.buyRate = '--';
              this.buyRate = '--';
            }
          }
        },
        trigLossEvent(index, beishu){//触发止损的值的点击事件
          this.trigLossIndex = index;
          this.leverage = beishu;//杠杆倍数
        },
        imPointBuy(){//立即点买按钮，弹出确认框
          //先判断有么有登录，没有登录就去登录页面
          //再根据购买股票的方式来判断 购买价格，如果是限价购买则需要用户自行填写价格，市价购买就是当前最新价
          if(this.$cookie.get('_auth')){
            if(this.buyTypeVal == 2){
              var bs_price = this.limitPriceVal;

            }else if(this.buyTypeVal == 1){
              if(this.latestPrice != '--'){
                var bs_price = this.latestPrice;
              }else {
                var bs_price = 0;
              }

            }else {
              return this.$toast('请先选择购买方式');
            }

            if(this.buyTypeVal == 1 && this.buyNum == 0){
              this.$toast('可买入的数量为0，不能购买，换其他股票');
              return;
            }

            if(this.buyTypeVal == 2 && !this.limitPriceVal){
              this.$toast('请先输入限价价格');
              return;
            }
            this.imPointBuyShow = true;


          }else {
            this.$toast('请先登录');
            setTimeout(() => {
              this.$router.push('/login');
            },1000)
          }

        },
        beforeClose(action, done) { //确认点买按钮点击
          if (action === 'confirm') {
            var bs_price = 0;
            if(this.latestPrice != '--'){
              bs_price = this.latestPrice;
            }else {
              bs_price = 0;
            }
            let is_coupon = this.checked? 1 : 0;
            this.$axios({
              method: 'post',
              url: '/api/trade/submitTrade',
              data: {
                token: JSON.parse(this.$cookie.get('_auth')),
                trade_code: this.parentOjb.defaultCode,
                update_type: this.buyTypeVal,
                bs_price,
                amount: this.buyNum,
                is_experience: 0,
                multiple: this.leverage,
                transaction_money: this.initStrMoney*10000,
                is_coupon,
              }
            })
              .then(res => {
                if(res.data.code === 0){
                  this.$toast(res.data.msg);

                  this.limitPriceVal = '';//让限购价格清空
                  this.defineMoney = '';//让自定义金额清空

                  this.defaultIndex = 0;//交易成功后让重新选择交易金额
                  this.limitPriceShow = false;
                  this.buyTypeVal = 1;//交易成功后，让重新选择交易方式
                  done();
                }else if(res.data.code ===3){
                  this.$toast(res.data.msg);
                  done();
                  // this.$toast.push('/user/security');//跳转到实名认证页面去实名认证
                }else {
                  this.$toast(res.data.msg);
                  done();
                }
              })
              .catch(err => {
                this.$toast(err.data.msg);
                done();
              })
          } else {
            done();
          }
        },
        // submitTrade(bs_price){
        //
        // },
      },
      computed: {
        trigLossVal(){//触发止损金额
          let tenLossVal =  parseInt(((this.initStrMoney *10000) / 10) / (1 + Number(this.trigLossRate)));//10倍杠杆的止损值
          let eightLossVal =  parseInt(((this.initStrMoney *10000) / 8) / (1 + Number(this.trigLossRate)));//8倍杠杆的止损值
          let sixLossVal =  parseInt(((this.initStrMoney *10000) / 6) / (1 + Number(this.trigLossRate)));//6倍杠杆的止损值
          let fiveLossVal =  parseInt(((this.initStrMoney *10000) / 5) / (1 + Number(this.trigLossRate)));//5倍杠杆的止损值

          let lossListVal = [{multiple: 10, val: tenLossVal},{multiple: 8, val: eightLossVal},{multiple: 6,val: sixLossVal},{multiple: 5, val: fiveLossVal},]

          return this.trigLoss.concat(lossListVal);
        },
        tradeZHCost(){//交易综合费
          return JSON.parse(window.localStorage.getItem('webConfigInfos')).comprehensive_fee.value * (this.initStrMoney);
        },
        perMargin(){//履约保证金  根据选择的杠杆和策略金额不同而变化   公式：策略金额/杠杆倍数
          let lyPromiseMoney = parseInt(this.initStrMoney*10000 / this.leverage);
          return lyPromiseMoney;
        },
        deferredFees(){//递延费  公式 ：策略金额*后台返回的递延费率
          return JSON.parse(window.localStorage.getItem('webConfigInfos')).deferred_charge.value * (this.initStrMoney);
        },
      },
      watch: {
        latestPrice(curPrice){
          //可买入的数量和资金使用率的计算   策略金额/当前最新价格,
          if(curPrice != '--'){
            this.buyNum = parseInt((this.initStrMoney *10000 / curPrice)/100)*100;
            this.buyRate = ((this.buyNum) / (this.initStrMoney*10000 / curPrice))*100;
            this.buyRate = Number(this.buyRate).toFixed(2);
          }else {
            this.buyNum = '--';
            this.buyRate = '--';
            this.buyRate = '--';
          }
        },
        initStrMoney(curMoney){
          //当策略金额变化时，可买入的数量和资金使用率都变化
          if(this.buyTypeVal == 2){//限价价格购买

            this.buyNum = parseInt((curMoney *10000 / this.limitPriceVal)/100)*100;
            this.buyRate = ((this.buyNum) / (curMoney*10000 / this.limitPriceVal))*100;
            this.buyRate = Number(this.buyRate).toFixed(2);

          }else {
            if(this.latestPrice != '--'){
              this.buyNum = parseInt((curMoney *10000 / this.latestPrice)/100)*100;
              this.buyRate = ((this.buyNum) / (curMoney*10000 / this.latestPrice))*100;
              this.buyRate = Number(this.buyRate).toFixed(2);
            }

          }


          //触发止盈的变化
          this.trigPlus = (curMoney *10000) * (1 + Number(this.trigPlusRate));
          //触发止损的变化  用computed做了监视了




        },
        limitPriceVal(curLimitPrice){//对当前的限价价格做监视
          console.log(curLimitPrice,'限价价格')
          //如果选择了限价购买的方式，那么购买数量和资金使用率也要变化
          if(curLimitPrice){
            this.buyNum = parseInt((this.initStrMoney *10000 / curLimitPrice)/100)*100;
            this.buyRate = ((this.buyNum) / (this.initStrMoney*10000 / curLimitPrice))*100;
            this.buyRate = Number(this.buyRate).toFixed(2);
          }else {
            //当用户选择的是限价购买，而且限价价格为0时
            this.buyNum = 0;
            this.buyRate = 0;
            this.buyRate = Number(this.buyRate).toFixed(2);
          }
        },
        defineMoney(defineAmount){//当用户不用指定的策略金额，选择自己输入策略金额时
          if(defineAmount){
            this.defaultIndex = -1;

            this.initStrMoney = defineAmount;

          }
          else {
            // 如果自定义的策略金额为0时，让默认的策略金额为1万
            this.initStrMoney = 1;
            this.defaultIndex = 0;
          }

        },

      }
    }
</script>

<style scoped>
  .van-checkbox__icon--checked .van-icon {
    color: #fff;
    border-color: #ff5e00 !important;
    background-color: #ff5e00 !important;
  }
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
    padding: .2rem .4rem;
    margin-right: .5rem;
    border-radius: .2rem;
    margin-top: .3rem;
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
    display: flex;
    justify-content: space-between;
    text-align: left;
  }
  .strategyMoney select {
    border: none;
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
  .specialLi input {
    border: 1px solid #e0e0e0;
    padding: .3rem;
    border-radius: .2rem;
  }
  .confirmInfo ul li {
    display: flex;
    justify-content: space-around;
    line-height: 2;
  }
</style>

<template>
    <div>
      <header class="head">
        <div class="backTop" @click="$router.push('/')"><span class="icon-chevron-thin-left"></span></div>
        <div class="tab"><span>结算详情</span></div>
      </header>

      <div class="tradeList">
        <ul>
          <li>
            <p class="title">交易合作</p>
            <ul class="secondList">
              <li>
                <p><span>点买人：</span><span class="red">{{detailInfos.user_name}}</span></p>
              </li>
            </ul>
          </li>
          <li>
            <p class="title">交易明细</p>
            <ul class="secondList">
              <li>
                <p><span>交易本金：</span><span class="red">{{detailInfos.bail_money}}</span></p>
                <p><span>交易品种：</span><span class="red">{{detailInfos.title}}</span></p>
                <p><span>交易数量：</span><span class="red">{{detailInfos.amount}}</span></p>
              </li>
              <li>
                <p><span>买入价格：</span><span class="red">{{detailInfos.bs_price}}</span></p>
                <p><span>卖出价格：</span><span class="red">{{detailInfos.sale_price}}</span></p>
                <p><span>点买类型：</span><span class="red">{{detailInfos.update_type==1?'立即买入':'限价委托'}}</span></p>
              </li>
              <li>
                <p><span>买入时间：</span><span class="red">{{detailInfos.create_time}}</span></p>
                <p><span>卖出时间：</span><span class="red">{{detailInfos.sale_time}}</span></p>
              </li>
            </ul>
          </li>
          <li>
            <p class="title">交易盈亏分配</p>
            <ul class="secondList">
              <li>
                <p><span>交易盈亏：</span><span class="red">{{detailInfos.loss_money}}</span></p>
              </li>

            </ul>
          </li>
          <li>
            <p class="title">管理费</p>
            <ul class="secondList">
              <li>
                <p><span>交易综合费：</span><span class="red">{{detailInfos.transaction_fee}}</span></p>
                <p><span>递延次数：</span><span class="red">{{detailInfos.deferred_times}}</span></p>
                <p><span>递延费用：</span><span class="red">{{detailInfos.deferred_charge}}</span></p>
              </li>

            </ul>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
    export default {
      name: "detailInfo",
      data(){
        return {
          detailInfos: {},
        }
      },
      mounted(){
        this.detailInfos = this.$route.params.obj;

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
  .tradeList {
    margin-top: 4rem;
    background: #fff;
    padding: 1rem;
  }
  .tradeList p {
    color: #999;
  }
  .tradeList p.title {
    font-size: 1rem;
    text-align: left;
    color: #121212;
  }
  .secondList li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: .9rem;
    padding: .5rem 1rem;
  }
  .secondList li p {
    display: flex;
    flex-direction: column;

  }
  .secondList li span {
    flex: 1;
    text-align: left;
    padding: .2rem 0;
  }
  .red {
    color: #ff494b !important;
  }
</style>

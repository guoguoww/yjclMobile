<template>
    <section>
      <van-nav-bar
        title="最新动态"
        left-arrow
        fixed
        @click-left="$back()"
      />
      <div class="content">
        <ul class="dynamic">
          <li v-for="item in tradingList" v-if="tradingList.length > 0">
            <label>
              <h4>{{item.nick_name}}</h4>
              <span >{{item.title}} {{item.code}}</span>
            </label>
            <label>
              <p class="red">{{item.amount}}</p>
              <span >{{item.transaction_money}}</span>
            </label>
            <router-link to="/strategy/aPointBuy">我要点买</router-link>
          </li>
          <li class="data-empty" v-if="tradingList.length === 0">
            <div class="data-empty">暂无数据</div>
          </li>
        </ul>
        <van-pagination
          v-model="currentPage"
          :total-items="tradingTotal"
          :items-per-page="rows"
          :show-page-size="3"
          force-ellipses
          @change="changePage"
        />
      </div>
    </section>
</template>

<script>
  export default {
    name: "dynamic",
    data() {
      return {
        currentPage: 1, //分页
        start: 0, //从第几个开始
        rows: 6, //每页显示几个
        tradingList: [], //数据列表
        tradingTotal: 0, //总条数
      }
    },
    mounted() {
      this.getTradingList();
    },
    methods: {
      getTradingList() { //获取交易动态
        this.$axios.post('/api/common/getIndexInfo', {token: localStorage.getItem('_auth')}).then(res => {
          if (res.data.code === 0) {
            this.tradingTotal = res.data.data.data.length;

            this.tradingList = res.data.data.data.slice(this.start, (this.rows+this.start))
          }
        })
      },
      changePage(page) {
        this.start = this.rows * (page-1);
        this.getTradingList();
      }
    }
  }
</script>

<style scoped>
  .dynamic {
    padding: 0 0.85rem;
    background: #fff;
  }
  .dynamic li {
    border-bottom: 1px solid #f1f2f3;
    padding: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .dynamic li label{
    width: 44%;
    text-align: left;
    font-size: 0.85rem;
  }
  .dynamic li label p {
    font-size: 0.85rem;
  }
  .dynamic li span {
    color: #7a7a7a;
  }
  .dynamic li label + label {
    width: 36%;
  }
  .dynamic li a {
    font-size: 0.7rem;
    height: 1.8em;
    line-height: 1.8rem;
    box-sizing: content-box;
    padding: 0 0.1rem;
    display: inline-block;
    width: 20%;
    background-color: transparent;
    border-radius: 0.3rem;
    text-align: center;
    outline: none;
    color: #ff5e00;
    border: 1px solid #ff5e00;
  }
</style>

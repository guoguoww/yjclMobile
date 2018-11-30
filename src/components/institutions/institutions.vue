<template>
    <section>
      <van-nav-bar
        title="专业机构"
        left-arrow
        fixed
        @click-left="$back()"
      />
      <div class="content">
        <ul class="institutions">
          <li v-for="item in proInsList" v-if="proInsList.length > 0" @click="insDet(item)">
            <p>{{item.title}}</p>
          </li>
          <!--暂无数据-->
          <li class="data-empty" v-if="proInsList.length === 0">
            <div class="data-empty">暂无数据</div>
          </li>
        </ul>
      </div>
    </section>
</template>

<script>
  export default {
    name: "institutions",
    data() {
      return {
        currentPage: 1,
        proInsList: '', //专业机构列表
      }
    },
    created() {
      this.getInfoList()
    },
    methods: {
      getInfoList() { //获取列表
        this.$axios({
          url: '/api/article/getInfoByType',
          method: 'post',
          data: {
            type: 2
          },
        }).then(res => {
          if(res.data.code === 0) {
            this.proInsList = res.data.data
          }
        })
      },
      insDet(item) { //详情跳转
        this.$router.push({
          name: 'insDetails',
          params: {
            paramsData: item
          }
        })
      }
    }
  }
</script>

<style scoped>
  .institutions {
    padding: 0 0.85rem;
    background: #fff;
  }
  .institutions li {
    border-bottom: 1px solid #f1f2f3;
    padding: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .institutions li p {
    font-size: 0.8rem;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
  }
  /*无数据*/
  .data-empty {
    text-align: center;
    font-size: 0.8rem;
    color: #bbb;
  }
</style>

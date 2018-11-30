<template>
    <div>
      <header class="head">
        <div class="backTop" @click="$router.push('/')"><span class="icon-chevron-thin-left"></span></div>
        <div class="tab"><span :class="{active: curI == index}" v-for="(item, index) of tabs" :key="index" @click="tabClick(item,index)">{{item.name}}</span></div>
        <div class="questionIcon"><router-link to="/help" tag="div"><span class="icon-question"></span></router-link></div>
      </header>
      <van-tabs color="#ff5e00" style="margin-top: 52px" @click="onTabClick">
        <van-tab title="点买">
          <div class="searchC">
            <div>
              <input type="text" v-model="watchInput" placeholder="请输入股票代码/名称/拼音" @focus="focusEvent" @blur="blurEvent"> <a href="javascript:;" v-show="focusShow" @click="cancelBtn">取消</a>
            </div>
            <ul class="curStock">
              <li>
                <div>
                  <span class="stockName">{{defaultCodeName}}</span>
                  <!--<i class="icon-remove green"></i>-->
                  <!--<i class="icon-add  red"></i>-->
                </div>
                <div class="stockCode">
                  <span>{{defaultCode}}</span>
                </div>
              </li>
              <li><div><span class="stockLatestPrice " :class="[diff>0 ?'red':'green']">{{dymicPrice}}</span><i v-show="diff > 0" class="icon-arrow-up red"></i><i v-show="diff < 0" class="icon-arrow-down green"></i></div><div class="availRate" :class="[diff>0 ?'red':'green']"><span>{{diff}}  {{diffRate}}%</span></div></li>
              <li><div class="checkDetail" @click="checkInfoBtn"><span>{{checkCon}}</span></div></li>
            </ul>
          </div>

          <!--当点击搜索框激活状态时，显示出来的内容  start-->
          <div v-show="focusShow" class="focusContent">
            <ul>
              <li>以下为查询记录</li>
              <li v-for="(item, index) of codesList" :key="index">
                <p @click="selTargetCode(item.code,item.title)"><span>{{item.title}}</span><label>{{item.code}}</label></p>
                <i class="icon-add red" v-show="item.choice == 0" @click="addFreeCode(item.code)"></i>
                <i class="icon-remove green" v-show="item.choice == 1" @click="removeFreeCode(item.code)"></i>
              </li>

            </ul>
          </div>
          <!--当点击搜索框激活状态时，显示出来的内容  end-->

          <div v-show="chartShow">
            <!--分时图和k线开始-->
            <div class="wsWrap">
              <ul class="chartTab"><li :class="{active: tabIndex == index}" v-for="(item, index) of tabTitles" :key="index" @click="tabCharts(index,item)">{{item}}</li></ul>
            </div>
            <div class="chart" style="width: 100%">
              <div id="myCharts" ref="myCharts" :style="{width: '100%', height: '250px',maxWidth: '600px'}"></div>
            </div>
            <!--分时图和k线结束-->

            <!--股票数据详情部分-->
            <div class="stockInfo">
              <ul class="">
                <li v-for="(item, index) of todyCodeInfos" :key="index">
                  <div v-for="(cItem, cIndex) of item" :key="cIndex"><span>{{cItem.name}}</span><span> {{cItem.val | keepTwoNum}}</span></div>
                </li>
              </ul>
              <div class="tradeInfo">
                <div class="title"><span>买盘</span><span>卖盘</span></div>
                <div class="list">
                  <ul class="buyList">
                    <li v-for="(item, index) of codeBuyListInfos" :key="index"><p><em>{{index+1}}</em><span>{{item.val1 | keepTwoNum}}</span></p><p>{{item.val2 | keepTwoNum}}</p></li>
                  </ul>
                  <ul class="sellList">
                    <li v-for="(item, index) of codeSellListInfos" :key="index"><p><em>{{index+1}}</em><span>{{item.val1 | keepTwoNum}}</span></p><p>{{item.val2 | keepTwoNum}}</p></li>
                  </ul>
                </div>
              </div>
            </div>
            <!--股票数据详情部分-->
          </div>
          <router-view :latestPrice="dymicPrice"  :parentOjb="{defaultCode,defaultCodeName}" :sellPrice="sellAPrice"></router-view>

        </van-tab>
        <van-tab title="持仓">
          <div v-show="holdListShow">
            <ul class="holdList" >
              <li>
                <span>策略金额</span>
                <span>股票名称</span>
                <span>买入/当前价</span>
                <span>操作</span>
              </li>
              <li v-for="(item, index) of holdListInfos" :key="index">
                <p><span>{{item.transaction_money}}</span><span>止损：{{item.stop_loss}}</span></p>
                <p><span>{{item.title}}</span><span>股数：{{item.amount}}</span></p>
                <p><span>{{item.bs_price}} -> {{item.price_now}}</span><span>盈亏：{{(item.price_now - item.bs_price)*(item.amount) | keepTwoNum}}</span></p>
                <p>
                  <span class="doBtn" @click="pointSell(item.id,item.trade_code,item.title)">点卖</span>
                  <span class="doBtn" @click="zjPromiseMoney(item.id)" v-show="item.is_experience == 0">追加保证金</span>
                </p>
              </li>
            </ul>
            <van-pagination
              v-model="holdPage"
              :total-items="totalPage"
              mode="simple"
              @change="changePage"
            />
          </div>
          <div class="empty" v-show="!holdListShow">暂无交易（最近一个月）</div>
        </van-tab>
        <van-tab title="委托">
          <div v-show="wTListShow">
            <ul class="weiTuoList" >
              <li>
                <span>策略金额</span>
                <span>股票名称</span>
                <span>买入/当前价</span>
                <span>操作</span>
              </li>
              <li v-for="(item, index) of weiTuoListInfos" :key="index">
                <p><span>{{item.transaction_money}}</span><span>止损：{{item.stop_loss}}</span></p>
                <p><span>{{item.title}}</span><span>股数：{{item.amount}}</span></p>
                <p><span>{{item.bs_price}} -> {{item.price_now}}</span><span>盈亏：{{(item.price_now - item.bs_price)*(item.amount) | keepTwoNum}}</span></p>
                <p><span class="doBtn" @click="cancelWT(item.id,item.title)">取消委托</span></p>
              </li>
            </ul>
            <van-pagination
              v-model="weiTuoPage"
              :total-items="wtTotalPage"
              mode="simple"
              @change="wtChangePage"
            />
          </div>
          <div class="empty" v-show="!wTListShow">暂无交易（最近一个月）</div>
        </van-tab>
        <van-tab title="结算">
          <div v-show="settleListShow" class="settleContent">
            <div class="selYearMonth">
              <span>按年月查询</span>
              <select v-model="selYear" @change="selYearVal">
                <option value="" disabled>选择年</option>
                <option :value="item" v-for="(item, index) of years" :key="index">{{item}}年</option>
              </select>
              <select v-model="selMonth" @change="selMonthVal">
                <option value="" disabled>选择月</option>
                <option :value="item" v-for="(item, index) of monthes" :key="index">{{item}}月</option>
              </select>
            </div>
            <ul class="settleList">
              <li>
                <span>卖出时间</span>
                <span>股票名称</span>
                <span>买入/卖出价</span>
                <span>操作</span>
              </li>
              <li v-for="(item, index) of settleListInfos" :key="index">
                <p><span>{{item.sale_time}}</span><span>保证金:{{item.bail_money}}</span></p>
                <p><span>{{item.title}}</span><span>股数：{{item.amount}}</span></p>
                <p><span>{{item.bs_price}} -> {{item.sale_price}}</span><span>交易盈亏：{{item.loss_money | keepTwoNum}}</span></p>
                <p><span class="doBtn" ><router-link :to="{name: 'detailInfo',params:{obj: item}}">查看详情</router-link></span></p>
              </li>
            </ul>
            <van-pagination
              v-model="settlePage"
              :total-items="settleTotalPage"
              mode="simple"
              @change="settleChangePage"
            />
          </div>


          <div v-show="!settleListShow" class="empty">暂无交易（最近一个月）</div>
        </van-tab>
      </van-tabs>


    </div>
</template>

<script>

    var echarts = require('echarts');//引入echarts

    export default {
      name: "index",
      data(){
        return {
          totalPage: 0,//总共条数
          holdListInfos: [],//持仓中的数据列表
          wtTotalPage: 0,//委托订单中的总条数
          weiTuoPage: 1,//委托订单中的当前页
          weiTuoListInfos: [],//委托订单中的数据列表
          settlePage: 1,//结算订单中的当前页
          settleTotalPage: 0,//结算订单中总共条数
          settleListInfos: [],//结算订单中的数据列表
          focusShow: false,//当搜索框触焦时显示出来，失去焦点不显示
          curI: 0,
          tabs: [{name: 'A股点买',i: 0}, {name: '免费体验',i: 1}],
          watchInput: '',
          codesList: [],//模糊搜索出来的数据集合
          chartShow: false,//初始化不显示分时图和k线图
          checkCon: '查看详情',
          defaultCode: '',//用户默认的股票代码
          defaultCodeName: '',//用户默认的股票代码名称
          dymicPrice: '',//最新的推送的价格
          sellAPrice: '', //卖一价格
          diff: '',//股票的涨跌幅
          diffRate: '',//股票的涨跌幅率
          tabTitles: ['分时图','k线图'],
          tabIndex: 0,//分时图和k线图的切换
          todyCodeInfos: '',//今日股票信息集合，最高，最低，振幅等
          pageNumC: 10,//分页中的条数
          holdPage: 1,//持仓中的分页开始数
          holdListShow: false,//持仓列表中是否显示
          wTListShow: false,//委托订单中的是否显示
          settleListShow: false,//结算订单中是否显示
          selYear: '',//结算订单中的选择年份
          selMonth: '',//结算订单中的选择月份
          years: [2016,2017,2018],
          monthes: [1,2,3,4,5,6,7,8,9,10,11,12],

          codeBuyListInfos: [],//股票的买入信息集合,买一，买二等等
          codeSellListInfos: [],//股票的卖出信息集合，卖一，卖二等等

          chart: null,
          timeSharingOption: {//分时图的配置
            type: 'line',
            smooth:true,
            lineStyle:{
              width:1,
              color:'#354162'
            },
            areaStyle: {
              color:'#EEEEEE'
            },
            grid: {
              top: 10,
              bottom: 20,
              left: 10,
              right: 10,
            },
            xAxis: {//k线x轴的配置信息
              data: [],//k线x轴的数据
              scale: true,
              axisLabel: {
                color: '#A0A0A0',
                fontSize: 10,
              },
              axisLine: {
                lineStyle: {
                  color: '#A0A0A0',
                },
              },
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross'
              },
              textStyle:{
                align:'left'
              }
            },
            yAxis : [//k线y轴的配置信息
              {
                scale:true,
                position: 'left',
                axisLabel: {
                  color: '#A0A0A0',
                  fontSize: 10,
                  inside: true,
                },
                axisLine: {
                  lineStyle: {
                    color: '#A0A0A0',
                  },
                },
                splitLine: {
                  lineStyle: {
                    color: '#EEEEEE',
                  },
                },
              }
            ],
            series: [//k线的y轴数据
              {
                type:'line',
                data: [],
              }
            ],
          },
          kLineOption: {//k线配置信息
            type: 'k',
            itemStyle: {
              normal: {
                color: '#D73F43',
                color0: '#2AB180',
                borderColor: '#D73F43',
                borderColor0: '#2AB180',
              },
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross'
              },
              textStyle:{
                align:'left'
              }
            },
            grid: {
              top: 10,
              bottom: 20,
              left: 10,
              right: 10,
            },
            xAxis: //k线x轴的配置信息
            {
              type : 'category',
              data: [],//k线x轴的数据
              axisLabel: {
                color: '#A0A0A0',
                fontSize: 10,
              },
              axisLine: {
                lineStyle: {
                  color: '#A0A0A0',
                },
              },
            },
            yAxis :[ //k线y轴的配置信息
              {
                scale: true,
                position: 'left',
                axisLabel: {
                  color: '#A0A0A0',
                  fontSize: 10,
                  inside: true,
                },
                axisLine: {
                  lineStyle: {
                    color: '#A0A0A0',
                  },
                },
                splitLine: {
                  lineStyle: {
                    color: '#EEEEEE',
                  },
                },
              },
            ],

            series: [//k线的y轴数据
              {
                type:'k',
                data: [],// 开盘，收盘，最低，最高  这是个二维数组
              }
            ],

          }
        }
      },
      created(){
        //页面刚进入时开启长连接
        this.contactWS();//初始化连接ws
      },
      mounted(){
        this.defaultCode = JSON.parse(window.localStorage.getItem('webConfigInfos')).trade_code.value;
        this.defaultCodeName = JSON.parse(window.localStorage.getItem('webConfigInfos')).trade_code.name;
        this.initChart();//初始化echarts
        this.getTimeSharing(JSON.parse(window.localStorage.getItem('webConfigInfos')).trade_code.value);//调用分时图的历史数据
        this.getQuotationNow(JSON.parse(window.localStorage.getItem('webConfigInfos')).trade_code.value);//调用分时图的最新数据接口

        let curPath = this.$route.path.split('/');
        let finaPath = curPath[curPath.length-1];

        if(finaPath == 'oneExperience'){
            this.curI = 1;
        }

        this.$router.push(this.$route.path);//当全局整体刷新时的跳转

        if(JSON.parse(this.$cookie.get('_auth'))){
          this.getHoldSaleList();//初始化调用持仓中的数据接口
          this.getWTHoldSaleList();//初始化调用委托中的数据接口
          this.settleList();//初始化调用结算中的数据接口
        }

        if(!this.selYear){
          this.monthes = [];
        }
      },
      beforeDestroy () {

        //页面销毁时关闭长连接,离开路由之后断开websocket连接
        this.over();

        //组件销毁前先销毁 ECharts 实例
        if (!this.chart) { return }
        this.chart.dispose()
        this.chart = null
      },
      methods: {
        onTabClick(index, title){
            if(this.$cookie.get('_auth')){

            }else if(title != '点买'){
                this.$toast('请先登录');
                setTimeout(() => {
                    this.$router.push('/login');
                },1000)
            }
        },
        selTargetCode(code,title){//从搜索框中选中股票，切换股票代码信息

          this.setTradeCode(code);//调用指定股票ws过来的数据
          this.defaultCode = code;
          this.defaultCodeName = title;

          this.getTimeSharing(code);
          this.getKlineHistory(code);
          this.getQuotationNow(code);

        },
        tabClick(item,index){
          this.curI = index;
          if(item.i == 1){
            this.$router.push('/strategy/oneExperience');
          }else {
            this.$router.push('/strategy/aPointBuy');
          }
        },
        focusEvent(){//搜索框focus 和 blur事件
          this.focusShow = true;
          document.body.style.overflow='hidden';//手机版设置这个。
        },
        blurEvent(){
          this.focusShow = false;
          this.watchInput = '';
          document.body.style.overflow='auto';//手机版设置这个。
        },
        cancelBtn(){
          this.focusShow = false;
          this.watchInput = '';
          document.body.style.overflow='auto';//手机版设置这个。
        },
        checkInfoBtn(){//查看详情按钮
          this.chartShow = this.chartShow? false: true;
          this.checkCon = this.checkCon == '查看详情'? '隐藏详情': '查看详情';
        },
        selectTradeInfo(trade_code){//模糊搜索股票信息
          this.$axios.post('/api/trade/selectTradeInfo',{token: JSON.parse(this.$cookie.get('_auth')),trade_code,})
            .then(res => {
              if(res.data.code == 0){
                if(res.data.data && res.data.data.length != 0){

                  this.codesList = res.data.data;
                }
              }else {
                this.$toast(res.data.msg);
              }
            })
            .catch(err => {
              this.$toast(err);
            })
        },
        tabCharts(index,item){//分时图和k线图的title切换
          this.tabIndex = index;
          this.chart.showLoading();
          if(item == '分时图'){
            this.getTimeSharing(this.defaultCode);//调用分时图的历史数据
          }else {
            this.getKlineHistory(this.defaultCode);//调用k线历史数据接口
          }
        },
        initChart(){
          // 基于准备好的dom，初始化echarts实例
          this.$nextTick(()=>{
            var myChart=document.getElementById('myCharts');
            myChart.style.width=window.innerWidth+'px';

            this.chart = echarts.init(document.getElementById('myCharts'),'light')
            // 把配置和数据放这里
            this.chart.setOption(this.kLineOption)
          })

        },
        contactWS(){//连接ws//初始化weosocket

          var ws = new WebSocket('ws://yjcl.yjcl88.com:8025');

          ws.onopen = this.wsOpen;//连接成功建立的回调方法
          ws.onmessage = this.wsMsg;//接收到消息的回调方法
          ws.onerror = this.wsErr;//连接发生错误的回调方法
          ws.onclose = this.wsClose;//连接关闭的回调方法


          // 路由跳转时结束websocket链接
          // this.$router.afterEach(function () {
          //   ws.close();
          // })

          this.over = () => {
            ws.close()
          }


        },
        wsOpen(){//ws连接成功建立的回调方法
          // this.$toast('WebSocket连接成功');
        },
        wsMsg(e){//ws接收到消息的回调方法
          const redata = JSON.parse(e.data).data;
          //调用注册client_id的接口
          if(redata.client_id){
            this.setClientId(redata.client_id);
          }
          //如果传了对应的代码到setTradCode接口中，这里就会推送过来ws推送的数据  redata就是每秒钟推送的数据
          if(redata.price_now){//如果这个当前价格存在，就说明有推送数据
            console.log(redata)
            this.dymicPrice = Number(redata.price_now).toFixed(2);//推送的最新价格
            this.sellAPrice = Number(redata.bs.s1_price).toFixed(2); //获取卖一价格
            this.diff = Number(redata.diff).toFixed(2);//股票的涨跌幅
            this.diffRate = Number(redata.diff_rate * 100).toFixed(2);//股票的涨跌幅率

            if(this.tabIndex == 0){//分时图
              this.timeSharingOption.xAxis.data.push(redata.update_time);
              this.timeSharingOption.series[0].data.push(+redata.price_now);

              this.chart.setOption(this.timeSharingOption);

            }


            //让今日的数据，振幅数据变成推送的数据

            this.todyCodeInfos = [
              [{name: '今开', val: redata.price_first},{name:'振幅',val: redata.amplitude}],
              [{name:'最高',val: redata.price_high},{name:'最低',val: redata.price_low}],
              [{name:'成交量',val: redata.trade_count},{name:'成交额',val: redata.trade_sum}],
            ];
            //股票的卖一，买一，买二，卖二等信息
            if(Object.keys(redata.bs).length !== 0){

              let bReg = /^b./;
              let sReg = /^s./;
              let sellLists = [];
              let buyLists = [];
              this.codeSellListInfos = [];
              this.codeBuyListInfos = [];
              for(var i in redata.bs){
                // 如果以b开头的就放在
                if(bReg.test(i)){
                  buyLists.push({'name':i, val: redata.bs[i]})

                }else if(sReg.test(i)){

                  sellLists.push({'name':i, val: redata.bs[i]})

                }else {

                }

              }
              for(var i=0; i< buyLists.length;i+=2) {
                this.codeBuyListInfos.push({
                  name1: buyLists[i].name,
                  val1: buyLists[i].val,
                  name2: buyLists[i+1].name,
                  val2: buyLists[i+1].val,
                })
              }
              for(var i = 0;i<sellLists.length;i+=2){
                this.codeSellListInfos.push({
                  name1: sellLists[i].name,
                  val1: sellLists[i].val,
                  name2: sellLists[i+1].name,
                  val2: sellLists[i+1].val,
                })
              }

            }

          }

        },
        wsErr(){//连接发生错误的回调方法
          this.$toast("WebSocket连接发生错误");
        },
        wsClose(){//ws连接关闭的回调方法

          // this.$toast("WebSocket连接关闭");

        },
        setClientId(client_id){//注册clientId的接口
          this.$axios.post('/api/ws/setClientId',{client_id,})
            .then(res => {
              if(res.data.code === 0){

                this.setTradeCode(JSON.parse(window.localStorage.getItem('webConfigInfos')).trade_code.value);//调用指定股票ws过来的数据

              }else {
                this.$toast(res.data.msg);
              }
            })
            .catch(err => {
              this.$toast(err)
            })
        },
        setTradeCode(code){
          this.$axios.post('/api/ws/setTradeCode',{code,})
            .then(res => {
              if(res.data.code === 0){

              }else {
                this.$toast(res.data.msg);
              }
            })
            .catch(err => {
              this.$toast(err)
            })
        },
        getTimeSharing(code){//获取分时图的历史数据
          this.$axios.post('/api/ws/getTimeSharing',{code,})
            .then(res => {
              if(res.data.code === 0){

                this.timeSharingOption.xAxis.data = [];
                this.timeSharingOption.series[0].data = [];
                this.chart.setOption(this.timeSharingOption);
                if(res.data.data.list.length != 0){
                  res.data.data.list.forEach((val, index)=>{

                    this.timeSharingOption.xAxis.data.push((val.update_time));//x轴时间

                    this.timeSharingOption.series[0].data.push(+val.price_now);//y轴数据

                  })
                }
                this.chart.hideLoading();
                this.chart.setOption(this.timeSharingOption)

              }else {
                this.$toast(res.data.msg)
              }
            })
            .catch(err => {
              this.$toast(err);
            })
        },
        getKlineHistory(code){//获取历史k线数据
          this.$axios.post('/api/ws/getKlineHistory',{code,interval:'1d',})
            .then(res => {
              if(res.data.code === 0){

                this.kLineOption.series[0].data = [];

                this.kLineOption.xAxis.data = [];
                this.chart.setOption(this.kLineOption);

                res.data.data.list.forEach((val, index) =>{

                  this.kLineOption.xAxis.data.push(val.time);

                  this.kLineOption.series[0].data.push([+val.open, +val.close, +val.low, +val.high]);

                })

                this.chart.hideLoading();
                this.chart.setOption(this.kLineOption)


              }else {
                this.$toast(res.data.msg)
              }
            })
            .catch(err => {
              this.$toast(err)
            })
        },
        getQuotationNow(code) {//获取最新行情数据
          this.$axios.post('/api/ws/getQuotationNow',{code})
           .then(res => {
             if(res.data.code === 0){
                var totalInfo = res.data.data.data;
                var bsTotalInfo = res.data.data.data.bs;
                if(totalInfo.price_now){

                  this.dymicPrice = Number(totalInfo.price_now).toFixed(2);//推送的最新价格
                  this.sellAPrice = Number(bsTotalInfo.s1_price).toFixed(2); //获取卖一价格
                  this.diff = Number(totalInfo.diff).toFixed(2);//股票的涨跌幅
                  this.diffRate = Number(totalInfo.diff_rate * 100).toFixed(2);//股票的涨跌幅率

                  this.todyCodeInfos = [
                    [{name: '今开', val: totalInfo.price_first},{name:'振幅',val: totalInfo.amplitude}],
                    [{name:'最高',val: totalInfo.price_high},{name:'最低',val: totalInfo.price_low}],
                    [{name:'成交量',val: totalInfo.trade_count},{name:'成交额',val: totalInfo.trade_sum}],
                  ];

                }else {
                  this.dymicPrice = '--';//推送的最新价格
                  this.diff = '--';//股票的涨跌幅
                  this.diffRate = '--';//股票的涨跌幅率
                  this.todyCodeInfos = [
                    [{name: '今开', val: '--'},{name:'振幅',val: '--'}],
                    [{name:'最高',val: '--'},{name:'最低',val: '--'}],
                    [{name:'成交量',val: '--'},{name:'成交额',val: '--'}],
                  ]
                }

                if(bsTotalInfo && Object.keys(bsTotalInfo).length != 0){
                  let bReg = /^b./;
                  let sReg = /^s./;
                  let sellLists = [];
                  let buyLists = [];
                  this.codeSellListInfos = [];
                  this.codeBuyListInfos = [];
                  for(var i in bsTotalInfo){
                    // 如果以b开头的就放在
                    if(bReg.test(i)){
                      buyLists.push({'name':i, val: bsTotalInfo[i]})

                    }else if(sReg.test(i)){

                      sellLists.push({'name':i, val: bsTotalInfo[i]})

                    }else {

                    }

                  }
                  for(var i=0; i< buyLists.length;i+=2) {
                    this.codeBuyListInfos.push({
                      name1: buyLists[i].name,
                      val1: buyLists[i].val,
                      name2: buyLists[i+1].name,
                      val2: buyLists[i+1].val,
                    })
                  }
                  for(var i = 0;i<sellLists.length;i+=2){
                    this.codeSellListInfos.push({
                      name1: sellLists[i].name,
                      val1: sellLists[i].val,
                      name2: sellLists[i+1].name,
                      val2: sellLists[i+1].val,
                    })
                  }
                  // console.log(this.codeBuyListInfos)
                  // console.log(this.codeSellListInfos)

                }else {
                  this.codeBuyListInfos = [
                    {name1: '--',val1: '--',name2: '--',val2:'--'},
                    {name1: '--',val1: '--',name2: '--',val2:'--'},
                    {name1: '--',val1: '--',name2: '--',val2:'--'},
                    {name1: '--',val1: '--',name2: '--',val2:'--'},
                    {name1: '--',val1: '--',name2: '--',val2:'--'},
                  ];
                  this.codeSellListInfos = [
                    {name1: '--',val1: '--',name2: '--',val2:'--'},
                    {name1: '--',val1: '--',name2: '--',val2:'--'},
                    {name1: '--',val1: '--',name2: '--',val2:'--'},
                    {name1: '--',val1: '--',name2: '--',val2:'--'},
                    {name1: '--',val1: '--',name2: '--',val2:'--'},
                  ]
                }

             }else {
               this.$toast(res.data.msg)
             }
           })
           .catch(err => {
             this.$toast(err)
           })
        },
        getHoldSaleList(){
          this.$axios.post('/api/trade/saleList',{token: JSON.parse(this.$cookie.get('_auth')),page: this.holdPage,page_num: this.pageNumC})
            .then(res => {
              if(res.data.code === 0){

                if(res.data.data.trade_list && res.data.data.trade_list.data.length!== 0){
                  this.totalPage = +res.data.data.trade_list.total;

                  this.holdListInfos = res.data.data.trade_list.data;
                  this.holdListShow = true;
                }else  {
                  this.holdListShow = false;
                }

              }else {
                this.$toast(res.data.msg)
              }
            })
            .catch(err => {
              this.$toast(err)
            })
        },
        changePage(v){
          this.holdPage = v;
          this.getHoldSaleList();
        },
        pointSell(itemId,code,title){//当点击点卖按钮时
          this.$dialog.confirm({
            title: '确认点卖',
            message: `<div style="text-align: center">${title}</div>`
          })
            .then(() => {
              // on confirm
              this.sellSaleTrade(itemId,code);
            }).catch(() => {
            // on cancel
            });
        },
        zjPromiseMoney(itemId){//追加保证金


          this.$dialog.confirm({
            title: '确认追加保证金',
            message: `<input type="number" style="width: 100%;border: 1px solid #ddd;padding: .2rem .4rem;border-radius: .2rem" placeholder="请输入追加金额" id="zjMoney"/>`
          })
            .then(() => {
              // on confirm
              let addMoney = document.getElementById('zjMoney').value;

              this.chaseBailMoney(itemId,addMoney);

            }).catch(() => {
              document.getElementById('zjMoney').value = '';
            // on cancel
          });
        },
        sellSaleTrade(itemId,code){//点卖订单接口
          this.$axios.post('/api/trade/saleTrade',{token: JSON.parse(this.$cookie.get('_auth')),id: itemId,trade_code:code})
            .then(res => {
              if(res.data.code === 0){
                this.$toast(res.data.msg);

                this.getHoldSaleList();//调用持仓订单接口

              }else {
                this.$toast(res.data.msg);
              }
            })
            .catch(err => {
              this.$toast(err);
            })
        },
        chaseBailMoney(curId,addMoney){//追加保证金接口
          this.$axios.post('/api/trade/chaseBailMoney',{token: JSON.parse(this.$cookie.get('_auth')),id: curId,money:addMoney})
            .then(res => {
              if(res.data.code === 0){
                this.$toast(res.data.msg);

                this.getHoldSaleList();//调用持仓订单接口
              }else {
                this.$toast(res.data.msg);
              }
            })
            .catch(err => {
              this.$toast(err);
            })
        },
        getWTHoldSaleList(){
          this.$axios.post('/api/trade/saleList',{token: JSON.parse(this.$cookie.get('_auth')),page: this.weiTuoPage,page_num: this.pageNumC,type:1})
            .then(res => {
              if(res.data.code === 0){

                if(res.data.data.trade_list && res.data.data.trade_list.data.length!== 0){
                  this.wtTotalPage = +res.data.data.trade_list.total;

                  this.weiTuoListInfos = res.data.data.trade_list.data;
                  this.wTListShow = true;
                }else  {
                  this.wTListShow = false;
                }

              }else {
                this.$toast(res.data.msg)
              }
            })
            .catch(err => {
              this.$toast(err)
            })
        },
        cancelWT(id,title){//取消委托按钮
          this.$dialog.confirm({
            title: '确认取消委托',
            message: `<div style="text-align: center">${title}</div>`
          })
            .then(() => {
              // on confirm

              this.delTradeOrder(id);
            }).catch(() => {
            // on cancel
          });
        },
        delTradeOrder(id){
          this.$axios.post('/api/trade/delTradeOrder',{token: JSON.parse(this.$cookie.get('_auth')),id,})
            .then(res => {
              if(res.data.code === 0){
                this.$toast( res.data.msg);

                this.getWTHoldSaleList();//调用委托订单接口

              }else {
                this.$toast(res.data.msg)
              }
            })
            .catch(err => {
              this.$toast(err)
            })
        },
        wtChangePage(v){
          this.weiTuoPage = v;
          //先判断一下，点击下一页的时候是否选中年份
          if(this.selYear){
            this.settleYearMonthList(parseFloat(this.selYear),parseFloat(this.selMonth));
          }else {
            this.getWTHoldSaleList();
          }

        },
        settleChangePage(v){
          this.settlePage = v;
          this.settleList();
        },
        settleList(){//结算订单的接口,查询的是全部订单
          this.$axios.post('/api/trade/settleList',{token: JSON.parse(this.$cookie.get('_auth')),page: this.settlePage,page_num:this.pageNumC})
            .then(res => {
              if(res.data.code === 0){
                if(res.data.data.data && res.data.data.data.length != 0){
                  this.settleListShow = true;
                  this.settleListInfos = res.data.data.data;
                  this.settleTotalPage = +res.data.data.total;
                }else {
                  this.settleListShow = false;
                }

              }else {
                this.$toast(res.data.msg);
              }
            })
            .catch(err => {
              this.$toast(err)
            })
        },
        settleYearMonthList(year,month){//选择年月份后调用的筛选结算订单接口
          this.$axios.post('/api/trade/settleList',{token: JSON.parse(this.$cookie.get('_auth')),page: this.settlePage,page_num:this.pageNumC,year,month})
            .then(res => {
              if(res.data.code === 0){
                this.settleListInfos = [];
                this.settleTotalPage = +res.data.data.total;

                if(res.data.data.data && res.data.data.data.length != 0){


                  this.settleListInfos = res.data.data.data;
                  this.settleTotalPage = +res.data.data.total;
                }

              }else {
                this.$toast(res.data.msg);
              }
            })
            .catch(err => {
              this.$toast(err)
            })
        },
        selYearVal(){//当改变年份的时候，默认选中1月份
          this.monthes = [1,2,3,4,5,6,7,8,9,10,11,12],
          this.selMonth = 1;
          this.settleYearMonthList(parseFloat(this.selYear),parseFloat(this.selMonth));
        },
        selMonthVal(){
          this.settleYearMonthList(parseFloat(this.selYear),parseFloat(this.selMonth));
        },
        addFreeCode(code){//添加到自选股票
          this.$axios.post('/api/user/addUserTrade',{token: JSON.parse(this.$cookie.get('_auth')),trade_code:code})
            .then(res => {
              if(res.data.code === 0){
                this.$toast(res.data.msg);
              }else {
                this.$toast(res.data.msg);
              }
            })
            .catch(err => {
              this.$toast(err)
            })
        },
        removeFreeCode(code){//移除自选股票
          this.$axios.post('/api/user/decUserTrade',{token: JSON.parse(this.$cookie.get('_auth')),trade_code:code})
            .then(res => {
              if(res.data.code === 0){
                this.$toast(res.data.msg);
              }else {
                this.$toast(res.data.msg);
              }
            })
            .catch(err => {
              this.$toast(err)
            })
        }
      },
      watch: {
        watchInput(curVal){
          if(curVal){
            this.selectTradeInfo(curVal);//调用模糊查询股票接口
          }else {
            this.codesList = [];
          }
        },
        dymicPrice(){
            if(JSON.parse(this.$cookie.get('_auth'))){
                this.getHoldSaleList();
            }

        },
        // dymicPrice:{
        //   handler: 'getHoldSaleList',
        //   immediate:false
        // }
      },

    }
</script>

<style scoped>
  .head {
    padding: .3rem 0;
    background: #ff5e00;

    color: #fff;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 999;
  }
  .head div.backTop {
    font-size: 1.2rem;
    position: absolute;
    top: .8rem;
    left: 0;
    color: #fff;
    padding-left: .7rem;
  }
  .head div.questionIcon {
    font-size: 1.2rem;
    position: absolute;
    top: .8rem;
    right: 0;
    color: #fff;
    padding-right: .8rem;
  }
  .head  div.tab {
    height: 42px;
    line-height: 42px;
    font-size: .8rem;
    width: 50%;
    border-radius: 5px;
    margin: auto;
  }
  .head .tab span {
    display: inline-block;
    width: 48%;
    height: 30px;
    border: 1px solid #fff;
    line-height: 30px;
  }
  .head .tab span:first-child{
    border-radius: 3px 0 0 3px;
  }
  .head .tab span:last-child {
    border-radius: 0 3px 3px 0;
  }
  .head .tab span.active {
    background: #fff;
    color: #fc5155;
  }
  .searchC {
    width: 100%;
    padding: .4rem .8rem;
    background: #fff;
    margin-bottom: .6rem;
  }
  .searchC > div {
    width: 100%;
    position: relative;
    background: #f1f2f3 url("../../../static/imgs/search-icon@2x.png") no-repeat;
    background-position: .8rem;
    background-size: .8rem .8rem;
    border-radius: 3px;
  }
  .searchC input {
    width: 70%;
    border: none;
    padding: .5rem 0;
    font-size: .8rem;
    height: 100%;
    background: none;

  }
  .searchC a {
    color: #249fed;
    font-size: .8rem;
  }
  .curStock {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .5rem 0;
  }
  .curStock i {
    vertical-align: middle;
    font-size: 1.1rem;
    margin-left: .2rem;
  }
  .curStock .stockName {
    color: #212121;
  }
  .curStock .stockCode {
    font-size: .7rem;
    text-align: left;
    padding-top: .1rem;
  }
  .red {
    color: #ff494b !important;
  }
  .green {
    color: #18b676 !important;
  }
  .curStock .stockLatestPrice {
    font-size: 1.5rem;
    vertical-align: middle;
  }
  .curStock .availRate {
    text-align: left;
    font-size: .7rem;
  }
  .curStock .checkDetail {
    background-color: #ff5e00;
    border-radius: .2rem;
    color: #fff;
    font-size: .8rem;
    padding: .3rem .6rem;
    display: inline-block;
  }

  .wsWrap {
    background: #fff;
    padding: .8rem;
  }
  .wsWrap .chartTab {
    display: flex;
    border: 1px solid #ff5e00;
    border-radius: .2rem;
  }
  .wsWrap .chartTab li {
    width: 50%;
    text-align: center;
    line-height: 1.4rem;
    color: #ff5e00;
    font-size: .7rem;
  }
  .wsWrap .chartTab li.active {
    background-color: #ff5e00;
    color: #fff;
  }
  .stockInfo {
    background: #fff;
    padding: .8rem;
    margin-top: .6rem;
  }
  .stockInfo > ul li{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .stockInfo > ul li > div {
    width: 50%;
    text-align: left;
    font-size: .75rem;
    line-height: 1.5;
  }
  .tradeInfo .title {
    display: flex;
    justify-content: space-between;
    font-size: .8rem;
    color: #212121;
    padding: .3rem 0;
  }
  .tradeInfo .list {
    display: flex;
    justify-content: space-between;
    font-size: .7rem;
  }
  .tradeInfo .list .buyList {
    background: #fff6f6;
    width: 50%;
    padding: .2rem;
  }

  .tradeInfo .list .buyList li{
    display: flex;
    justify-content: space-between;
  }
  .tradeInfo .list .sellList {
    background: #eafcf5;
    width: 50%;
    padding: .2rem;
  }
  .tradeInfo .list .sellList li{
    display: flex;
    justify-content: space-between;
  }
  .tradeInfo .buyList em {
    display: inline-block;
    width: .8rem;
    height: 1rem;
    line-height: 1rem;
    background: #ff494b;
    color: #fff;
    font-size: .55rem;
    margin-right: .4rem;
  }
  .tradeInfo .sellList em {
    display: inline-block;
    width: .8rem;
    height: 1rem;
    line-height: 1rem;
    background: #18b676;
    color: #fff;
    font-size: .55rem;
    margin-right: .4rem;
  }
  p {
    margin: .3rem 0;
  }
  .empty {
    font-size: .9rem;
    padding: 2rem 0;
    color: #adadad;
  }

  .focusContent {
    position: fixed;
    left: 0;
    right: 0;
    top: 9rem;
    height: 80%;
    overflow: auto;
    background-color: rgba(0,0,0,0.7);
    bottom: 0;
    z-index: 2;
  }
  .focusContent ul {
    background-color: #fff;
    border-top: 1px solid #f1f2f3;
    border-bottom: 1px solid #f1f2f3;
    font-size: .8rem;
    color: #212121;
  }
  .focusContent ul li{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f1f2f3;
    height: 3rem;
    padding-left: 1.8rem;
  }
  .focusContent ul li span {
    width: 30%;
    font-size: 1rem;
    margin-right: 1rem;
  }
  .focusContent ul li label {
    width: 30%;
    margin-right: 1rem;
    color: #7a7a7a;
  }
  .focusContent ul li i {
    font-size: 1.1rem;
    padding: 1rem;
  }
  .chart {
    background: #fff;
  }
  #myCharts > div {
    width: 100% !important;
  }
  .holdList, .weiTuoList {
    background: #fff;
    font-size: .9rem;

  }
  .holdList li, .weiTuoList li, .settleList li {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f1f2f3;
    padding: .4rem ;
  }

  .holdList li p, .weiTuoList li p, .settleList li p {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #7a7a7a ;
    width: 25%;
  }
  .holdList li:first-child span, .weiTuoList li:first-child span, .settleList li:first-child span{
    width: 25%;
  }
  .doBtn {
    border: 1px solid #ff5e00;
    padding: .1rem .2rem;
    color: #ff5e00;
    text-align: center;
    margin-bottom: .1rem;
    border-radius: 3px;
  }
  .settleContent {
    background: #fff;
    font-size: .9rem;
  }
  .settleContent .selYearMonth {
    padding: .4rem;
    border-bottom: 1px solid #f1f2f3;
  }
  .settleContent select{
    border: none;
    color: #999;
  }
</style>

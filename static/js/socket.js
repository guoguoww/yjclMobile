import axios from "../../src/axios";

var websock = null;
var serverPort = '8025';	//webSocket连接端口
var curWebInfos = JSON.parse(window.localStorage.getItem('webConfigInfos'));//获取初始化配置数据

// var damicPice = 0;

function $websock(self){
  this.damicPice = 0
  this.initWebSocket = function (){ //初始化weosocket
    let that = this //保存this指向
                          //ws地址
    var wsuri = "ws://yjcl.yjcl88.com:" + serverPort;
    websock = new WebSocket(wsuri);
    websock.onmessage = function(e){
      that.websocketonmessage(e);
    }
    // websock.onclose = function(e){
    //   that.websocketclose(e);
    // }
    websock.onopen = function () {
      that.websocketOpen();
    }
    //连接发生错误的回调方法
    websock.onerror = function () {
      that.websocketError();
    }
  }
  this.setClientId = function(client_id){//注册client_id。请求成功后，才能收到websocket主动推送的数据
    axios.post('/api/ws/setClientId',{client_id:client_id})
      .then(res => {
        if(res.data.code === 0){
          //这里处理ws服务器端推送的数据
          this.setTradeCode(curWebInfos.trade_code.value);//从配置接口中拿去当前用户的股票代码
        }
      })
  }
  this.setTradeCode = function(code){//设置要推送哪只股票的数据接口
    axios.post('/api/ws/setTradeCode',{code:code})
      .then(res => {
        if(res.data.code === 0){
          //这里设置要推送哪支股票的推送数据
        }
      })
  }
  //数据接收
  this.websocketonmessage = function(e){
    const redata = JSON.parse(e.data).data;
    //注意：长连接我们是后台直接1秒推送一条数据，
    //但是点击某个列表时，会发送给后台一个标识，后台根据此标识返回相对应的数据，
    //这个时候数据就只能从一个出口出，所以让后台加了一个键，例如键为1时，是每隔1秒推送的数据，为2时是发送标识后再推送的数据，以作区分
    if(redata.client_id){
      this.setClientId(redata.client_id);//调用注册client_id接口，获取服务器主动推送的数据
    }
    if(redata.price_now){
      this.damicPice = Number(redata.price_now).toFixed(2);//从ws中拿去最新的动态价格
    }
    self.getDamicPice(this.damicPice)
  }
// //关闭
  this.websocketclose = function(e){
    websock.close();
  }

  this.websocketOpen = function(e){
    console.log("连接成功");
  }

  this.websocketError = function(e){
    console.log("WebSocket连接发生错误");
  }

}

export default $websock

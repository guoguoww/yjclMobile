// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant';
import 'vant/lib/vant-css/index.css';

Vue.use(Vant)

import axios from './axios/index.js'
import cookie from "../static/js/cookie";

import socketApi from '../static/js/socket'


import '../static/css/fontSize.css'
import '../static/css/reset.css'
import '../static/css/icomoon.css'

Vue.config.productionTip = false

Vue.prototype.$axios = axios
Vue.prototype.$cookie = cookie
Vue.prototype.$socketApi = socketApi
Vue.prototype.$back = function () {
  router.go(-1)
}

Vue.prototype.resetSetItem = function (key, newVal) { //监听sessionStorage变化 首页加载获取配置用
  if (key === 'webConfigInfos') {
    
    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent');
    const storage = {
      setItem: function (k, val) {
        sessionStorage.setItem(k, val);
        
        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);
        
        // 派发对象
        window.dispatchEvent(newStorageEvent)
      }
    }
    return storage.setItem(key, newVal);
  }
}

Vue.filter('keepTwoNum', val => {//全局的保留两位小数方法

  if(typeof val == "string"){
    return val;
  }else {
    val = Number(val);
    return val.toFixed(2);
  }

})



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

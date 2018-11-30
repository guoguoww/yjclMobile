import axios from 'axios'
import { Toast } from "vant";
import qs from 'qs'
import router from '@/router/index'
import cookie from "../../static/js/cookie";


//自定义实例化一个axios

let instance = axios.create({
  baseURL: process.env.BASEURL,
  timeout: 10 * 1000, //10s超时,
  headers: {
    'Content-Type': 'application/json'//数据的传输方式
  },
  withCredentials: true,

})


// 可以为自定义 axios 实例添加拦截器
// 添加请求拦截器
instance.interceptors.request.use( (config) => {
  // 在发送请求之前做些什么
  const token = encodeURIComponent(cookie.get('_auth'));;
  if(token){
    config.headers.auth = token;
  }

  if(config.method == 'post' && config.headers['Content-Type'] == 'application/x-www-form-urlencoded') {//post请求序列化
    config.data = qs.stringify(config.data);
  }

  return config;
},  (error) => {
  // 对请求错误做些什么
  return Promise.reject(error);
});
// 添加响应拦截器
instance.interceptors.response.use( (response) => {
  // 对响应数据做点什么
  if (response.data.code) {
    Toast(response.data.msg)
  }
  if (response.data.code == 2) {
    cookie.clear()
    router.push('login')
  }
  return response;
},  (error) =>{
  // 对响应错误做点什么

  if(error.response) {
    switch (err.response.status) {
      case 401:
        // 返回 401 清除token信息并跳转到登录页面
        localStorage.removeItem('token');
        router.replace({
          path: 'login',
          query: {redirect: router.history.current.fullPath}
        })
    }

  }

  return Promise.reject(error);
});

export default instance

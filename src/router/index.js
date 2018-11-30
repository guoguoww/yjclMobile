import Vue from 'vue'
import Router from 'vue-router'

import cookie from "../../static/js/cookie";

const login = () => import('@/components/login/login');//登录
const reg = () => import('@/components/login/reg');//注册
const forget = () => import('@/components/login/forget');//忘记密码
const agreement = () => import('@/components/login/agreement');//服务协议

const home = () => import('@/components/home');//首页
const strategy = () => import('@/components/strategy/index');//自选
const oneExperience = () => import('@/components/strategy/oneExperience')//一元体验
const aPointBuy = () => import('@/components/strategy/aPointBuy')//a股点买
const optional = () => import('@/components/optional/index');//策略
const detailInfo = () => import('@/components/strategy/detailInfo');//查看详情
const user = () => import('@/components/user/index');//我的

const moneyRecord = () => import('@/components/user/moneyRecord');// 个人中心=》资金记录
const security = () => import('@/components/user/security/security');// 个人中心=》安全管理
const verified = () => import('@/components/user/security/verified');// 个人中心=》实名认证
const verifiedEdit = () => import('@/components/user/security/verified-edit');// 个人中心=》实名认证-编辑
const modifyPwd = () => import('@/components/user/security/modifyPwd');// 个人中心=》修改密码
const modifyPhone = () => import('@/components/user/security/modifyPhone');// 个人中心=》修改手机号
const cardManage = () => import('@/components/user/backcard/cardManage');// 个人中心=》银行卡管理
const bankcardAdd = () => import('@/components/user/backcard/bankcardAdd');// 个人中心=》银行卡添加/修改

const topUp = () => import('@/components/user/money/topUp');// 充值
const withdrawal = () => import('@/components/user/money/withdrawal');// 提现

const dynamic = () => import('@/components/dynamic/dynamic');// 最新动态列表
const institutions = () => import('@/components/institutions/institutions');// 专业机构列表
const insDetails = () => import('@/components/institutions/insDetails');// 专业机构详情

const help = () => import('@/components/help/index') // 帮助中心
const newGuide = () => import('@/components/help/newGuide') // 新手指引
const about = () => import('@/components/user/about') //关于我们

const wechat = () => import('@/components/wechat/index')//微信页面

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'home',
    component: home
  },
  {
    path: '/strategy',
    name: 'strategy',
    component: strategy,
    children: [
      {
        path: 'aPointBuy',
        name: 'aPointBuy',
        component: aPointBuy,
        meta: {
          showFooter: true,
          // auth: true
        }
      },
      {
        path: 'oneExperience',
        name: 'oneExperience',
        component: oneExperience,
        meta: {
          showFooter: true,
          // auth: true
        }
      },
    ]
  },
  {
    path: '/detailInfo',
    name: 'detailInfo',
    component: detailInfo,
    meta: {
      showFooter: true,
      auth: true
    }
  },
  {
    path: '/optional',
    name: 'optional',
    component: optional,
    meta: {
      auth: true
    },
  },
  { //个人中心
    path: '/user',
    name: 'user',
    component: user,
    meta: {
      auth: true
    }
  },
  { //资金记录
    path: '/moneyRecord',
    name: 'moneyRecord',
    component: moneyRecord,
    meta: {
      showFooter: true,
      auth: true
    }
  },
  { //安全设置
    path: '/security',
    name: 'security',
    component: security,
    meta: {
      showFooter: true,
      auth: true
    }
  },
  { //实名认证
    path: '/verified',
    name: 'verified',
    component: verified,
    meta: {
      showFooter: true,
      auth: true
    }
  },
  { //实名认证-编辑
    path: '/verifiedEdit',
    name: 'verifiedEdit',
    component: verifiedEdit,
    meta: {
      showFooter: true,
      auth: true
    }
  },
  { //修改密码
    path: '/modifyPwd',
    name: 'modifyPwd',
    component: modifyPwd,
    meta: {
      showFooter: true,
      auth: true
    }
  },
  { //修改手机号
    path: '/modifyPhone',
    name: 'modifyPhone',
    component: modifyPhone,
    meta: {
      showFooter: true,
      auth: true
    }
  },
  { //银行卡管理
    path: '/cardManage',
    name: 'cardManage',
    component: cardManage,
    meta: {
      showFooter: true,
      auth: true
    }
  },
  { //银行卡添加/修改
    path: '/bankcardAdd',
    name: 'bankcardAdd',
    component: bankcardAdd,
    meta: {
      showFooter: true,
      auth: true
    }
  },
  { //充值
    path: '/topUp',
    name: 'topUp',
    component: topUp,
    meta: {
      showFooter: true,
      auth: true
    }
  },
  { //提现
    path: '/withdrawal',
    name: 'withdrawal',
    component: withdrawal,
    meta: {
      showFooter: true,
      auth: true
    }
  },
  { //最新动态列表
    path: '/dynamic',
    name: 'dynamic',
    component: dynamic,
    meta: {
      showFooter: true,
    }
  },
  { //专业机构列表
    path: '/institutions',
    name: 'institutions',
    component: institutions,
    meta: {
      showFooter: true,
    }
  },
  { //专业机构详情
    path: '/insDetails',
    name: 'insDetails',
    component: insDetails,
    meta: {
      showFooter: true,
    }
  },
  { //登录
    path: '/login',
    name: 'login',
    component: login,
    meta: {
      showFooter: true,
    }
  },
  { //注册
    path: '/reg',
    name: 'reg',
    component: reg,
    meta: {
      showFooter: true,
    }
  },
  { //注册协议
    path: '/agreement',
    name: 'agreement',
    component: agreement,
    meta: {
      showFooter: true,
    }
  },
  { //忘记密码
    path: '/forget',
    name: 'forget',
    component: forget,
    meta: {
      showFooter: true,
    }
  },
  { //帮助中心
    path: '/help',
    name: 'help',
    component: help,
    meta: {
      showFooter: true,
    }
  },
  { //新手指引
    path: '/newGuide',
    name: 'newGuide',
    component: newGuide,
    meta: {
      showFooter: true,
    }
  },
  { //关于我们
    path: '/about',
    name: 'about',
    component: about,
    meta: {
      showFooter: true,
    }
  },
  {//微信的
    path: '/wechat',
    name: 'wechat',
    component: wechat,
  },
]

const router = new Router({routes,});

router.beforeEach((to, from, next) => {
  var userInfo = cookie.get('_auth') //router.app.$cookie.get('_auth') //JSON.parse(localStorage.getItem('userInfoStorage'));
//
  if (to.meta.auth) { //判断需不需要登录验证

    if (userInfo) { //有没有用户信息
      next()
    } else { //没有跳到登录页
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  } else if (to.name === 'login') { //判断进入的地址是不是登录页
    if (userInfo) { //有没有用户信息 有就返回首页 没有就进
      next()
    } else {
      next()
    }
  } else {
//
    next()
  }
})

export default router



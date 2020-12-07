import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

//解决路由地址重复的报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    component: () => import('../views/home/home.vue')
  },
  {
    path: '/index/overview',
    name: 'Overview',
    component: () => import('../views/node/Overview.vue')
  },
  {
    path: '/index/node', 
    name: 'Node',
    component: () => import('../views/node/Node.vue')
  },
  {
    path: '/index/node2',
    name: 'Node2',
    component: () => import('../views/node/Node2.vue')
  },
  {
    path: '/index/node3',
    name: 'Node3',
    component: () => import('../views/node/Node3.vue')
  },
  {
    path: '/index/node4',
    name: 'Node4',
    component: () => import('../views/node/Node4.vue')
  },
  {
    path: '/index/node5',
    name: 'Node5',
    component: () => import('../views/node/Node5.vue')
  },
  //历史报文
  {
    path: '/index/historyMsg',
    name: 'HistoryMsg',
    component: () => import('../views/collect/HistoryMsg.vue')
  },
  //实时报文
  {
    path: '/index/realTimeMsg',
    name: 'RealTimeMsg',
    component: () => import('../views/collect/RealtimeMsg.vue')
  },
  {
    path: '/index/role',
    name: 'Role',
    component: () => import('../views/authority/Role.vue')
  },
  {
    path: '/index/users',
    name: 'Users',
    component: () => import('../views/authority/Users.vue')
  },
  //日志管理--web服务日志
  {
    path: '/index/webJournal',
    name: 'WebJournal',
    component: () => import('../views/log/WebJournal.vue')
  },
  //日志管理--采集异常日志
  {
    path: '/index/collectJournal',
    name: 'CollectJournal',
    component: () => import('../views/log/CollectJournal.vue')
  },
  //模型管理
  {
    path: '/index/modelManage',
    name: 'ModelManage',
    component: () => import('../views/system/ModelManage.vue')
  },
  //设备管理
  {
    path: '/index/deviceManage',
    name: 'DeviceManage',
    component: () => import('../views/system/DeviceManage.vue')
  },
  //策略管理
  {
    path: '/index/strategyManage',
    name: 'StrategyManage',
    component: () => import('../views/system/StrategyManage.vue')
  },
  //告警监测
  {
    path: '/index/alarmMonitor',
    name: 'AlarmMonitor',
    component: () => import('../views/alarm/AlarmMonitor.vue'),
    props: true
  },
  //画面
  {
    path: '/index/Floor/:id',
    name: 'Floor',
    component: () => import('../views/scene/Floor.vue'),
    props: true
  },
  // 历史曲线
  {
    path: '/index/curve',
    name: 'curve',
    component: () => import('../views/History/curve.vue')
  },
  // 通道统计
  {
    path: '/index/aisle',
    name: 'aisle',
    component: () => import('../views/History/aisle')
  },
  //登录
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/authority/Login.vue')
  },
  {
    path: '/new',
    name: 'New',
    component: () => import('../components/New.vue')
  },
  {
    path: '/404',
    name: 'NotFount',
    component: () => import('../NotFount.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

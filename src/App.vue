<template>
  <div class="all">
    <div id="app" v-show="!(path === '/404' || path === '/login')">
      <a-layout id="components-layout-demo-fixed">
        <a-layout-header
          :style="{ position: 'fixed', zIndex: 1, width: '100%' }"
        >
          <div class="boe" title="前往首页">
            <img
              src="@/assets/app-image/boe.png"
              alt=""
              @click="$router.push('/')"
            />
          </div>
          <div class="logo">
            <div class="b12">重庆京东方B12项目</div>
          </div>
          <a-menu mode="horizontal" @click="handelClickLink">
            <a-sub-menu class="sub1" key="sub1">
              <span slot="title">
                <span>视图</span>
                <a-icon type="caret-down" />
              </span>
              <template v-for="menu in dataMenu">
                <a-menu-item
                  v-if="dataMenu.length > 0"
                  :title="menu.name"
                  :key="'Floor/' + menu.id"
                  @click="goFloor(menu)"
                  >{{ menu.name }}
                </a-menu-item>
              </template>
              <a-sub-menu key="sub111" title="电柜图" class="dianGui">
                <a-menu-item key="7">
                  洁净室1
                </a-menu-item>
              </a-sub-menu>
              <a-sub-menu key="sub4" title="工艺区" class="dianGui">
                <a-menu-item key="10">
                  洁净室1
                </a-menu-item>
              </a-sub-menu>
              <a-menu-item key="overview">系统架构图</a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="sub2">
              <span slot="title">
                <span>详情</span>
                <a-icon type="caret-down" />
              </span>
              <a-menu-item key="aisle">
                设备信息
              </a-menu-item>
              <a-menu-item key="14">
                节点信息
              </a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="sub3">
              <span slot="title">
                <span>管理</span>
                <a-icon type="caret-down" />
              </span>
              <a-menu-item key="modelManage">图模维护</a-menu-item>
              <a-menu-item key="deviceManage">模型管理</a-menu-item>
              <a-sub-menu key="17" title="权限管理" class="dianGui">
                <a-menu-item key="role">角色管理</a-menu-item>
                <a-menu-item key="users">用户管理</a-menu-item>
              </a-sub-menu>
              <a-sub-menu key="18" title="日志管理" class="dianGui">
                <a-menu-item key="webJournal">WEB服务</a-menu-item>
                <a-menu-item key="collectJournal">通讯服务</a-menu-item>
              </a-sub-menu>
              <a-menu-item key="strategyManage">策略管理</a-menu-item>
            </a-sub-menu>
            <a-sub-menu class="sub7" key="sub7">
              <span slot="title">
                <img
                  src="@/assets/image/default_img.jpg"
                  alt
                  class="defaultImg"
                />
              </span>
              <a-menu-item>个人中心</a-menu-item>
              <a-menu-item>修改密码</a-menu-item>
              <a-menu-item @click="signOut()"
                ><a-icon type="logout" />退出</a-menu-item
              >
            </a-sub-menu>
          </a-menu>
        </a-layout-header>
        <div class="alarm" @click="goWarning" title="告警监测">
          <a-badge class="count" :count="count" :overflow-count="999">
            <a-icon class="bell" type="bell" />
          </a-badge>
        </div>
        <a-icon
          v-if="flagScree"
          title="全屏"
          class="win-fullscreen"
          @click="scree"
          type="fullscreen"
        />
        <a-icon
          v-else
          type="fullscreen-exit"
          title="取消全屏"
          class="win-fullscreen"
          @click="scree"
        />
        <div class="timeS">
          {{ timers | dateFormat }}
        </div>
        <img class="mayair" src="@/assets/app-image/mayair-logo.png" alt="" />
        <!-- <div class="tabs"></div> -->
        <a-layout-content :style="{ padding: '0 0', marginTop: '64px' }">
          <a-card :bordered="false">
            <router-view
              class="main"
              ref="alarm"
              v-if="flagId"
              :id_order="id"
              @getLD="getAllCount"
            ></router-view>
          </a-card>
        </a-layout-content>
      </a-layout>
    </div>
    <router-view v-if="path === '/404' || path === '/login'"></router-view>
  </div>
</template>

<script>
import Router from '@/router/router'
import { getMenu } from './services/system'
import { getCount } from './services/all'
import axios from 'axios'
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'
import { serverUrl } from './utils/config'
import { removeToken, getToken } from './utils/auth'
export default {
  name: 'App',
  created() {
    let _this = this
    this.timeClear = setInterval(() => {
      _this.timers = new Date()
    }, 200)
  },
  mounted() {
    this.path = this.$route.path //当前路由
    this.pathSpice = this.$route.name

    if (this.$route.path !== '/login') {
      this.initWebSocket()
    }
    this.$nextTick(() => {
      window.onresize = () => {
        let isFull = !!(
          document.webkitIsFullScreen ||
          document.mozFullScreen ||
          document.msFullscreenElement ||
          document.fullscreenElement
        ) //!document.webkitIsFullScreen都为true。因此用!!
        // console.log(isFull)
        if (isFull === false) {
          this.flagScree = true
        }
      }
    })
  },
  watch: {
    $route(to, from) {
      this.path = to.path //打开的新的页面路由
      let n = this.nameOld.indexOf(to.name)
      if (to.path !== '/login') {
        this.getAllCount()
        this.Floor()
        return
      }
      if (n !== -1) {
        this.nameOld.splice(n, 1)
        this.nameOld.push(this.$route.name)
      } else {
        this.nameOld.push(this.$route.name)
      }
      // window.clearTimeout(this.timeClear)
    },
    id(soul) {
      this.flagId = false
      this.$nextTick(() => {
        this.flagId = true
      })
    }
  },
  data() {
    return {
      path: '',
      collapsed: false,
      dataMenu: [],
      count: 0,
      id: null,
      flagId: true,
      wsUrl: serverUrl.wsUrl,
      pathSpice: null,
      nameOld: [],
      timers: new Date(),
      timeClear: null,
      flagScree: true
    }
  },

  methods: {
    // 退出登录
    goOld() {
      this.$router.go(-1)
    },
    signOut() {
      removeToken()
      this.$router.push('/login')
    },
    preventDefault(e) {
      // console.log(e)
      // e.preventDefault()
      if (this.nameOld.indexOf(e) !== -1) {
        // this.nameOld.splice(n, 1)
        const r = this.nameOld.filter((r, i) => {
          return this.nameOld.indexOf(e) !== i
        })
        this.nameOld = r
        console.log(this.nameOld)
      } else {
        console.log('none')
      }
    },
    handelClickLink(item) {
      this.$router.push('/index/' + item.key)
    },
    /* 调用示例 */
    // 窗口全屏
    scree() {
      if (this.flagScree) {
        fullScreen()
        this.flagScree = false
      } else {
        exitFullscreen()
        this.flagScree = true
      }
    },
    async Floor() {
      const res = await getMenu()
      this.dataMenu = res.data
    },
    // 获取铃铛总数
    async getAllCount() {
      // 显示小铃铛总数
      await getCount()
        .then(res => {
          this.count = res.data
        })
        .catch(err => {
          // this.$message.info(err)
          console.log(err)
        })
    },
    // 点击铃铛跳转到告警页面
    goWarning() {
      this.$router.push({ name: 'AlarmMonitor', params: { Two: 2 } })
    },
    initWebSocket() {
      this.connection()
      // 需要有一个失败重连得到问题
    },
    connection() {
      var that = this
      //  new WebSocket("ws://" + url+ "/webSocketServer",[token]);
      const socket = new WebSocket(this.wsUrl, [getToken()])
      this.stompClient = Stomp.over(socket)
      //建立连接，订阅主题
      try {
        this.stompClient.connect({ Authorization: getToken() }, frame => {
          this.stompClient.subscribe('alarm', res => {
            res.body = JSON.parse(res.body)
            if (res.body.status === 0) {
              res.body.status = ['正在解析']
            } else if (res.body.status === 1) {
              res.body.status = ['解析成功']
            } else if (res.body.status === 2) {
              res.body.status = ['解析失败']
            }
            this.data.push(res.body)
            res.body.actingTime = this.filter(res.body.actingTime)
            this.$notification.open({
              message: res.body.action,
              description: `
            告警对象：${res.body.alarmObject + ' '};
            告警类型：${res.body.alarmType + ' '};
            告警内容：${res.body.alarmValue || '无内容' + ' '};
            告警时间：${res.body.actingTime}
            `,
              placement: 'bottomRight'
            })
            this.getAllCount()
            if (this.$route.path === '/index/alarmMonitor') {
              this.$refs.alarm.getNewList()
            }
          })
        })
        this.getAllCount()
      } catch (error) {
        console.log(error)
      }
    },

    filter(time) {
      var d = new Date(time)
      var year = d.getFullYear()
      var month = d.getMonth() + 1
      var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate()
      var hour = d.getHours()
      var minutes = d.getMinutes()
      var seconds = d.getSeconds()
      return (
        year +
        '年' +
        month +
        '月' +
        day +
        '日' +
        hour +
        '点' +
        minutes +
        '分' +
        seconds +
        '秒'
      )
    },
    goFloor(menu) {
      console.log(menu)
      this.id = menu.id
    }
  }
}
/* 封装 */
// 全屏
function fullScreen() {
  let element = document.documentElement
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen()
  }
}
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  }
}
</script>

<style lang="less">
body {
  font-size: 20px !important;
}

#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.con {
  min-height: 600px;
  margin: 24px 16px;
  padding: 24px;
  background: #fff;
}
.boe {
  // display: inline-block;
  float: left;
  margin-right: 20px;
  img {
    cursor: pointer;
  }
}
#components-layout-demo-fixed .logo {
  width: 180px;
  height: 30px;
  // background: rgba(255, 255, 255, 0.2);
  margin: 16px 24px 16px 0;
  float: left;
  text-align: center;
  line-height: 31px;
  color: #fff;
  font-size: 18px;
  font-weight: normal;
  border-left: 2px solid #fff;
  padding-left: 20px;
  img {
    width: 65px;
    height: 30px;
  }
  .b12 {
    font-size: 18px;
  }
}

#components-layout-demo-side h2 {
  color: #fff;
  line-height: 52px;
  font-size: 20px;
  display: flex;
  justify-content: center;
}
.ant-layout-content {
  height: 654px;
  margin-top: 38px !important;
  background-color: #fff !important;
}
.ant-layout-header {
  padding: 0 10px !important;
  font-weight: 700;
  color: #fff !important;
  height: 59px !important;
  background-color: #2e87f4 !important;
  z-index: 9999;
}
.sub1 {
  margin-left: 270px;
}
.ant-menu-horizontal {
  font-weight: 700;
  line-height: 60px !important;
  height: 58px;
  background-color: #2e87f4 !important;
}

.ant-menu {
  border-bottom: 0px !important;
  color: #fff !important;
}
.ant-menu-vertical.ant-menu-sub {
  min-width: 80px !important;
}
.ant-menu-submenu {
  text-align: center;
  width: 120px;
  .ant-menu-item {
    width: 100%;
    color: #070e23 !important;
  }
}
.dianGui {
  color: #070e23 !important;
}
// 选中后的菜单字体
.ant-menu-submenu-selected {
  color: #070e23 !important;
}
.ant-menu-submenu,
.ant-menu-submenu:hover {
  border-bottom: none !important;
  // color: aquamarine;
}
.ant-menu-submenu-active {
  color: #070e23 !important;
}
.ant-menu-submenu-title:hover {
  color: #070e23 !important;
}
.ant-card-body {
  padding: 0 !important;
}
.ant-card {
  margin-top: 20px !important;
}
.sign {
  display: inline-block;
  position: absolute;
  right: 25px;
}

.defaultImg {
  width: 30px;
  margin: 0 7px;
  border-radius: 50%;
}

.win-fullscreen {
  position: fixed;
  right: 425px;
  top: 15px;
  font-size: 30px;
  width: 36px;
  color: #fff !important;
  z-index: 999;
  height: 36px;
}

.alarm {
  // display: inline-block;
  position: fixed;
  right: 560px;
  top: 20px;
  z-index: 999;
  color: #fff;
  /deep/ .ant-scroll-number {
    width: 23px;
    height: 15px;
    font-size: 11px;
    text-align: center;
    line-height: 15px;
    padding-left: 2px;
  }
}
.bell {
  width: 50px;
  height: 50px;
  svg {
    width: 30px;
    height: 30px;
  }
}
.count > sup {
  height: 20px;
}
.sub7 {
  position: absolute !important;
  right: 455px !important;
}

.tabs {
  height: 60px;
  // background-color: hotpink;
}
.old {
  cursor: pointer;
  display: inline-block;
  color: #2e87f4;
}
.timeS {
  color: #fff;
  font-size: 24px;
  z-index: 999;
  position: fixed;
  right: 175px;
  top: 10px;
}
.mayair {
  z-index: 999;
  position: fixed;
  right: 0;
  top: 10px;
}
</style>

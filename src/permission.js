import router from '../src/router/router'
import { isLogined } from '../src/utils/auth'
router.beforeEach((to, from, next) => {
  if (isLogined()) {
    // 判断是否登录
    if (to.path === '/login') {
      //
      //登录状态下 访问login.vue页面 会跳到index.vue
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    // 如果没有session ,访问任何页面。都会进入到 登录页
    if (to.path === '/login') {
      // 如果是登录页面的话，直接next() -->解决注销后的循环执行bug
      next()
    } else {
      // 否则 跳转到登录页面
      next({ path: '/login' })
    }
  }
})

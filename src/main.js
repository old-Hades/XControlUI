import Vue from 'vue'
import Antd from 'ant-design-vue'
import echarts from 'echarts'
import App from './App.vue'
import router from './router/router'
import './permission'
import 'ant-design-vue/dist/antd.css'
import VueKonva from 'vue-konva'

//富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueKonva)

Vue.use(VueQuillEditor)
Vue.filter('dateFormat', function(originVal, fmt) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  if (fmt === 'yyyy-MM-dd') {
    return `${y}-${m}-${d}`
  }

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

Vue.use(Antd)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

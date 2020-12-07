import axios from 'axios'
import { getToken, removeToken } from './auth'
import { serverUrl } from './config'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import { message } from 'ant-design-vue'
import router from '../router/router'
const instance = axios.create({
  baseURL: serverUrl.baseUrl,
  timeout: 5000
})

// Add a request interceptor
instance.interceptors.request.use(
  function(config) {
    Nprogress.start()
    // Do something before request is sent
    config.headers.Authorization = getToken()
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
instance.interceptors.response.use(
  response => {
    if (Object.prototype.toString.call(response.data) === '[object String]') {
      var s = window.location.href
      var name = s.substring(s.lastIndexOf('/') + 1)
      if (name !== 'login') {
        message.error('未获取到当前页面信息，请重试')
      }
      // removeToken()
    }
    if (response.data && response.data.code) {
      if (parseInt(response.data.code) === 401) {
        //登录过时或者密码已经修改
        removeToken()
        console.log(response)
        message.error('登录信息已失效，请重新登录')
      }
      if (parseInt(response.data.code) === 403) {
        message.error('权限不足')
      }
      if (parseInt(response.data.code) === 500) {
        removeToken()
        message.error('登录失败')
        // router.push('/404')
      }
    }
    Nprogress.done()
    return response.data
  },
  function(error) {
    // Do something with response error
    console.log(error)
    console.dir(error)
    // if (condition) {
    //   message.error('服务器连接失败')
    // }
    return Promise.reject(error)
  }
)

export function get(url, params) {
  return instance.get(url, {
    params // 表示url中传递的参数 params: params
  })
}

export function post(url, data) {
  return instance.post(url, data)
}

export function put(url, data) {
  return instance.put(url, data)
}

export function del(url, data) {
  return instance.delete(url, data)
}

export function downLoad(url, params) {
  return instance.get(url, {
    headers: {
      Accept: 'application/octet-stream'
    },
    responseType: 'blob'
  })
}
export default instance

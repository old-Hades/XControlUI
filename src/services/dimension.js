import { get, put } from '../utils/request'

//告警模块
/**
 * 获取告警数据
 * @param {*} data
 */

export function getCount(data) {
  return get('/alarm/queryUnAckAlarmCount', data)
}
export function getFFU(id) {
  return get(`/deviceDetail/ebmFFU/${id}`)
}
export function putFFUSpeed(data) {
  return put(`/deviceCommand/control`, data)
}

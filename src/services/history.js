import { get, put } from '../utils/request'

//告警模块
/**
 * @param {*} data
 */
export function getActualSpeed(data) {
  return get('/his/actualSpeed', data)
}
// /his/ebmFfuPower
export function getEbmFfuPower(data) {
  return get('/his/ebmFfuPower', data)
}

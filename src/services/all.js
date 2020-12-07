import { get } from '../utils/request'

//告警模块
/**
 * 获取告警数据
 * @param {*} data
 */

export function getCount(data) {
  return get('/alarm/queryUnAckAlarmCount', data)
}

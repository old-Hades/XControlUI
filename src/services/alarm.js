import { get, put } from '../utils/request'

//告警模块
/**
 * 获取告警数据
 * @param {*} data
 */
export function getAlarmData(data) {
  return get('/alarm/findData', data)
}

/**
 * 查询告警小铃铛数目
 */
export function getUnackAlarmCount() {
  return get('/alarm/queryUnAckAlarmCount')
}

/**
 * 确认单条告警
 * @param data
 */
export function confirmOne(data) {
  return put('/alarm/confirmOne', data)
}

/**
 * 确认全部告警
 */
export function confirmAll() {
  return put('/alarm/confirmAll')
}

export function getAlarmTable() {
  return get('/alarm/latestUnAckAlarm')
}

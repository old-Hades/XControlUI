import { get, post, del, put, downLoad } from '../utils/request'

/**
 * 查询树状结构
 */
export function getDeviceTree() {
  return get('systemConfig/deviceManage/deviceTree')
}

/**
 * 获取单个区域详情
 * @param cleanZoneID 区域ID
 */
export function getCleanZoneDetail(cleanZoneID) {
  return get('systemConfig/deviceManage/cleanZone/' + cleanZoneID)
}

/**
 * 获取单个风机组
 * @param groupID 组ID
 */
export function getFFUGroup(groupID) {
  return get('systemConfig/deviceManage/ffuGroup/' + groupID)
}

/**
 * 获取单个风机组详情（包括实时）
 * @param groupID 组ID
 */
export function getFFUGroupDetail(groupID) {
  return get('systemConfig/deviceManage/ffuGroupDetail/' + groupID)
}

/**
 * 获取风机组下的风机详情
 * @param groupID 组ID
 */
export function getFanDetail(groupID) {
  return get('systemConfig/deviceManage/' + groupID + '/ffuEbmDevice')
}

/**
 * 导出excel
 */
export function exportData() {
  return downLoad('systemConfig/deviceManage/exportData')
}

/**
 * 获取所有组内风机
 */
export function simpleFFUDevice(data) {
  return get('/systemConfig/deviceManage/simpleFFUDevice', data)
}

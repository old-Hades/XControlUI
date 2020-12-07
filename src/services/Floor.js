import { get, post, del, put } from '../utils/request'

export function cleanRoomDetail(data) {
  return get(`systemConfig/modelManage/cleanRoomDetail/` + data)
}
export function getFFU(data) {
  return get(`xcontrol/cad/${data}/getFFU/`)
}
export function getDataMysql(data) {
  return get(
    `xcontrol/cad/${data.roomName}/getDataMysql?isWorkSpace=${data.isWorkSpace}`
  )
}
export function getColor() {
  return get(`/systemConfig/strategyManage/color`)
}
export function getFFUTotal() {
  return get(`/xcontrol/operatingStatus/ffu`)
}
export function lazyDeviceTree(data) {
  return get(
    '/systemConfig/deviceManage/lazyDeviceTree?pid=' +
      data.pid +
      '&dynamic=' +
      data.dynamic
  )
}

import { get, post, del, put } from '../utils/request'

export function getChannel() {
  return get('/xcontrol/operatingStatus/channel')
}
export function getFFU() {
  return get('/xcontrol/operatingStatus/ffu')
}
export function getCleanRoom() {
  return get('/xcontrol/operatingStatus/cleanRoom')
}

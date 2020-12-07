import { get, post, del, put } from "../utils/request";

// 查询磁盘信息

/**
 * 查询磁盘动态信息
 * @param {*} nodename
 *
 */
export function getDesks(nodename) {
  return get("/xcontrol/system/desk/dynamic/" + nodename);
}

/**
 * 查询磁盘静态信息
 * @param {*} nodename
 */
export function getSDesks(nodename) {
  return get("/xcontrol/system/desk/static/" + nodename);
}

//内存信息查询

/**
 * 查询内存动态信息
 * @param {*} nodename
 *
 */
export function getMemory(nodename) {
  return get("/xcontrol/system/memory/dynamic/" + nodename);
}

/**
 * 查询内存静态信息
 * @param {*} nodename
 */
export function getSMemory(nodename) {
  return get("/xcontrol/system/memory/static/" + nodename);
}

//网络信息查询

/**
 * 查询主干网动态信息
 * @param {*} nodename
 *
 */
export function getBackbone(nodename) {
  return get("/xcontrol/system/network/backbone/dynamic/" + nodename);
}

/**
 * 查询主干网静态信息
 * @param {*} nodename
 */
export function getSBackbone(nodename) {
  return get("/xcontrol/system/network/backbone/static/" + nodename);
}

/**
 * 查询采集网动态信息
 * @param {*} nodename
 *
 */
export function getCollect(nodename) {
  return get("/xcontrol/system/network/collect/dynamic/" + nodename);
}

/**
 * 查询采集网静态信息
 * @param {*} nodename
 */
export function getSCollect(nodename) {
  return get("/xcontrol/system/network/collect/static/" + nodename);
}

//CPU信息查询

/**
 * 查询CPU动态信息
 * @param {*} nodename
 *
 */
export function getCpu(nodename) {
  return get("/xcontrol/system/cpu/dynamic/" + nodename);
}

/**
 * 查询CPU静态信息
 * @param {*} nodename
 */
export function getSCpu(nodename) {
  return get("/xcontrol/system/cpu/static/" + nodename);
}

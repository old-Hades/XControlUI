import { get, post, del, put } from "../utils/request";

//模型管理
/**
 * 查询洁净室   参数 start limit condition
 * 如 。。。。/cleanRoom?start=1&limit=5&condition=1
 */
export function getRoom(params) {
  return get("/systemConfig/modelManage/cleanRoom", params);
}

/**
 * 根据id删除洁净室   roomId
 * @param {*} id
 */
export function delRoom(data) {
  return del("/systemConfig/modelManage/cleanRoom/" + data);
}

/**
 * CAD模型导入  dxf格式
 * @param {*} file
 */
export function create(file) {
  return post("/systemConfig/modelManage/cadModelImport", file);
}

/**
 * 更新洁净室
 * @param {*}
 */
export function upclean(data) {
  return put("/systemConfig/modelManage/cleanRoom", data);
}






//策略管理
/**
 * 查询规约
 * @param {*}
 */
export function getProtocol() {
  return get("/systemConfig/strategyManage/protocol");
}

/**
 * 查询采集策略  参数 start limit condition
 * @param {*} params
 * 如。。。。/strategyManage/strategy?start=1&limit=5&condition=0
 */
export function getStrategy(params) {
  return get("/systemConfig/strategyManage/strategy", params);
}

/**
 * 查询颜色配置策略  参数 无
 */
export function getColorStrategy() {
  return get("/systemConfig/strategyManage/color");
}


/**
 * 更新采集策略
 *
 * {
  "interval": 0,
  "status": false,
  "strategyId": "string"
    }
 * @param data
 */
export function update(data) {
  return put("/systemConfig/strategyManage/strategy", data);
}


/**
 * 更新颜色策略
 * @param data
 */
export function updateColorStrategy(data) {
  return put("/systemConfig/strategyManage/color", data);
}

/**
 * 新增颜色策略
 * @param data
 */
export function addColorStrategy(data) {
  return post("/systemConfig/strategyManage/color", data);
}

/**
 * 删除颜色策略
 * @param data
 */
export function delColorStrategy(data) {
  return del("/systemConfig/strategyManage/color/"+data);
}



//系统配置初始化
/**
 * 初始画面菜单
 */
export function getMenu() {
  return get("/systemConfig/init/sceneMenu");
}






//设备管理
/***
 * 获取单个区域信息
 *  @param {*} zoneId
 */
export function getZone(zoneId) {
  return get("/systemConfig/deviceManage/cleanZone/" + zoneId);
}

/**
 * 获取设备树
 */
export function getTree() {
  return get("/systemConfig/deviceManage/deviceTree");
}

/***
 * 获取单个风机组信息
 *  @param {*} groupId
 */
export function getffu(groupId) {
  return get("/systemConfig/deviceManage/ffuGroup/" + groupId);
}

/***
 * 获取单个风机组下的全部风机信息
 *  @param {*} groupId
 */
export function getffuEbm(groupId) {
  return get(
    "/systemConfig/deviceManage/ffuGroup/" + groupId + "/ffuEbmDevice"
  );
}

/**
 * 修改单个区域信息
 * @param {*}
 * {
  "aliasName": "string",
  "cleanRoomId": 0,
  "id": 0,
  "insertTime": "2020-08-28T07:46:10.929Z",
  "name": "string",
  "serialDeviceServerIp": "string",
  "serialDeviceServerName": "string",
  "serialDeviceServerStartPort": 0,
  "updateTime": "2020-08-28T07:46:10.929Z"
}
 */
export function upZone(data) {
  return put("/systemConfig/deviceManage/cleanZone", data);
}

/**
 * 修改单个风机组信息
 * @param {*}
 * {
  "aliasName": "string",
  "cleanZoneId": 0,
  "id": 0,
  "insertTime": "2020-08-28T07:46:10.938Z",
  "name": "string",
  "protocol": 0,
  "serialDeviceServerPortIndex": 0,
  "updateTime": "2020-08-28T07:46:10.938Z"
}
 */
export function upffu(data) {
  return put("/systemConfig/deviceManage/ffuGroup", data);
}

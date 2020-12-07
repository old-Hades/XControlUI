import {get, post, put, del} from "../utils/request";

/**
 * 获取历史报文
 * @param {*} param
 */
export function getHisDeviceMsg(param) {
    return get("/his/hisDeviceMsg", param);
}

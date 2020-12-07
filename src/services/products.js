import { get, post, del, put } from "../utils/request";

/**
 * 查询所有用户
 */
export function getList() {
  return get("/xcontrol/authority/user/findAll")
}

/**
 * 根据名称查询用户
 * @param {*} username
 */
export function getOne(username) {
  return get("/xcontrol/authority/user/findByName/" + username);
}

/**
 * 根据id查询用户角色
 * @param {*} id
 */
export function updateOne(id) {
  return get("/xcontrol/authority/user/findUserRole/" + userId);
}

/**
 * 根据id删除数据
 * @param {*} id
 */
export function delOne(data) {
  return del("/xcontrol/authority/user/delete/" , data);
}

/**
 * 新增用户
 * @param {*} data
 */
export function create(data) {
  return post("/xcontrol/authority/user/insert", data);
}

/**
 * 更新用户
 * @param {*} 
 */
export function update(data) {
  return put("/xcontrol/authority/user/update", data);
}

/**
 * 更新用户角色
 * @param {*} 
 */
export function updateRole(data) {
  return put("/xcontrol/authority/user/update", data);
}


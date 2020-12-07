import { get, post, del, put } from '../utils/request'
/**
 * 查询所有用户
 */
export function getUser(data) {
  return get('/xcontrol/authority/user/findAll/' + data)
}
// 根据名称查询用户
export function getSearchUser(data) {
  return get('/xcontrol/authority/user/findByName/' + data)
}
// 添加用户
export function addUser(data) {
  return post('/xcontrol/authority/user/insert', data)
}
// 删除用户
export function deleteUser(data) {
  return post('/xcontrol/authority/user/delete', data)
}
// 更新用户
export function editUser(data) {
  return put('/xcontrol/authority/user/update', data)
}
// 查询用户角色
export function UserRoles(data) {
  return get('/xcontrol/authority/user/findUserRole/' + data)
}
// 更新用户角色
export function uploadUserRoles(data) {
  return put('/xcontrol/authority/user/updateUserRole', data)
}

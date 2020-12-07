import { get, post, del, put } from '../utils/request'
/**
 * 查询所有角色
 */
export function getRoles(data) {
  return get('/xcontrol/authority/role/findAll/' + data)
}
// 根据名称查询角色
export function getSearchRoles(data) {
  return get('/xcontrol/authority/role/findByName/' + data)
}
// 添加角色
export function addRoles(data) {
  return post('/xcontrol/authority/role/insert', data)
}
// 删除角色
export function deleteRoles(data) {
  return post('/xcontrol/authority/role/delete', data)
}
// 更新角色
export function editRoles(data) {
  return put('/xcontrol/authority/role/update', data)
}
// 查询角色对应菜单


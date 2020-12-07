import { post } from "../utils/request";

/**
 * 管理后台用户登录
 * @param {*} user
 */
export function login(user) {
  return post("/api/v1/auth/manager_login", user);
}

/*
 * @Date: 2023-08-15 10:57:10
 * @LastEditTime: 2025-01-14 00:42:51
 * @Author: CLX
 * @LastEditors: CLX
 * @Description: 公共校验函数
 */

/**
 * 判断是否为JSON字符串
 * @returns
 */
export function isJSONString(val: unknown): boolean {
  try {
    JSON.parse(val as string)
    return true
  } catch (error) {
    return false
  }
}

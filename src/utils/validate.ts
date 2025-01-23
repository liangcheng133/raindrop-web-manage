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

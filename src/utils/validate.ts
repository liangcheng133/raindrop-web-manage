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

/**
 * 判断是否为Promise函数
 * @returns
 */
export function isPromise(val: any): val is Promise<any> {
  return val && typeof val.then === 'function'
}

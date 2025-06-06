import { AxiosError } from 'axios'
import z from 'zod'
import { ResError } from './ResError'

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

/**
 * 判断是否为Zod的异常抛出
 * @returns
 */
export function isZodError(val: any): val is z.ZodError {
  return val && val instanceof z.ZodError
}

/**
 * 判断是否为接口的异常抛出
 * * 当接口请求状态200，但返回的JSON数据中，status不为0时，则判定为接口异常
 * @returns
 */
export function isResError(val: any): val is ResError {
  return val && val instanceof ResError
}

/**
 * 判断是否为接口的异常抛出
 * * 当接口请求状态不为200时，则判定为接口异常
 * @returns
 */
export function isAxiosError(val: any): val is AxiosError {
  return val && val instanceof AxiosError
}

import { HandleErrorConfigType, SendErrorToServerConfigType } from '@/types/type'
import { traceError } from '@web-tracing/core'
import { isError, isNil, isPlainObject } from 'es-toolkit'
import { isObject } from 'es-toolkit/compat'
import { antdUtil } from './antdUtil'
import { isAxiosError } from './validate'

/**
 * 将对象拼接到URL的查询字符串中
 * @param {String} url 基础URL
 * @param {Object} params 查询参数对象，属性值为空时不拼接
 * @returns 拼接后的完整URL
 */
export function appendQueryParams(url: string, params?: { [key: string]: string | number }) {
  if (!params || !isObject(params)) {
    return url
  }

  const queryString = Object.keys(params)
    .map((key) => {
      const value = params[key]
      if (value === null || value === undefined) {
        return ''
      }
      return `${key}=${value}`
    })
    .filter(Boolean)
    .join('&')

  if (queryString) {
    return `${url}${url.includes('?') ? '&' : '?'}${queryString}`
  }

  return url
}

/**
 * 列表转树形
 * @param list 数据源
 * @param idField id字段
 * @param parentIdField parentId字段
 * @param topId 定点的id值
 * @param parentIds 父级id组
 * @returns
 */
export function listToTree<T extends { [key: string]: any }>(
  list: T[],
  idField?: string,
  parentIdField?: string,
  topId?: string,
  parentIds: string[] = []
): T[] {
  if (isNil(list) || list.length === 0) return []

  const pIdField = idField || 'id'
  const pParentIdField = parentIdField || 'parent_id'
  const topIdValue = topId ?? '0'

  // 构建映射表以提高查找效率
  const idMap = new Map<string, T>()
  list.forEach((item) => {
    if (!item[pIdField] || !item[pParentIdField]) {
      console.warn('Item missing required fields:', item)
      return
    }
    idMap.set(item[pIdField], item)
  })

  const data: T[] = []
  list.forEach((item) => {
    if (item[pParentIdField] === topIdValue) {
      const idArr = [...parentIds, item[pIdField]]
      const children = listToTree(Array.from(idMap.values()), pIdField, pParentIdField, item[pIdField], idArr)
      data.push({
        ...item,
        ...(children.length > 0 ? { children } : {})
      })
    }
  })

  return data
}

/**
 * 对象过滤空值
 * @param obj 需要过滤的obj
 * @returns
 */
export function objRemoveEmpty(obj: any) {
  for (const key in obj) {
    if (isNil(obj[key])) {
      delete obj[key]
    }
  }
  return obj
}

/**
 * 同步 模拟等待
 * @param ms 等待毫秒数
 */
export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * 根据键名或键名正则表达式获取对象中的值
 * @param obj 要查询的对象
 * @param key 键名字符串，可以是多级键名，用点号分隔
 * @param keyRegexp 可选的正则表达式，用于分割键名字符串，默认是点号
 * @returns 返回对象中与键名对应的值，如果找不到则返回空字符串
 */
export function getObjectValue(obj: any, key: string, keyRegexp?: RegExp) {
  if (obj && key) {
    const keys = key.split(`${keyRegexp || '.'}`)
    let value = obj
    for (let i = 0; i < keys.length; i++) {
      if (value && isPlainObject(value)) {
        value = value[keys[i]]
      }
    }
    return value
  }
  return ''
}

/**
 * 处理错误
 * 该函数根据错误类型将错误信息发送到不同的处理渠道
 * @param error 任意类型的错误对象，是函数处理的主要对象
 * @param config 可选的错误处理配置对象，用于定制错误处理行为
 */
export function handleError(error: any, config?: HandleErrorConfigType) {
  if (!error || !isError(error)) return
  if (!isAxiosError(error)) {
    console.log('非接口异常，由handleError处理')
    sendErrorToServer(error, config)
  }
}

/**
 * 将错误信息发送到服务器
 *
 * 此函数用于将捕获到的错误信息手动发送到服务器，并根据配置显示错误消息
 * 它主要在应用程序中捕获到未处理的异常时使用，以便开发者能够得到错误的详细信息，
 * 并根据这些信息进行调试和修复
 *
 * @param error 发生的错误对象，应包含错误消息和错误堆栈
 * @param config 可选的配置对象，包含是否显示错误消息、是否将错误发送到服务器以及自定义错误消息
 */
export function sendErrorToServer(error: any, config?: SendErrorToServerConfigType) {
  const { showMessage = true, sentToServer = true, message = '程序异常，请稍后重试' } = config || {}
  console.log('[ sentToServer ] >', sentToServer)
  if (sentToServer) {
    traceError(
      {
        eventId: 'manual',
        errMessage: error.message,
        errStack: error.stack
      },
      true
    )
  }
  if (showMessage) {
    antdUtil?.message?.error(message)
  }
}

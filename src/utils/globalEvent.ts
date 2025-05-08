/*
 * @Date: 2025-05-08 11:10:25
 * @LastEditTime: 2025-05-08 11:27:08
 * @Author: CLX
 * @LastEditors: CLX
 * @Description: 全局事件监听 GlobalEvent(发布订阅者)
 */

/** 发布订阅枚举 */
export const EventKeyEnum = {
  // 测试键值
  test: 'test',
}

type EventKeyType = keyof typeof EventKeyEnum

/** 发布订阅者 */
class GlobalEvent {
  private static instance: GlobalEvent
  public eventObject: any
  constructor() {
    this.eventObject = {}
  }
  /** 订阅 */
  public subscribe(eventKey: EventKeyType, callBack: (...args: any[]) => any) {
    if (this.eventObject[eventKey]) {
      this.eventObject[eventKey] = [...this.eventObject[eventKey], callBack]
    } else {
      this.eventObject[eventKey] = [callBack]
    }
  }
  /** 发布 */
  public submit(eventKey: EventKeyType, ...params: any) {
    const callBack = this.eventObject[eventKey]
    if (callBack && callBack.length) {
      callBack.forEach((cb: (...args: any[]) => any) => {
        cb(...params)
      })
    }
  }
  static getInstance(): GlobalEvent {
    if (!this.instance) {
      this.instance = new GlobalEvent()
    }
    return this.instance
  }
}
export default GlobalEvent

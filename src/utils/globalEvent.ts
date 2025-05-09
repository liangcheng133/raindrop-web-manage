/*
 * @Date: 2025-05-08 11:10:25
 * @LastEditTime: 2025-05-08 11:27:08
 * @Author: CLX
 * @LastEditors: CLX
 * @Description: 全局事件监听 GlobalEvent(发布订阅者)
 */

/** 发布订阅者 */
class GlobalEvent {
  private static instance: GlobalEvent
  public eventObject: any
  constructor() {
    this.eventObject = {}
  }
  /** 订阅 - 事件监听 */
  public subscribe(eventKey: string, callBack: (...args: any[]) => any) {
    if (this.eventObject[eventKey]) {
      this.eventObject[eventKey] = [...this.eventObject[eventKey], callBack]
    } else {
      this.eventObject[eventKey] = [callBack]
    }
  }
  /** 取消订阅 */
  public unSubscribe(eventKey: string) {
    delete this.eventObject[eventKey]
  }
  /** 发布 - 事件发出响应 */
  public submit(eventKey: string, ...params: any) {
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

import { AxiosRequestConfig, AxiosResponse } from '@umijs/max'

export interface ResErrorOptions extends AxiosRequestConfig {
  /** 是否展示提示文本 */
  isShowNotification?: boolean
  /** 是否跳转登录页 */
  isReplaceLoginPage?: boolean
}

export interface ErrorAxiosResponse extends Omit<AxiosResponse, 'config'> {
  config: ResErrorOptions
}

/** 接口错误体 */
export class ResError extends Error {
  /** 接口响应结果 */
  public readonly response: ErrorAxiosResponse

  constructor(message: string, response: ErrorAxiosResponse) {
    super(message)
    this.name = 'ResError'
    this.response = response
  }
}

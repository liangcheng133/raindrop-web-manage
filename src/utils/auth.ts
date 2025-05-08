/*
 * @Date: 2025-02-08 13:47:20
 * @LastEditTime: 2025-05-08 11:09:30
 * @Author: CLX
 * @LastEditors: CLX
 * @Description: 权限处理工具
 */
import { USER_ID_KEY, USER_TOKEN_KEY } from '@/constants'
import React from 'react'
import { history } from 'umi'
import { appendQueryParams } from '.'
import { antdUtil } from './antdUtil'
import { localRemove } from './localStorage'

let postNum = 0 // 防止无权限弹框重复弹出

/**
 * 退出登录处理
 */
export function logoutHandle() {
  localRemove(USER_ID_KEY)
  localRemove(USER_TOKEN_KEY)
}

/**
 * 无权限处理
 * @returns
 */
export function noAuthHandle() {
  const handleOk = () => {
    postNum = 0
    logoutHandle()
    history.replace(appendQueryParams('/login', { redirect: window.location.pathname }))
  }
  if (postNum === 1 || !antdUtil.modal) return
  postNum = 1
  antdUtil.modal?.confirm({
    title: '系统提示',
    content: '登录状态已过期，请重新登陆',
    keyboard: false,
    okText: '重新登陆',
    onOk: handleOk,
    footer: (_, { OkBtn }) => {
      return React.createElement(OkBtn)
    }
  })
}

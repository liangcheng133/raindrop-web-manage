/** 组件弹框的类型定义 */
declare namespace ModalComm {
  export type ModalCommProps = {
    /** 保存成功后回调 */
    onSuccess?: () => void
    /** 保存失败后回调 */
    onFail?: () => void
  }
  export type ModalCommRef = {
    /** 打开弹框 */
    open?: () => void
    /** 关闭弹框 */
    close?: () => void
  }
}

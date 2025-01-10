import classNames from 'classnames/bind'

/**
 * 绑定样式
 * @param styles 样式文件
 * @returns classNames
 */
export function classNameBind(styles: CSSModuleClasses) {
  return classNames.bind(styles)
}

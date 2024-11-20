import { ICON_FONT_SCRIPT_URL } from '@/constants'
import { createFromIconfontCN } from '@ant-design/icons'
import { IconFontProps } from '@ant-design/icons/lib/components/IconFont'

const IconFont = createFromIconfontCN({
  scriptUrl: ICON_FONT_SCRIPT_URL
})

/**
 * 文本图标
 * * 来源：阿里图标库 https://www.iconfont.cn
 * @return {*}
 */
export default (props: IconFontProps) => <IconFont {...props} />

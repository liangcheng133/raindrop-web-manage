/*
 * @Date: 2024-10-09 11:39:00
 * @LastEditTime: 2024-10-09 11:49:19
 * @Author: CLX
 * @LastEditors: CLX
 * @Description: 自动导出rd-ui的组件 执行 npm run export 即可快速导出
 */
import fs from 'fs-extra'

fs.readdir('./src/components/rd-ui')
  .then((files) => {
    if (Array.isArray(files)) {
      let exportStr = ''
      files.forEach((fieldName) => {
        // 检查是否为文件夹且文件夹名称符合大驼峰命名规范且包含index.tsx文件
        if (
          fs.lstatSync(`./src/components/rd-ui/${fieldName}`).isDirectory() &&
          /^[A-Z][a-zA-Z]*$/.test(fieldName) &&
          fs.existsSync(`./src/components/rd-ui/${fieldName}/index.tsx`)
        ) {
          exportStr = `${exportStr}\nexport { default as ${fieldName} } from './${fieldName}';`
        }
      })

      fs.writeFile('./src/components/rd-ui/index.ts', exportStr)
      console.log('> 导出组件成功')
    }
  })
  .catch((err) => console.error(err))

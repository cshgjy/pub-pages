const fs = require('fs')
const path = require('path')

// 匹配 .md 文件
const patternFilemd = /\.md$/;

const currentDir = path.resolve('./')

const sidebarMdFile = path.resolve('./', '_sidebar.md')

function clearSidebarMdFile() {
  if (fs.existsSync(sidebarMdFile)) {
    fs.writeFileSync(sidebarMdFile, '', (err) => {
      if (err) {
        console.error(err);
        return
      }
    })

    console.log('sidebarMd 文件已清空')
    return
  }

  fs.writeFileSync(sidebarMdFile)
  console.log('sidebarMd 文件已近创建')
}

function renderToDocsify(article) {
  // 如果前文件的前十行找到 migration_to_hexo 则将该文件迁移都到 hexo/source/_posts 下面去
  const topTenLine = fs.readFileSync(article).toString().split(/\n/).splice(0, 15)
  return !topTenLine.find(line => line.includes('render_to_docsify'))
}

const excludeItems = [
  '习作计划',
  '其它',
  '收藏',
  '读书笔记',
  '生活',
  '网络资源',
  'node_modules',
  '_sidebar',
  'sidebar',
  '.idea',
  'test_data',
  '.git',
  '.vscode',
  'static',
  'docs',
  'migration_hexo'
]

function checkIsExcludeDir(dirPath) {
  return excludeItems.find(item => dirPath.includes(item))
}

const whiteSpace = '  '

function travel(dir, depth, callback) {
  fs.readdirSync(dir).map(file => {
    let filePath = path.join(dir, file)

    if (checkIsExcludeDir(filePath)) return

    if (fs.statSync(filePath).isDirectory()) {
      if (!fs.readdirSync(filePath).length) return

      const dirTitle = depth > 0 ? `${whiteSpace.repeat(depth)}- **${file}**\n` : `- **${file}**\n`
      fs.appendFileSync(sidebarMdFile, dirTitle, (err) => {
        if (err) {
          console.error(err)
        }
      })

      travel(filePath, depth + 1, callback)
    } else if (patternFilemd.test(filePath) && renderToDocsify(filePath)) {
      // 判断是否为 .md 文件, 并且是否需要将当前文件渲染出来
      const fileName = filePath.split('/')[filePath.split('/').length - 1].replace('.md', '')
      const fileRelativePath = filePath.split(currentDir)[1].replace('.md', '')
      const fileWhiteSpace = `${whiteSpace.repeat(depth)}`
      const fileTitlePath = `- [${fileName}](${fileRelativePath})\n`
      const fileTitle = depth > 0 ? `${fileWhiteSpace}${fileTitlePath}` : fileTitlePath

      fs.appendFileSync(sidebarMdFile, `${fileTitle}`, (err) => {
        if (err) {
          console.error(err)
          return
        }
      })
    }
  })
}

(function start() {
  clearSidebarMdFile()
  travel(currentDir, depth = 0, function (filePath) {})
})()

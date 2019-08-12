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

import superagent from 'superagent'
import DellAnalyzer from './dellAnalyzer'
import path from 'path'
import fs from 'fs'
interface Analyzer{
  analyzer:(html: string, filePath: string) => string
}

class Crowller {
  private secret = 'x3b174jsx'
  private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`
  private filePath = path.resolve(__dirname, '../data/course.json')

  async getRawHtml() {
    const result = await superagent.get(this.url)
    return result.text
  }
  async initSpiderProcess() {
    const html = await this.getRawHtml()
    const fileContent = this.analyzer.analyzer(html, this.filePath)
    this.writeFile(fileContent)
  }
  writeFile(content:string) {
    fs.writeFileSync(this.filePath, content)
  }

  constructor(private analyzer: Analyzer) {
    this.initSpiderProcess()
  }
}
const analyzer = new DellAnalyzer()
new Crowller(analyzer)
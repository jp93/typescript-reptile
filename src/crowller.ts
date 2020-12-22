import superagent from 'superagent'
import DellAnalyzer from './dellAnalyzer'
import path from 'path'
import fs from 'fs'
 export interface Analyzer{
  analyzer:(html: string, filePath: string) => string
}

class Crowller {
  private filePath = path.resolve(__dirname, '../data/course.json')

  private async getRawHtml() {
    const result = await superagent.get(this.url)
    return result.text
  }
  private async initSpiderProcess() {
    const html = await this.getRawHtml()
    const fileContent = this.analyzer.analyzer(html, this.filePath)
    this.writeFile(fileContent)
  }
  private writeFile(content:string) {
    fs.writeFileSync(this.filePath, content)
  }

  constructor(private url:string, private analyzer: Analyzer) {
    this.initSpiderProcess()
  }
}
const secret = 'x3b174jsx'
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`
const analyzer = DellAnalyzer.getInstance()
new Crowller(url, analyzer)
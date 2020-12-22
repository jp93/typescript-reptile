import superagent from 'superagent'
import cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'
interface Course {
  title: string,
  count: number
}
interface CourseResult {
  time: number,
  data: Course[]
}
interface Content {
  [propName: number] : Course[]
}
class Crowller {
  private secret = 'x3b174jsx'
  private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`
  getCourseInfo(html: string) {
    const $ = cheerio.load(html)
    const courseItem = $('.course-item')
    const courseInfos:Course[] = []
    courseItem.map((index, element) => {
      const descs = $(element).find('.course-desc')
      const title = descs.eq(0).text()
      const count = parseInt(descs.eq(1).text().split('：')[1])
      courseInfos.push({
        title, count
      })
    })
    const result = {
      time: new Date().getTime(),
      data: courseInfos
    }
    return result

  }
  async getRawHtml() {
    const result = await superagent.get(this.url)
    return result.text
  }
  async initSpiderProcess() {
    const html = await this.getRawHtml()
    const courseInfo = this.getCourseInfo(html)
    this.generateJsonContent(courseInfo)
  }
  generateJsonContent(courseInfo: CourseResult) {
    const filePath = path.resolve(__dirname, '../src/course.json')
    let fileContent: Content = {}
    if(fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
    fileContent[courseInfo.time] = courseInfo.data
    fs.writeFileSync(filePath, JSON.stringify(fileContent))

  }
  constructor() {
    this.initSpiderProcess()
  }
}
const crowller = new Crowller()
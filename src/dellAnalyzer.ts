import fs from 'fs'
import cheerio from 'cheerio'
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
export default  class DellAnalyzer {
  private getCourseInfo(html: string) {
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
  private generateJsonContent(courseInfo: CourseResult, filePath:string) {
    let fileContent: Content = {}
    if(fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
    fileContent[courseInfo.time] = courseInfo.data
    return JSON.stringify(fileContent)
  }
  public analyzer(html:string, filePath: string) {
    const courseInfo = this.getCourseInfo(html)
    const fileContent = this.generateJsonContent(courseInfo, filePath)
    return fileContent
  }

}
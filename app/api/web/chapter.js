const Router = require('koa-router')
const router = new Router({ prefix: '/web/chapter' })
const { Chapter } = require('../../models/chapter')
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')
const { AddCourseValidator } = require('../../validators/courseManage-validator')

router.post('/addChapter', new Auth(8).m, async (ctx) => {
  let data = ctx.request.body
  let chapter = await Chapter.addChapter(data)
  success('ok', chapter)
})

router.post('/addCourse', new Auth(8).m, async (ctx) => {
  let data = ctx.request.body
  data = await Chapter.addChapterCourse(data)
  success('ok', data)
})

router.get('/getAll/:id', new Auth(4).m, async (ctx) => {
  let course_id = ctx.params.id
  let data = await Chapter.getAll(course_id)
  success('ok', data)
})

router.post('/changeName', new Auth(8).m, async (ctx) => {
  let data = ctx.request.body
  await Chapter.changeName(data)
  success('ok')
})

module.exports = router
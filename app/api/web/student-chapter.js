const Router = require('koa-router')
const router = new Router({ prefix: '/web/studentChapter' })
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')
const { StudentChapter } = require('../../models/student-chapter')

/**
 * 获取学生章节进度
 */
 router.get('/getProgress/:id', new Auth(4).m, async (ctx) => {
  let studentId = ctx.auth.uid
  let courseId = ctx.params.id
  let data = await StudentChapter.getProgress(studentId, courseId)
  success('ok', data)
})

/**
 * 查询学生是否完成了该章节
 * 是返回成绩
 */
router.get('/hasComplete/:id', new Auth(4).m, async (ctx) => {
  let id = ctx.params.id
  let userId = ctx.auth.uid
  let data = await StudentChapter.hasComplete(id, userId)
  success('ok', data)
})

module.exports = router
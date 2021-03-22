const Router = require('koa-router')
const router = new Router({ prefix: '/web/studentHomework' })
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')
const { StudentHomework } = require('../../models/student-homework')

/**
 * 学生提交作业保存记录
 */
router.post('/submitAndSave', new Auth(4).m, async (ctx) => {
  let body = ctx.request.body
  let userId = ctx.auth.uid
  let data = await StudentHomework.submitAndSave(body, userId)
  success('ok', data)
})

/**
 * 获取学生作业记录
 */
router.get('/getStudentHomeworkRecord/:id', new Auth(4).m, async (ctx) => {
  let chapterId = ctx.params.id
  let userId = ctx.auth.uid
  let data = await StudentHomework.getStudentHomeworkRecord(chapterId, userId)
  success('ok', data)
})

module.exports = router
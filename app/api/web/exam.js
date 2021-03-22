const Router = require('koa-router')
const router = new Router({ prefix: '/web/exam' })
const { Exam } = require('../../models/exam')
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')

router.post('/saveExam', new Auth(8).m, async (ctx) => {
  let body = ctx.request.body
  body.creatorId = ctx.auth.uid
  let data = await Exam.saveExam(body)
  success('ok', data)
})

router.post('/modifyExam', new Auth(8).m, async (ctx) => {
  let body = ctx.request.body
  await Exam.modifyExam(body)
  success('ok')
})

router.get('/getTeachersExam', new Auth(8).m, async (ctx) => {
  let creatorId = ctx.auth.uid
  let data = await Exam.getTeachersExam(creatorId)
  success('ok', data)
})

router.get('/listStudentExams', new Auth(4).m, async (ctx) => {
  let userId = ctx.auth.uid
  let data = await Exam.listStudentExams(userId)
  success('ok', data)
})

module.exports = router
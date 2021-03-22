const Router = require('koa-router')
const router = new Router({ prefix: '/web/examRecord' })
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')
const { ExamRecord } = require('../../models/exam-record')

router.post('/saveRecord', new Auth(4).m, async (ctx) => {
  let body = ctx.request.body
  let userId = ctx.auth.uid
  body.userId = userId
  await ExamRecord.saveRecord(body)
  success('ok')
})

router.post('/judgeAndReturnGrade', new Auth(4).m, async (ctx) => {
  let body = ctx.request.body
  let userId = ctx.auth.uid
  body.userId = userId
  await ExamRecord.judgeAndReturnGrade(body)
  success('ok')
})

module.exports = router
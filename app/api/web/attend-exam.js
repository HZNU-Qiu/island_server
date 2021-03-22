const Router = require('koa-router')
const router = new Router({ prefix: '/web/attendExam' })
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')
const { AttendExam } = require('../../models/attend-exam')

router.get('/getStudentGrade', new Auth(4).m, async (ctx) => {
  let userId = ctx.auth.uid
  let data = await AttendExam.getStudentGrade(userId)
  success('ok', data)
})

module.exports = router
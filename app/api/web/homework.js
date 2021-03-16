const Router = require('koa-router')
const router = new Router({ prefix: '/web/homework' })
const { Homework } = require('../../models/homework')
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')

router.get('/listExercises', new Auth(8).m, async (ctx) => {
  let current = ctx.query.current
  let chapterId = ctx.query.chapterId
  let data = await Homework.listExercise(current, chapterId)
  success('ok', data)
})

router.get('/listHomework/:chapterId', new Auth(4).m, async (ctx) => {
  let chapterId = ctx.params.chapterId
  let data = await Homework.listHomework(chapterId)
  success('ok', data)
})

router.post('/save', new Auth(8).m, async (ctx) => {
  let body = ctx.request.body
  await Homework.saveHomework(body.data, body.chapterId)
  success('ok')
})

module.exports = router
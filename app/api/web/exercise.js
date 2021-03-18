const Router = require('koa-router')
const router = new Router({ prefix: '/web/exercise' })
const { Exercise } = require('../../models/exercise')
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')

router.post('/add', new Auth(8).m, async (ctx) => {
  let data = ctx.request.body
  let creatorId = ctx.auth.uid
  data.creatorId = creatorId
  await Exercise.add(data)
  success('ok')
})

router.post('/modify', new Auth(8).m, async (ctx) => {
  let data = ctx.request.body
  await Exercise.modify(data)
  success('ok')
})

router.post('/getByConditions', new Auth(4).m, async (ctx) => {
  let condition = ctx.request.body
  let creatorId = ctx.auth.uid
  condition.creatorId = creatorId
  let res = await Exercise.getExercises(condition)
  res.map((item) => {
    if (item.options !== null && item.options !== "")
      item.options = item.options.split(';')
  })
  let data = {'total': 0, 'list': []}
  data.list = res
  if (res.length !== 0)
    data.total = res[0].total
  success('ok', data)
})

router.get('/detail/:id', new Auth(8).m, async (ctx) => {
  let id = ctx.params.id
  let data = await Exercise.getOne(id)
  success('ok', data)
})

router.post('/filterExercise', new Auth(4).m, async (ctx) => {
  let body = ctx.request.body
  let data = await Exercise.filterExercise(body)
  success('ok', data)
})

router.post('/getExercisesForPaper', new Auth(8).m, async (ctx) => {
  let body = ctx.request.body
  let data = await Exercise.getExercisesForPaper(body)
  success('ok', data)
})

module.exports = router
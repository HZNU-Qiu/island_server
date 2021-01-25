const Router = require('koa-router')
const { success } = require('../../lib/helper')
const router = new Router({ prefix: '/web/school' })
const { School } = require('../../models/school')
const { SchoolAddValidator, SchoolNameModifyValidator } = require('../../validators/university-validator')

router.post('/add', async (ctx) => {
  const v = await new SchoolAddValidator().validate(ctx)
  let school = v.get('body')
  school.status = 1
  let res = await School.add(school)
  let data = {}
  data.id = res.id + 200
  data.selfId = res.id
  data.label = res.name
  data.parentId = res.universityId
  data.rank = 2
  success('ok', data)
})

router.post('/modify', async(ctx) => {
  const v = await new SchoolNameModifyValidator().validate(ctx)
  const id = v.get('body.id')
  const name = v.get('body.name')
  await School.modify(id, name)
  success('ok')
})

module.exports = router
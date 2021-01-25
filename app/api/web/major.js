const Router = require('koa-router')
const router = new Router({ prefix: '/web/major' })
const { MajorAddValidator, MajorNameModifyValidator } = require('../../validators/university-validator')
const { Major } = require('../../models/major')
const { success } = require('../../lib/helper')

router.post('/add', async (ctx) => {
  const v = await new MajorAddValidator().validate(ctx)
  let major = v.get('body')
  major.status = 1
  let res = await Major.add(major)
  let data = {}
  data.id = res.id + 40000
  data.selfId = res.id
  data.label = res.name
  data.parentId = res.schoolId
  data.rank = 4
  success('ok', data)
})

router.post('/modify', async (ctx) => {
  const v = await new MajorNameModifyValidator().validate(ctx)
  const id = v.get('body.id')
  const name = v.get('body.name')
  await Major.modify(id, name)
  success('ok')
})

module.exports = router
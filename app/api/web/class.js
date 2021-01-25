const Router = require('koa-router')
const router = new Router({ prefix: '/web/class' })
const { ClassAddValidator, ClassNameModifyValidator } = require('../../validators/university-validator')
const { ClassRoom } = require('../../models/class')
const { success } = require('../../lib/helper')

router.post('/add', async (ctx) => {
  const v = await new ClassAddValidator().validate(ctx)
  let clas = v.get('body')
  clas.status = 1
  let res = await ClassRoom.add(clas)
  let data = {}
  data.id = res.id + 500000
  data.selfId = res.id
  data.label = res.name
  data.parentId = res.majorId
  data.rank = 5
  success('ok', data)
})

router.post('/modify', async (ctx) => {
  const v = await new ClassNameModifyValidator().validate(ctx)
  const id = v.get('body.id')
  const name = v.get('body.name')
  await ClassRoom.modify(id, name)
  success('ok')
})

module.exports = router
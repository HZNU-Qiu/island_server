const Router = require('koa-router')
const router = new Router({ prefix: '/web/university' })
const { University } = require('../../models/university')
const { UniversityAddValidator, UniversityNameModifyValidator } = require('../../validators/university-validator')
const { success } = require('../../lib/helper')

router.post('/add', async (ctx) => {
  const v = await new UniversityAddValidator().validate(ctx)
  const name = v.get('body.name')
  let res = await University.create({name})
  const data = {
    id: res.id,
    selfId: res.id,
    label: res.name,
    rank: 1
  }
  success('ok', data)
})

router.post('/modify', async (ctx) => {
  const v = await new UniversityNameModifyValidator().validate(ctx)
  const name = v.get('body.name')
  const id = v.get('body.id')
  await University.modify(id, name)
  success('ok')
})

router.get('/getTree', async () => {
  let tree = await University.getTree()
  success('ok', tree)
})

module.exports = router
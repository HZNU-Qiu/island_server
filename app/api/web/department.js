const Router = require('koa-router')
const router = new Router({ prefix: '/web/department' })
const { DepartmentAddValidator, DepartmentNameModifyValidator } = require('../../validators/university-validator')
const { Department } = require('../../models/department')
const { success } = require('../../lib/helper')

router.post('/add', async (ctx) => {
  const v = await new DepartmentAddValidator().validate(ctx)
  let department = v.get('body')
  department.status = 1
  let res = await Department.add(department)
  let data = {}
  data.id = res.id + 3000
  data.selfId = res.id
  data.label = res.name
  data.parentId = res.schoolId
  data.rank = 3
  success('ok', data)
})

router.post('/modify', async (ctx) => {
  const v = await new DepartmentNameModifyValidator().validate(ctx)
  const id = v.get('body.id')
  const name = v.get('body.name')
  await Department.modify(id, name)
  success('ok')
})

module.exports = router
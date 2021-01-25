const Router = require('koa-router')
const router = new Router({ prefix: '/web/token' })
const { success } = require('../../lib/helper')
const { LoginValidator } = require('../../validators/user-validator')
const { User } = require('../../models/user')

router.post('/login', async (ctx) => {
  const v = await new LoginValidator().validate(ctx)
  const username = v.get('body.username')
  const password = v.get('body.password')
  const { token, userData } = await User.login(username, password)
  let user = userData
  success('ok', { token, user })
})

module.exports = router
const Router = require('koa-router')
const router = new Router({ prefix: '/web/user' })
const { User } = require('../../models/user')
const { success } = require('../../lib/helper')
const { RegisterValidator, GetInfoValidator } = require('../../validators/user-validator')
const { Auth } = require('../../../middlewares/auth')

/**
 * 用户注册
 */
router.post('/register', async (ctx, next) => {
  const v = await new RegisterValidator().validate(ctx)
  const data = {
    username: v.get('body.username1'),
    password: v.get('body.pass'),
    email: v.get('body.email'),
    avatar: '/avatars/default.png',
    type: 4,
    status: 1
  }
  await User.add(data)
  success('ok')
})

/**
 * 用户信息查询
 */
router.get('/info', new Auth(4).m, async (ctx) => {
  let id = ctx.auth.uid
  let user = await User.info(id)
  success('ok', user)
})

module.exports = router
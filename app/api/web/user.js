const Router = require('koa-router')
const router = new Router({ prefix: '/web/user' })
const { User } = require('../../models/user')
const { success } = require('../../lib/helper')
const { RegisterValidator, ModifyStudentInfo } = require('../../validators/user-validator')
const { Auth } = require('../../../middlewares/auth')
const body = require('koa-body');
const path = require('path');
const fs = require('fs')

const koaBodyOptions = {
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, '../../../upload/avatars'),
    maxFileSize: 200 * 1024 * 1024,    // 设置上传文件大小最大限制，默认2M
    keepExtensions: true, 
    onError: (err) => {
      console.log(err);
      throw new Error('上传出错啦')
    }
  }
}

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

/**
 * 分页查询学生列表
 */
router.get('/getStudentsByPage', new Auth(4).m, async (ctx) => {
  let { currentPage } = ctx.request.query
  let offset = 15 * (currentPage - 1)
  let tableData = await User.queryStudentByPage(offset)
  tableData.map((item) => {
    item.editFlag = false
    item.tmpEdit = {}
  })
  let total = tableData.length
  success('ok', { tableData, total })
})

/**
 * 分页查询学生列表
 */
router.get('/getTeachersByPage', new Auth(4).m, async (ctx) => {
  let { currentPage } = ctx.request.query
  let offset = 15 * (currentPage - 1)
  let tableData = await User.queryTeacherByPage(offset)
  tableData.map((item) => {
    item.editFlag = false
    item.tmpEdit = {}
  })
  let total = tableData.length
  success('ok', { tableData, total })
})

/**
 * 保存学生用户信息
 */
router.post('/modifyStudentInfo', new Auth(4).m, async (ctx) => {
  const v = await new ModifyStudentInfo().validate(ctx)
  let data = v.get('body')
  await User.modify(data)
  success('ok')
})

/**
 * 保存教师用户信息
 */
router.post('/modifyTeacherInfo', new Auth(4).m, async (ctx) => {
  const v = await new ModifyStudentInfo().validate(ctx)
  let data = v.get('body')
  await User.modify(data)
  success('ok')
})

/**
 * 更改用户头像
 */
router.post('/changeAvatar', new Auth(16).m, body(koaBodyOptions), async (ctx) => {
  let url = ctx.request.files.file.path
  url = url.split('\\')
  let src = '/avatars/' + url[url.length - 1]
  let id = ctx.request.body.id
  let oldAvatar = ctx.request.body.oldAvatar
  if (oldAvatar !== "/avatars/default.png") {
    let p = path.join(__dirname, `../../../upload${oldAvatar}`)
    fs.unlinkSync(p)
  }
  await User.uploadAvatar(id, src)
  success('ok', src)
})

module.exports = router
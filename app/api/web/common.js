const Router = require('koa-router')
const router = new Router({ prefix: '/web/common' })
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')
const body = require('koa-body');
const path = require('path');
const fs = require('fs')

const koaBodyOptions = {
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, '../../../upload/icons'),
    maxFileSize: 200 * 1024 * 1024,    // 设置上传文件大小最大限制，默认2M
    keepExtensions: true,
    onError: (err) => {
      console.log(err);
      throw new Error('上传出错啦')
    }
  }
}

router.post('/upload', new Auth(4).m, body(koaBodyOptions), async (ctx) => {
  let url = ctx.request.files.file.path
  let tmp = ctx.request.body.tmp
  if (tmp) {
    let p = path.join(__dirname, `../../../upload${tmp}`)
    fs.unlinkSync(p)
  }
  url = url.split('\\')
  let src = '/icons/' + url[url.length - 1]
  success('ok', { src })
})

router.post('/cancel', new Auth(4).m, async (ctx) => {
  let tmp = ctx.request.body.data
  let p = path.join(__dirname, `../../../upload${tmp}`)
  fs.unlinkSync(p)
  success('ok')
})

module.exports = router 
const Router = require('koa-router')
const router = new Router({ prefix: '/web/paper' })
const { Paper } = require('../../models/paper')
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')
const { PaperExercises } = require('../../models/paper_exercises')

/**
 * 筛选试卷
 */
router.post('/filterPaper', new Auth(4).m, async (ctx) => {
  let queryData = ctx.request.body
  let uid = ctx.auth.uid
  queryData.creatorId = uid
  let data = await Paper.filterPapers(queryData)
  success('ok', data)
})

/**
 * 保存试卷草稿
 */
router.post('/addPaper', new Auth(8).m, async (ctx) => {
  let uid = ctx.auth.uid
  let body = ctx.request.body
  body.creatorId = uid
  let data = await Paper.addPaper(body)
  success('ok', data)
})

/**
 * 获取试卷信息
 */
router.get('/info/:id', new Auth(8).m, async (ctx) => {
  let id = ctx.params.id
  let data = await Paper.getPaperInfo(id)
  success('ok', data)
})

/**
 * 获取试卷试题
 */
router.get('/exercises/:id', new Auth(4).m, async (ctx) => {
  let id = ctx.params.id
  let data = await Paper.getPaperExercises(id)
  success('ok', data)
})

/**
 * 保存试题信息
 */
router.post('/savePaperExercises', new Auth(8).m, async (ctx) => {
  let body = ctx.request.body
  let data = body.data
  let paperId = body.paperId
  await PaperExercises.savePaperExercise(data, paperId)
  await Paper.update({ status: 1 }, {
    where: {
      id: paperId
    }
  })
  success('ok')
})

/**
 * 根据categoryId获取试卷
 */
router.get('/getPapersByCategory/:id', new Auth(8).m, async (ctx) => {
  let id = ctx.params.id
  let data = await Paper.getPapersByCategory(id)
  success('ok', data)
})

module.exports = router
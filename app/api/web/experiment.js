const Router = require('koa-router')
const router = new Router({ prefix: '/web/experiment' })
const { Experiment } = require('../../models/experiments')
const { ExperimentSubmit } = require('../../models/experiment-submit')
const { AddExperimentValidator, ModifyExperimentValidator } = require('../../validators/experiment-validator')
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')

/**
 * 添加实验题目
 */
router.post('/add', new Auth(8).m, async (ctx) => {
  const v = await new AddExperimentValidator().validate(ctx)
  const uid = ctx.auth.uid
  let experiment = v.get('body')
  experiment.editorId = uid
  let data = {}
  try {
    await Experiment.add(experiment)
    data.flag = true
  } catch (error) {
    data.flag = false
    data.msg = "标题重复"
    success('ok', data)
  }
  success('ok', data)
})

/**
 * 教师页面分页显示实验题目
 */
router.get('/listByPage/:current', new Auth(8).m, async (ctx) => {
  let current = ctx.params.current
  let data = await Experiment.listByPageForTeachers(current)
  success('ok', data)
})

/**
 * 改变实验是否可见
 */
router.get('/visable', new Auth(8).m, async (ctx) => {
  let status = ctx.query.status;
  let id = ctx.query.id
  await Experiment.statusChange(id, status)
  success('ok')
})

/**
 * 实验详情接口
 */
router.get('/getDetail/:id', new Auth(4).m, async (ctx) => {
  let id = ctx.params.id
  let { res, checkList, samples } = await Experiment.getDetail(id);
  try {
  } catch (error) {
    ctx.status = 500,
      ctx.body = {
        message: error,
        code: 500
      }
  }
  success('ok', { data: res, checkList, samples })
})

/**
 * 编辑实验接口
 */
router.post('/modify', new Auth(8).m, async (ctx) => {
  const v = await new ModifyExperimentValidator().validate(ctx)
  let data = v.get('body')
  try {
    await Experiment.modify(data)
  } catch (error) {
    ctx.status = 500,
      ctx.body = {
        message: error,
        code: 500
      }
  }
  success('ok')
})

/**
 * 下载测试样例接口
 */
router.get('/download/:id', new Auth(8).m, async (ctx) => {
  let displayId = ctx.params.id
  let url = await Experiment.download(displayId)
  success('ok', url)
})

/**
 * 实验题目展示列表
 * 一页20个
 * 难度+label筛选
 */
router.post('/filterAndList', new Auth(4).m, async (ctx) => {
  let uid = ctx.auth.uid
  let data = ctx.request.body
  data.userId = uid
  let res = await Experiment.filterAndList(data)
  success('ok', res)
})

/**
 * 判题接口
 */
router.post('/judge', new Auth(4).m, async (ctx) => {
  let uid = ctx.auth.uid
  let data = ctx.request.body
  data.userId = uid
  let res = await ExperimentSubmit.judge(data)
  success('ok', res)
})

/**
 * 获取提交队列接口
 */
router.post('/queryQueue', new Auth(4).m, async (ctx) => {
  let body = ctx.request.body
  let data = await ExperimentSubmit.queryQueue(body)
  success('ok', data)
})

module.exports = router
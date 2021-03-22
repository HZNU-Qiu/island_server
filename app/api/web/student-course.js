const Router = require('koa-router')
const router = new Router({ prefix: '/web/studentCourse' })
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')
const { StudentCourse } = require('../../models/student-course')

/**
 * 开始学习课程
 */
router.get('/startLearning/:id', new Auth(4).m, async (ctx) => {
  let query = {}
  query.studentId = ctx.auth.uid
  query.courseId = ctx.params.id
  let flag = await StudentCourse.startLearning(query)
  if (flag === 1) {
    success('ok')
  } else {
    ctx.body = {
      code: 500,
      msg: "您已经开启了该课程"
    }
  }
})

/**
 * 查询学生是否开启了课程
 */
router.get('/hasStart/:id', new Auth(4).m, async (ctx) => {
  let courseId = ctx.params.id
  let studentId = ctx.auth.uid
  let data = await StudentCourse.hasStart(courseId, studentId)
  success('ok', {data})
})


module.exports = router
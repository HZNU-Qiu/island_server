const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const { Result } = require('../lib/enum')
const config = require('../../config/config')
const judgeConfig = config.judge_config
const serverUrl = config.judge_server_url
const axios = require('axios')

class ExperimentSubmit extends Model {
  /**
   * 判题服务
   * @param {*} data 
   */
  static async judge(data) {
    let header = config.judge_header
    let form = {
      "src": data.code,
      "language_config": judgeConfig[data.lang],
      "max_cpu_time": data.max_cpu_time,
      "max_memory": data.max_memory * 1024 * 1024,
      "test_case_id": data.displayId.toString(),
      "output": "false"
    }
    let res = await axios({
      method: 'POST',
      url: serverUrl,
      data: form,
      headers: header
    })
    let result = 0
    let msg = "Wow!Your code has been accepted!Yeahh~~"
    let resultArr = res.data.data
    let totalTime = 0
    let totalMemory = 0
    let index = 0
    if (res.data.err !== null) {
      return {
        flag: -1,
        msg: res.data.err,
        reason: res.data.data
      }
    }
    resultArr.some((item) => {
      if (item.result !== 0) {
        switch (item.result) {
          case Result.WRONG_ANSWER:
            result = Result.WRONG_ANSWER
            msg = 'Oops,Wrong answer at testcase ' + item.test_case
            break
          case Result.CPU_TIME_LIMIT_EXCEEDED:
            result = Result.CPU_TIME_LIMIT_EXCEEDED
            msg = 'Oops,CPU time limit exceeded at testcase ' + item.test_case
            break
          case Result.REAL_TIME_LIMIT_EXCEEDED:
            result = Result.REAL_TIME_LIMIT_EXCEEDED
            msg = 'Oops,Real time exceeded at testcase ' + item.test_case
            break
          case Result.MEMORY_LIMIT_EXCEEDED:
            result = Result.MEMORY_LIMIT_EXCEEDED
            msg = 'Oops,Memory limit exceeded at testcase ' + item.test_case
            break
          case Result.RUNTIME_ERROR:
            result = Result.RUNTIME_ERROR
            msg = 'Hahh,Runtime Error!loool~'
            break
          case Result.SYSTEM_ERROR:
            result = Result.SYSTEM_ERROR
            msg = 'Sorry,System has been broke down!'
            break
          default:
            break
        }
        totalTime += item.real_time
        totalMemory += item.memory
        index++
        return true
      } else {
        totalTime += item.real_time
        totalMemory += item.memory
        index++
      }
    })
    let saveData = {}
    saveData.experimentId = data.experimentId
    saveData.userId = data.userId
    saveData.codeSize = data.codeSize
    saveData.codeLang = data.lang
    saveData.code = data.code
    saveData.result = result
    saveData.memory = parseInt(totalMemory / index)
    saveData.timeConsumption = parseInt(totalTime / index)
    if (result === 0) {
      const { StudentInfo } = require('../models/student-info')
      let student = await StudentInfo.findOne({
        where: {
          userId: data.userId
        }
      })
      if (student !== null) {
        await student.increment('practiceAbility', { by: data.point })
      }
    }
    await ExperimentSubmit.create({
      ...saveData
    })
    let hasSubmitted = await ExperimentSubmit.findAndCountAll({
      attributes: ['result'],
      where: {
        experimentId: data.experimentId
      }
    })
    let submitedNum = hasSubmitted.count
    let ac = 0, wa = 0, tle = 0, mle = 0, rtle = 0, re = 0
    hasSubmitted.rows.map((item) => {
      switch (item.dataValues.result) {
        case Result.SUCCESS:
          ac++
          break
        case Result.WRONG_ANSWER:
          wa++
          break
        case Result.CPU_TIME_LIMIT_EXCEEDED:
          tle++
          break
        case Result.REAL_TIME_LIMIT_EXCEEDED:
          rtle++
          break
        case Result.MEMORY_LIMIT_EXCEEDED:
          mle++
          break
        case Result.RUNTIME_ERROR:
          re++
          break
        default:
          break
      }
    })
    let resData = {}
    resData.result = result
    resData.msg = msg
    resData.avgMemory = saveData.memory
    resData.avgTime = saveData.timeConsumption
    resData.submitedNum = submitedNum
    resData.flag = 1
    resData.chartData = {
      hoverBackgroundColor: "red",
      hoverBorderWidth: 10,
      labels: ["AC", "WA", "RE", "RTLE", "MLE", "TLE"],
      datasets: [
        {
          label: "Data One",
          backgroundColor: [
            "#41B883",
            "#E46651",
            "#00D8FF",
            "#ffc107",
            "#673ab7",
            "#ff5722",
          ],
          data: [ac, wa, re, rtle, mle, tle],
        },
      ],
    }
    return resData
  }

  /**
   * 获取提交队列
   */
  static async queryQueue(data) {
    let sql = `SELECT (SELECT COUNT(1) from experiment_submit e WHERE e.result = ${data.result} AND e.code_lang = '${data.codeLang}' AND experiment_id = ${data.experimentId})AS total, e.result, e.code_size AS codeSize, e.code_lang AS codeLang, e.code, e.memory AS avgMemory, e.time_consumption AS avgTime, date_format(e.created_at, '%Y-%m-%d %H:%i:%s') AS submitTime, u.realname AS name
    FROM experiment_submit e LEFT JOIN user u ON e.user_id = u.id
    WHERE e.result = ${data.result} AND e.code_lang = '${data.codeLang}' AND experiment_id = ${data.experimentId}
    LIMIT 30 OFFSET ${(data.current - 1) * 30}`
    let res = await db.query(sql, { raw: true })
    res[0].map((item) => {
      item.avgTime = item.avgTime + "MS"
      item.avgMemory = item.avgMemory / 1024 + "KB"
      item.codeSize = item.codeSize + "Byte" 
    })
    return res[0]
  }
}

ExperimentSubmit.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 学生id FK(user_id)
  userId: Sequelize.INTEGER,
  // 实验id FK(experimentId)
  experimentId: Sequelize.INTEGER,
  // 判题结果
  result: Sequelize.INTEGER,
  // 代码大小
  codeSize: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  // 所用语言
  codeLang: Sequelize.STRING(64),
  // 提交代码内容
  code: Sequelize.TEXT,
  // 内存占用
  memory: Sequelize.INTEGER,
  // 耗时
  timeConsumption: Sequelize.INTEGER,
}, {
  sequelize: db,
  tableName: 'experiment_submit'
})

module.exports = { ExperimentSubmit }
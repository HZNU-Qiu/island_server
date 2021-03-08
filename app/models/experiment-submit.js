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
        return true
      } else {
        totalTime += item.cpu_time
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
      await student.increment('practiceAbility', { by: data.point })
    }
    await ExperimentSubmit.create({
      ...saveData
    })
    let hasSubmitted = await ExperimentSubmit.findAndCountAll({
      attributes: ['result']
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
    resData.result
    resData.msg = msg
    resData.avgMemory = saveData.memory
    resData.avgTime = saveData.timeConsumption
    resData.submitedNum = submitedNum
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
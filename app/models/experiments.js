const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const md5 = require('js-md5')
const fs = require('fs')
const Path = require('path')
const compressing = require('compressing')

class Experiment extends Model {
  /**
   * 创建实验
   */
  static async add(data) {
    const path = `C:\\Users\\pc\\Desktop\\${data.displayId}\\`
    let isExist = fs.existsSync(path)
    if (!isExist) {
      fs.mkdirSync(path)
      let index = 1
      let cases = {
        "test_case_number": parseInt(data.displayId),
        "spj": false,
        "test_cases": {}
      }
      data.samples.map((item) => {
        cases.test_cases[index] = {
          stripped_output_md5: md5(item.output.trim()),
          output_size: item.output.length,
          output_name: `${index}.out`,
          input_size: item.input.length,
          input_name: `${index}.in`
        }
        fs.writeFileSync(`${path}${index}.in`, item.input)
        fs.writeFileSync(`${path}${index}.out`, item.output)
        index++
      })
      fs.writeFileSync(`${path}info`, JSON.stringify(cases, null, 2))
      delete data.samples
      return await Experiment.create({
        ...data
      })
    } else {
      throw new Error("该目录已存在")
    }
  }

  /**
   * 分页显示实验列表(教师表)
   */
  static async listByPageForTeachers(current) {
    let offset = (current - 1) * 20;
    return await Experiment.findAndCountAll({
      offset,
      limit: 20
    })
  }

  /**
   * 改变实验是否可见
   */
  static async statusChange(id, status) {
    return await Experiment.update({
      status
    }, {
      where: {
        id,
      }
    })
  }

  /**
   * 获取实验的详情信息
   */
  static async getDetail(id) {
    let data = await Experiment.findOne({
      where: {
        id
      }
    })
    let res = { ...data.dataValues }
    let checkList = res.language.split(';')
    let samples = []
    const path = `C:\\Users\\pc\\Desktop\\${res.displayId}\\`
    let isExist = fs.existsSync(path)
    if (isExist) {
      let in_files = fs.readdirSync(path).filter((file) => {
        return Path.extname(file).toLowerCase() === '.in'
      })
      let out_files = fs.readdirSync(path).filter((file) => {
        return Path.extname(file).toLowerCase() === '.out'
      })
      for (var i = 0; i < in_files.length; i++) {
        let x = fs.readFileSync(`${path}${in_files[i]}`).toString()
        let y = fs.readFileSync(`${path}${out_files[i]}`).toString()
        samples.push({ 'input': x, 'output': y })
      }
      return { res, checkList, samples }
    } else {
      throw new Error("服务异常，文件丢失")
    }
  }

  /**
   * 编辑实验
   */
  static async modify(data) {
    if (data.needToChange) {
      const path = `C:\\Users\\pc\\Desktop\\${data.displayId}\\`
      let isExist = fs.existsSync(path)
      if (isExist) {
        let index = 1
        let cases = {
          "test_case_number": parseInt(data.displayId),
          "spj": false,
          "test_cases": {}
        }
        data.samples.map((item) => {
          cases.test_cases[index] = {
            stripped_output_md5: md5(item.output.trim()),
            output_size: item.output.length,
            output_name: `${index}.out`,
            input_size: item.input.length,
            input_name: `${index}.in`
          }
          fs.writeFileSync(`${path}${index}.in`, item.input)
          fs.writeFileSync(`${path}${index}.out`, item.output)
          index++
        })
        fs.writeFileSync(`${path}info`, JSON.stringify(cases, null, 2))
        delete data.samples
        delete data.needToChange
      } else {
        throw new Error("文件丢失")
      }
    }
    return await Experiment.update({
      ...data
    }, {
      where: {
        id: data.id
      }
    })
  }

  /**
   * 下载测试样例
   */
  static async download(displayId) {
    let path = `C:\\Users\\pc\\Desktop\\${displayId}`
    try {
      let savePath = Path.join(__dirname, `../../upload/tmp`)
      await compressing.tar.compressDir(path, `${savePath}/${displayId}.tar`)
      return `http://localhost:8020/tmp/${displayId}.tar`
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * 删除临时文件
   */
  static removeTmp(displayId) {
    let path = Path.join(__dirname, '../../upload/tmp')
    fs.unlinkSync(`${path}/${displayId}`)
  }

  /**
   * 实验题目展示列表
   * 一页20个
   * 难度+label筛选
   */
  static async filterAndList(data) {
    let difficulty = data.difficulty
    let label = data.labelId
    let current = data.current
    let offset = (current - 1) * 20
    let options = []
    if (difficulty !== 0) {
      options.push(` e.difficulty = ${difficulty}`)
    }
    if (label !== 0) {
      options.push(` e.label = ${label}`)
    }
    options.push(`e.status = 1`)
    let query = options.join(' AND ')
    let sql = `SELECT e.id, e.title, e.difficulty, e.point, e.display_id AS displayId, l.name AS labelName, (SELECT COUNT(1) FROM experiments WHERE ${query}) AS total
    FROM experiments e LEFT JOIN label l ON e.label=l.id
    WHERE ${query} ORDER BY e.display_id`
    sql += ` LIMIT 20 OFFSET ${offset}`
    let res = await db.query(sql, { raw: true })
    let experiments = res[0]
    let experimentIds = []
    experiments.map((item) => {
      experimentIds.push(item.id)
      item.result = -2
    })
    let sql2 = `SELECT experiment_id, result
    FROM experiment_submit
    WHERE experiment_id in (${experimentIds}) AND user_id = ${data.userId} AND result = 0`
    let hasSubmitted = await db.query(sql2, { raw: true })
    let sql3 = `SELECT COUNT(1) AS submitNum, experiment_id
    FROM experiment_submit GROUP BY experiment_id
    HAVING experiment_id in (${experimentIds})
    UNION
    SELECT COUNT(1) AS AC, experiment_id FROM experiment_submit WHERE experiment_id in (${experimentIds}) AND result = 0 GROUP BY experiment_id`
    let resNum = await db.query(sql3, { raw: true })
    resNum = resNum[0]
    let x = 0
    experiments.map((item) => {
      item.result = -2
      let submitNum = 0
      let ACNum = 0
      let ACRate = 0.0
      item.submitNum = submitNum
      item.ACRate = (ACRate * 100).toString() + '%'
      for (let i = 0; i < resNum.length / 2; i++) {
        if (resNum[i].experiment_id === undefined) {
          continue
        } else if (item.id === resNum[i].experiment_id) {
          submitNum = resNum[i].submitNum
          ACNum = resNum[resNum.length / 2 + i].submitNum
          ACRate = 0
          if (ACNum !== 0) {
            ACRate = (ACNum * 100 / submitNum).toFixed(1)
          }
          item.submitNum = submitNum
          item.ACRate = ACRate.toString() + '%'
        } else {
          item.submitNum = submitNum
          item.ACRate = ACRate.toString() + '%'
        }
      }
      hasSubmitted[0].map((item2) => {
        if (item2.experiment_id === item.id) {
          item.result = item2.result
        }
      })
    })
    return experiments
  }

}

Experiment.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 题目id
  displayId: {
    type: Sequelize.INTEGER,
    unique: true
  },
  // 题目分值
  point: {
    type: Sequelize.INTEGER,
    defaultValue: 100
  },
  // 题目名称
  title: Sequelize.STRING(255),
  // 题目描述
  content: Sequelize.TEXT,
  // 输入描述
  inputDesc: Sequelize.TEXT,
  // 输出描述
  outputDesc: Sequelize.TEXT,
  // 输入样例
  inputSample: Sequelize.STRING(255),
  // 输出样例
  outputSample: Sequelize.STRING(255),
  // 提示信息
  hint: Sequelize.STRING(255),
  // 创作者ID FK(user_id)
  editorId: Sequelize.INTEGER,
  // 使用语言 用逗号分割 c,cpp,java,py3
  language: Sequelize.STRING(64),
  // 最大CPU占用时间
  maxCpuTime: Sequelize.INTEGER,
  // 最大运行内存
  maxMemory: Sequelize.INTEGER,
  // 题目类型 1-常规题 2-模板填空
  type: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  // 模板
  template: Sequelize.TEXT,
  // 难度 1-简单 2-中等 3-困难
  difficulty: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  // 题目状态 0-弃用 1-学生可见 2-学生不可见
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 2
  },
  // 题目标签 FK(label_id) 所属标签 逗号连接 1，2，3
  label: Sequelize.STRING(255),
}, {
  sequelize: db,
  tableName: 'experiments'
})

module.exports = { Experiment }
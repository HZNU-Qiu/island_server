const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class University extends Model {
  /**
   * 创建学校
   */
  static async add(name) {
    return await University.create({
      ...name
    })
  }

  /**
   * 编辑学校信息
   */
  static async modify(id, name) {
    return await this.update({
      name: name
    }, {
      where: {
        id: id
      }
    })
  }

  /**
   * 展示所有院校树
   */
  static async getTree() {
    let universitys = await db.query(`SELECT id AS selfId,name AS label FROM university;`, { raw: true })
    universitys = universitys[0]
    let schools = await db.query(`SELECT id AS selfId,name AS label,university_id AS parentId FROM school WHERE status=1`, { raw: true })
    schools = schools[0]
    let departments = await db.query(`SELECT id AS selfId,name AS label,school_id AS parentId FROM department WHERE status=1`, { raw: true })
    departments = departments[0]
    let majors = await db.query(`SELECT id AS selfId,name AS label,department_id AS parentId FROM major WHERE status=1`, { raw: true })
    majors = majors[0]
    let classrooms = await db.query('SELECT id AS selfId,name AS label,major_id AS parentId FROM class WHERE status=1', { raw: true })
    classrooms = classrooms[0]
    majors.map((major) => {
      major.rank = 4
      major.children = []
      classrooms.map((classroom) => {
        if (major.selfId === classroom.parentId) {
          classroom.id = 500000 + classroom.selfId
          classroom.value = classroom.selfId
          classroom.rank = 5
          major.children.push(classroom)
        }
      })
    })
    departments.map((department) => {
      department.rank = 3
      department.children = []
      majors.map((major) => {
        if (major.parentId === department.selfId) {
          major.id = 40000 + major.selfId
          major.value = major.selfId
          department.children.push(major)
        }
      })
    })
    schools.map((school) => {
      school.rank = 2
      school.children = []
      departments.map((department) => {
        if (department.parentId === school.selfId) {
          department.id = 3000 + department.selfId
          department.value = department.selfId
          school.children.push(department)
        }
      })
    })
    universitys.map((university) => {
      university.rank = 1
      university.children = []
      university.value = university.selfId
      schools.map((school) => {
        if (school.parentId === university.selfId) {
          school.id = 200 + school.selfId
          school.value = school.selfId
          university.children.push(school)
        }
      })
    })
    return universitys
  }

  /**
   * 展示所有院校树2教师用
   */
  static async getTree2() {
    let universitys = await db.query(`SELECT id AS selfId,name AS label FROM university;`, { raw: true })
    universitys = universitys[0]
    let schools = await db.query(`SELECT id AS selfId,name AS label,university_id AS parentId FROM school WHERE status=1`, { raw: true })
    schools = schools[0]
    let departments = await db.query(`SELECT id AS selfId,name AS label,school_id AS parentId FROM department WHERE status=1`, { raw: true })
    departments = departments[0]
    schools.map((school) => {
      school.rank = 2
      school.children = []
      departments.map((department) => {
        if (department.parentId === school.selfId) {
          department.id = 3000 + department.selfId
          department.value = department.selfId
          school.children.push(department)
        }
      })
    })
    universitys.map((university) => {
      university.rank = 1
      university.children = []
      university.value = university.selfId
      schools.map((school) => {
        if (school.parentId === university.selfId) {
          school.id = 200 + school.selfId
          school.value = school.selfId
          university.children.push(school)
        }
      })
    })
    return universitys
  }

  /**
   * 删除学校信息
   * @param id 学校id
   * 待完成！！！
   */
  static async kill(id) {

  }
}

University.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 学校名称
  name: Sequelize.STRING(64),
  acronym: Sequelize.STRING(32)
}, {
  sequelize: db,
  tableName: 'university'
})

module.exports = { University }

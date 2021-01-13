const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class University extends Model {

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

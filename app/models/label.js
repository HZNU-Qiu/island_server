const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Label extends Model {

}

Label.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 标签名称
  name: Sequelize.STRING(64)
}, {
  sequelize: db,
  tableName: 'label'
})

module.exports = { Label }
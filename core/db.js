const Sequelize = require('sequelize')

const {
  dbName,
  host,
  port,
  username,
  password
} = require('../config/config').database

const { Model } = require('sequelize')
const { unset, clone, isArray } = require('lodash')
const db = new Sequelize(dbName, username, password, {
  dialect: 'mysql',
  host,
  port,
  // 每次操作是否显示SQL细节
  logging: false,
  timezone: '+08:00',
  define: {
    timestamps: true,
    paranoid: true,
    // 自动将驼峰转下划线
    underscored: true,
    scopes: {
      noTS: {
        attributes: {
          exclude: ['updatedAt', 'deletedAt', 'createdAt']
        }
      }
    }
  }
})

db.sync({
  force: true
})

/**
 * 全局:返回的时候删除三个时间戳
 * 功能简单粗暴单一
 */
Model.prototype.toJSON = function () {
  let data = clone(this.dataValues)
  unset(data, 'updatedAt')
  unset(data, 'createdAt')
  unset(data, 'deletedAt')

  for (let key in data) {
    if (key === 'image') {
      data[key] = global.config.host + data[key]
    }
  }

  // 待删除字段
  if (isArray(this.exclude)) {
    this.exclude.forEach(val => {
      unset(data, val)
    })
  }

  return data
}

module.exports = {
  db
}
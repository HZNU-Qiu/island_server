const judgeConfig = require('./judge-config')

module.exports = {
  // 项目环境：dev|prod
  environment: 'dev',

  // 数据库配置
  database: {
    dbName: 'island_dev',
    host: '120.27.247.78',
    port: '3306',
    username: 'root',
    password: '123456',
  },
  security: {
    secretKey: 'abcdefg',        // 秘钥
    expiresIn: 60 * 60 * 24 * 30,   // 令牌过期时间 一个月
  },
  judge_server_url: 'http://120.27.247.78:8001/judge',
  judge_header: {
    'X-Judge-Server-Token': '9c53f96fd584d25e2f61787076590f299c082fba8a4157fb190ba0dc8cca5759',
    'Content-Type': 'application/json'
  },
  judge_config: judgeConfig,
  test_case_dir: '/root/OnlineJudgeDeploy/data/backend/test_case/' // 测试用例保存目录
}
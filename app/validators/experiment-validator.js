const { LinValidator, Rule } = require('../../core/lin-validator')
const { Experiment } = require('../models/experiments')

class AddExperimentValidator extends LinValidator {
  constructor() {
    super()
    this.displayId = [
      new Rule('isLength', '要在1000-9999之间', { min: 4, max: 4 })
    ]
  }
  async validateIdAndTitle(vals) {
    let displayId = vals.body.displayId;
    let title = vals.body.title;
    let idErr = await Experiment.findOne({
      where: {
        display_id: displayId,
      }
    })
    let titleErr = await Experiment.findOne({
      where: {
        title
      }
    })
    if (idErr) {
      throw new Error("displayId冲突")
    }
    if (titleErr) {
      throw new Error("实验标题冲突")
    }
  }
}

class ModifyExperimentValidator extends LinValidator {
  constructor() {
    super()
    this.displayId = [
      new Rule('isLength', '要在1000-9999之间', { min: 4, max: 4 })
    ]
  }
  async validateTitle(vals) {
    let title = vals.body.title;
    let id = vals.body.id
    const { Sequelize } = require('sequelize')
    const Op = Sequelize.Op
    let exper = await Experiment.findOne({
      where: {
        title,
        id: {
          [Op.ne]: id
        }
      }
    })
    if (exper) {
      throw new Error("标题重复")
    }
  }
}

module.exports = {
  AddExperimentValidator,
  ModifyExperimentValidator,

}
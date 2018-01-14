import sequelize from '../sequelize';

import UserModel from './UserModel';
import TeamModel from './TeamModel';
import UserTeamModel from './UserTeamModel';
import PostModel from './PostModel';

// https://stackoverflow.com/questions/22958683/how-to-implement-many-to-many-association-in-sequelize

UserModel.belongsToMany( TeamModel, {
  through: UserTeamModel, //this can be string or a model,
  foreignKey: {
    name:'userId',
    field:'user_id'
  }
});
TeamModel.belongsToMany(UserModel, {
  through: UserTeamModel,
  foreignKey: {
    name:'teamId',
    field:'team_id'
  }
});
TeamModel.hasMany(PostModel,{
  foreignKey: {
    name:'teamId',
    field:'team_id'
  }
});
PostModel.belongsTo(TeamModel,{
  foreignKey: {
    name:'teamId',
    field:'team_id'
  }
});

function sync(...args) {
  return sequelize.sync(...args);
}

export { UserModel, TeamModel, UserTeamModel, PostModel };
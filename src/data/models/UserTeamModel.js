import sequelize from '../sequelize';
import DataTypes from 'sequelize';

const UserTeamModel = sequelize.define('user_has_team', {
  user_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'user',
      key: 'id'
    }
  },
  team_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'team',
      key: 'id'
    }
  }
}, {
  tableName: 'user_has_team'
});

export default UserTeamModel;
import sequelize from '../sequelize';
import DataTypes from 'sequelize';

const PostModel = sequelize.define('post', {
  id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  team_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    references: {
      model: 'team',
      key: 'id'
    }
  },
  author: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  desc: {
    type: DataTypes.STRING(300),
    allowNull: true
  },
  zindex: {
    type: DataTypes.INTEGER(11),
    allowNull: false
  },
  positionx: {
    type: DataTypes.INTEGER(11),
    allowNull: false
  },
  positiony: {
    type: DataTypes.INTEGER(11),
    allowNull: false
  },
  height: {
    type: DataTypes.INTEGER(11),
    allowNull: false
  },
  width: {
    type: DataTypes.INTEGER(11),
    allowNull: false
  },
  status: {
    type: DataTypes.INTEGER(2),
    allowNull: false
  },
  color: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  updatetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  },
  createtime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  tableName: 'post'
});

export default PostModel;

import sequelize from '../sequelize';
import DataTypes from 'sequelize';

const UserModel = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(128),
    allowNull: false
  },
  role: {
    type: DataTypes.INTEGER(2).UNSIGNED.ZEROFILL,
    allowNull: false
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
  tableName: 'user'
});

export default UserModel;

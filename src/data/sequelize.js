import Sequelize from 'sequelize';
const sequelize = new Sequelize('team_topic', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  timezone : '+08:00',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: false
  },
  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false
});

export default sequelize;

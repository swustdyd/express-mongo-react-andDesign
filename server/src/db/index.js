import Sequelize from 'sequelize'

export const db = new Sequelize('test', 'root', 'DD89757000', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: (sqlString) => {
        console.log(sqlString);
    },
    define: {        
        // 禁用修改表名; 默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数。 如果你不想这样，请设置以下内容
        freezeTableName: true,
        timestamps: false
    }
});

export const {DataTypes} = Sequelize;

export const modelSyncOptions = {    
    // force: true 如果表已经存在，将会丢弃表
    force: false,
    // Alters tables to fit models. Not recommended for production use. 
    // Deletes data in columns that were removed or had their type changed in the model.
    alter: true
}
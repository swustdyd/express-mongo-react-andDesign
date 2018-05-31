import mysql from 'mysql'

class MysqlDB {
    constructor(){        
        this._connection = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : 'DD89757000',
            database : 'test'
        });

        this._connection.connect((err) => {
            if(err){
                throw err;
            }
        });
    }

    /**
     * mysql查询方法
     * @param {*} sql sql语句
     */
    query(sql: string){
        return new Promise((resolve, reject) => {
            this._connection.query(sql, (err, results) => {
                if(err){
                    reject(err);
                }
                resolve(results);
            })
        })
    }

    /**
     * mysql插入单个数据
     * @param {*} tableName 表名
     * @param {*} data 数据
     */
    insertOne(tableName: string, data: {}){
        return this.insertArray(tableName, [data]);
    }

    /**
     * mysql批量插入数据
     * @param {*} tableName 表名
     * @param {*} datas 数据
     */
    insertArray(tableName: string, datas: []) {
        return new Promise((resolve, reject) => {
            try {                
                const propertyNames = [];
                for(const key in datas[0]){
                    propertyNames.push(key);
                }
                const values = [];
                datas.forEach((item) => {
                    const valueArray = []
                    for(const key in item){
                        valueArray.push(item[key]);
                    }
                    values.push(`(${JSON.stringify(valueArray).replace(/"/g, '\'').replace(/[\[\]]/g, '')})`);
                })
                const sql = `insert into ${tableName}(${propertyNames.join(',')}) values ${values.join(',')};`;
                this._connection.query(sql, (err, results) => {
                    if(err){
                        reject(err);
                    }
                    resolve(results);
                })
            } catch (error) {
                reject(error);
            }
        })
    }

    /**
     * 开启事务
     * @param {*} callback 需要执行的事务
     */
    beginTransaction(callback: (connection: mysql.Connection) => {}){
        return new Promise((resolve, reject) => {
            this._connection.beginTransaction(async (err) => {
                if(err){
                    reject(err);
                }
                resolve(await callback(this._connection));
            })
        })    
    }
}

export default new MysqlDB();
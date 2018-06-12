import fs from 'fs'
import Sequelize from 'sequelize'
import path from 'path'
import logger from '../common/logger'
import {sequelize, modelSyncOptions} from './sequelize'
import Condition from './condition';


export const db = sequelize;
db.Sequelize = Sequelize;

/**
 * 根据条件统计
 * @param {*} condition 搜索的条件 
 */
async function count(condition: Condition){
    let countFiledString = '*';
    if(condition.distinct && condition.distinctFileds.length > 0){
        countFiledString = `distinct ${condition.distinctFileds.join(', ')}`;
    }
    const whereString = condition._parseWhere();
    const joinString = condition._parseJoins();
    const orderString = condition._parseOrder();
    const sql = `select count(${countFiledString}) as total from ${condition.tableName}${joinString ? ` ${joinString}` : ''}${whereString ? ` ${whereString}` : ''}${orderString ? ` ${orderString}` : ''}`
    const result =  await db.query(sql, {type: db.QueryTypes.SELECT});
    return result[0].total;
}
db.count = count;
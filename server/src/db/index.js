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
    const tmpFileds = JSON.stringify(condition.fileds);
    let countFiledString = '*';
    if(condition.distinct && condition.distinctFileds.length > 0){
        countFiledString = `distinct ${condition.distinctFileds.join(', ')}`;
    }
    condition.fileds = [{name: `count(${countFiledString})`, as: 'total'}];
    const result =  await db.query(condition.toSql(), {type: db.QueryTypes.SELECT});
    condition.fileds = JSON.parse(tmpFileds);
    return result[0].total;
}
db.count = count;
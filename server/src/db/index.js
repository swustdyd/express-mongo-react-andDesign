import fs from 'fs'
import path from 'path'
import logger from '../common/logger'
import {sequelize, modelSyncOptions} from './sequelize'

// fs.readdirSync(path.resolve(__dirname, '../models')).filter((file) => {
//     return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
// }).forEach((file) => {
//     const model = require(path.resolve(__dirname, `../models/${file}`));
//     sequelize.models[model.name] = model;
// })

// //执行更新数据库结构操作

// const isDev = process.env.NODE_ENV !== 'production';
// isDev && sequelize.sync({
//     // force: true 如果表已经存在，将会丢弃表
//     force: false,
//     // Alters tables to fit models. Not recommended for production use. 
//     // Deletes data in columns that were removed or had their type changed in the model.
//     alter: true
// });
export const db = sequelize;
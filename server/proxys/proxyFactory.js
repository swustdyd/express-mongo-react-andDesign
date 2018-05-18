import $ from 'cheerio'
import request from 'request-promise-native'
import Proxy from '../models/proxy'
import logger from '../common/logger'
import PublicFunction from '../common/publicFunc'

type ProxyType = {
    country: string,
    ip: string,
    port: number,
    protocol: string,
    speed: number,
    connectTime: number
}

/**
 * 集合了个各种代理的生产
 */
export default class ProxyFactory{
    /**
     * 解析国内高匿http代理信息，将其有效数据存储到数据库
     */
    async createxicidaili(){        
        try {        
            for (let i = 1; i <= 30; i++) {                
                const resData = await request.get(`http://www.xicidaili.com/nn/${i}`);
                const proxys = this._parsexicidaili($.load(resData));
                for (let j = 0; j < proxys.length; j++) {
                    const proxy = proxys[j];
                    const proxyUrl = `${proxy.protocol}://${proxy.ip}:${proxy.port}`;
                    const searchResults = await Proxy.find({ip: proxy.ip, port: proxy.port});
                    //数据库中不存在，进行验证并保存到数据库中
                    if(searchResults.length < 1){
                        if(await this.checkProxy(proxyUrl)){                    
                            const proxyModel = new Proxy(proxy);
                            await proxyModel.save();
                        }
                    }else{
                        console.log(`数据库已存在proxy: ${proxyUrl}`);
                    }
                }
            }
        } catch (error) {
            console.log(error);
            logger.error(error);
        }
    }

    /**
     * 检验代理是否有效
     * @param {*} proxy
     */
    async checkProxy(proxy: ProxyType) : boolean{
        let result = true;
        try {            
            const {statusCode} = await request({
                method: 'GET',
                url: 'http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js',
                resolveWithFullResponse: true,
                proxy: proxy,
                timeout: 5000
            })
            if(statusCode !== 200){
                console.log(`无效代理: ${proxy}`);
                result = false;
            }else{                
                console.log(`有效代理: ${proxy}`);
            }
        } catch (error) {
            console.log(`无效代理: ${proxy}`);
            logger.error(error);
            result = false;
        }
        return false;
    }

    /**
     * 解析国内高匿http代理信息
     * @param {*} $ 加载好的cheerio document
     */
    _parsexicidaili(document) : ProxyType[]{
        const trs = document('#ip_list').find('tbody>tr');
        const proxys = [];
        trs.map((index, trItem) => {
            //去除第一行的title
            if(index !== 0){            
                const tds = $(trItem).children('td');
                const proxyItem = {};
                tds.map((index, tdItem) => {
                    switch(index){
                        case 0:
                            proxyItem.country = $(tdItem).find('img').attr('alt')
                            break;
                        case 1:
                            proxyItem.ip = $(tdItem).text().trim()
                            break;
                        case 2:
                            proxyItem.port = $(tdItem).text().trim()
                            break;
                        case 5:
                            proxyItem.protocol = $(tdItem).text().trim().toLowerCase()
                            break;
                        case 6:
                            const speedMatch = $(tdItem).children('div').attr('title').match(/\d+.?\d+/);
                            proxyItem.speed = speedMatch ? speedMatch[0] : '';
                            break;
                        case 7:
                            const connectTimeMatch = $(tdItem).children('div').attr('title').match(/\d+.?\d+/);
                            proxyItem.connectTime = connectTimeMatch ? connectTimeMatch[0] : '';
                        default:
                            break;
                    }
                })
                proxys.push(proxyItem);
            }
        });
        return proxys;
    }
}
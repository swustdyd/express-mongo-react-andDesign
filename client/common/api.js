/**
 * Created by Aaron on 2018/5/3.
 */
import baseConfig from '../../baseConfig'
console.log('set server api');
let api = {
    checkLogin: 'user/checkLogin',
    getMovies: 'movie/getMovies'
};

for(let key in api){
    api[key] = `${baseConfig.serverHost}:${baseConfig.serverPort}/${api[key]}`;
}

export default api;
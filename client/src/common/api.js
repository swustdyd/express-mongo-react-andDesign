/**
 * Created by Aaron on 2018/5/3.
 */
import baseConfig from '../../../baseConfig'

const api = {
    checkLogin: 'user/checkLogin',
    getMovies: 'movie/getMovies',
    postComment: 'comment/commit',
    getComment: 'comment/getComment',
    cutImg: 'util/cutImg',
    newOrUpdateMovie: 'movie/newOrUpdate',
    deleteMovie: 'movie/delete',
    uploadPoster: 'movie/uploadPoster',
    getMoviesByGroup: 'movie/getMoviesByGroup',
    signup: 'user/signup',
    signin: 'user/signin',
    logout: 'user/logout',
    getUsers: 'user/getUsers',
    updatePwd: 'user/updatePwd',
    deleteUser: 'user/delete',
    editUser: 'user/edit',
    uploadIcon: 'user/uploadIcon',
    getDoubanMovies: 'movie/getDoubanMovies',
    getGroupInfoOfDouban: 'movie/getGroupInfoOfDouban',
    getLanguage: 'movie/getLanguage'
};

for(const key in api){
    api[key] = `${baseConfig.serverHost}:${baseConfig.serverPort}/${api[key]}`;
}

export default api;
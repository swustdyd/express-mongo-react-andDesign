import express from 'express'
import MovieController from './controller/movieController'
import UserController from './controller/userController'
import CommentController from './controller/commentController'
import UtilController from './controller/utilController'

const movieController = new MovieController();
const userController = new UserController();
const commentController = new CommentController();
const utilController = new UtilController();

/**
 * app路由配置
 */
const router = express.Router();

/**
 * 根目录重定向到index.html
 */
router.get('/', (req, res) => {
    res.redirect('/dist/index.html');
});

//movie模块路由配置
router.get('/movie/getMovies', movieController.getMovies.bind(movieController));
router.post('/movie/newOrUpdate', movieController.newOrUpdate.bind(movieController));
router.get('/movie/delete', movieController.delete.bind(movieController));
router.post('/movie/uploadPoster', movieController.uploadPoster.bind(movieController));
router.get('/movie/getMoviesByGroup', movieController.getMoviesByGroup.bind(movieController));

//user模块路由配置
router.post('/user/signup', userController.signup.bind(userController));
router.post('/user/signin', userController.signin.bind(userController));
router.get('/user/logout', userController.logout.bind(userController));
router.get('/user/getUsers', userController.getUsers.bind(userController));
router.get('/user/checkLogin', userController.checkLogin.bind(userController));
router.post('/user/updatePwd', userController.updatePwd.bind(userController));
router.get('/user/delete', userController.delete.bind(userController));
router.post('/user/edit', userController.edit.bind(userController));
router.post('/user/uploadIcon', userController.uploadIcon.bind(userController));

//comment模块路由配置
router.post('/comment/commit', commentController.commitComment.bind(commentController))
router.get('/comment/getComment/:id', commentController.getCommentByMovieId.bind(commentController))

//util模块路由配置
router.post('/util/cutImg', utilController.cutImg.bind(utilController));

export default router;
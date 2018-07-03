/**
 * Created by Aaron on 2018/3/2.
 */
import './common/polyfill';
import React from 'react'
import Cookies from 'js-cookie'
import { HashRouter, Route } from 'react-router-dom'
import ReactDom from 'react-dom'
import HMFLayout from './common/hmfLayout'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import Thunk from 'redux-thunk'
import Logger from 'redux-logger'
import AppReducer from './reducers/app'
import Modal from './containers/common/customModal'
import IndexPage from './containers/index/index'
import Nav from './common/nav'
import Footer from './common/footer'
import { asyncComponent } from './components/asyncComponent'
import RouterAnimation from './components/routerAnimation'
import RouterWithConfigTest from './containers/routerWithConfigTest'

//异步引用moviePage模块
const MoviePage = asyncComponent(() => { return import('./containers/movie/moviePage')})

//异步引用userPage模块
const UserPage = asyncComponent(() => { return import('./containers/user/userPage')})

import './app.scss'

const middleware = [];
middleware.push(Thunk);
if(__DEV__){
    middleware.push(Logger);
}

const store = createStore(
    AppReducer,
    applyMiddleware(...middleware)
);

const _customFetch = window.fetch;

window.ajax = (url, options = {}) => {
    options.headers = options.headers || {};
    //默认带上cookie
    options.credentials = 'include';
    return fetch(url, options)
}

ReactDom.render(
    <Provider store={store}>
        <HashRouter>          
            <HMFLayout
                header={Nav}
                content={
                    <RouterAnimation>
                        <Route exact path="/" component={IndexPage}/>
                        <Route path="/moviePage" component={MoviePage}/>
                        <Route path="/userPage" component={UserPage}/>
                        <Route path="/routerTest" component={RouterWithConfigTest}/>
                    </RouterAnimation>
                }
                footer={Footer}
            >
                <Modal />
            </HMFLayout>
        </HashRouter>
    </Provider>,
    document.getElementById('app')
);

if (module.hot) {
    module.hot.accept('./app.js', function() {
        console.log('Accepting the updated app module!');
    })
}

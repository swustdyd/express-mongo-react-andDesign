import BusinessException from './businessException'
import errorCode from './errorCode'

const role = {
    normal: 0,
    admin: 10,
    superAdmin: 50
};

export const log = () => {
    return (target, name, descriptor) => {
        const oldValue = descriptor.value;
        descriptor.value = function() {
            console.log('*********\n', '日志打印', target.constructor.name, name, '\n*********');
            oldValue.apply(this, arguments);
        };

        return descriptor;
    }
}

/**
 * controller方法执行之前
 * @param {*} action 执行的方法
 */
export const before = (action: (req, res) => {}) => {
    return (target, name, descriptor) => {
        const oldValue = descriptor.value;
    
        descriptor.value = function() {
            if(action){
                const [req, res] = arguments;
                action(req, res);
            }
            oldValue.apply(this, arguments);
        };
    
        return descriptor;
    }
}

/**
 * controller方法执行之后
 * @param {*} action 执行的方法
 */
export const after = (action: (req, res) => {}) => {
    return (target, name, descriptor) => {
        const oldValue = descriptor.value;
        descriptor.value = function() {
            oldValue.apply(this, arguments);
            if(action){
                const [req, res] = arguments;
                action(req, res);
            }
        };
    
        return descriptor;
    }
}

/**
 * 需要用户登录
 */
export const requestSignin = () => {
    return (target, name, descriptor) => {
        const oldValue = descriptor.value;
        descriptor.value = function() {
            const [req, res, next] = arguments;
            const {user} = req.session;
            if(!user){
                next(new BusinessException('请登录', errorCode.requestSignin));
            }else{                
                oldValue.apply(this, arguments);
            }  
        };
    
        return descriptor;
    }
}

/**
 * 需要普通管理员权限
 */
export const requestAdmin = () => {
    return (target, name, descriptor) => {
        const oldValue = descriptor.value;
        descriptor.value = function() {
            const [req, res, next] = arguments;
            const {user} = req.session;
            if(!user || user.role < role['admin']){
                next(new BusinessException('需要管理员权限', errorCode.requestAdmin));
            }else{               
                oldValue.apply(this, arguments);
            }  
        };
    
        return descriptor;
    }
}

/**
 * 需要超级管理员权限
 */
export const requestSuperAdmin = () => {
    return (target, name, descriptor) => {
        const oldValue = descriptor.value;
        descriptor.value = function() {
            const [req, res, next] = arguments;
            const {user} = req.session;
            if(!user || user.role < role['superAdmin']){
                next(new BusinessException('需要超级管理员权限', errorCode.requestSuperAdmin));
            }else{            
                oldValue.apply(this, arguments);
            }  
        };
    
        return descriptor;
    }
}

export const Method = {
    GET: 'get',
    POST: 'post'
}

export const controller = (basePath: string) => {
    return (target) => {
        target.prototype._isController = true;
        target.prototype._basePath = basePath || '';
    }
}

export const route = (path: string, method: string = Method.GET) => {
    return (target, name, descriptor) => {
        if(typeof target[name] !== 'function'){
            throw `${target.constructor.name}.${name} must be function`;
        }

        target._routes = target._routes || [];
        target._routes.push({
            path,
            method,
            fnName: name
        });

        return descriptor;
    }
}
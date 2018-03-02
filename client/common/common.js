export default {
    getHashPath : (href) => {
        let paths = [];
        if(href){
            let index = href.indexOf('#/');
            href = href.substr(index + 1);
            paths = href.split('/');
            paths.splice(0, 1);
        }
        return paths;
    }
}


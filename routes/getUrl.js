exports.sundry = function(req, res, next){
    //1.根据请求url选中顶部,侧边菜单
    res.locals.activeNav = function(nav){
        var result = '';
        if(nav == '/'){
            if(req.path == '/'){
                result = 'active';
            }
        }else{
            if(req.path.indexOf(nav) == 0){
                result = 'active';
            }
        }
        return result;
    };
    next();
};

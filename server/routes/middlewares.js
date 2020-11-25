// passport는 req 객체에 isAuthenticated 메서드를 추가함
// 로그인 여부를 확인할 수 있음

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.user = req.user;
        next();
    } else {
        // res.status(403).json({
        //     isAuth: false,
        //     error: true,
        // })
        res.status(200).json({
            isAuth: false,
            error: true,
        })
    }
}

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
}
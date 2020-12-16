// passport.js 모듈을 통해서 req 객체에 req.user로 로그인된 유저 데이터가 들어감
// isAuthenticated() 메소드로 유저의 로그인 여부를 체크 가능

exports.isLoggedIn = (req, res, next) => {
	// 로그인상태라면 그대로
	if (req.isAuthenticated()) {
		req.user = req.user;
		next();
	} else {
		res.json({
				isAuth: false,
				error: true,
		})
	}
}

// 미로그인 상태라면
exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
}
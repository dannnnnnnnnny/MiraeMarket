// passport.js 모듈의 serializeUser, deserializeUser를
// 이용해서 req 객체에 req.user로 로그인된 유저 데이터가 들어감
// req.isAuthenticated() 메소드로 유저의 로그인 여부를 체크 가능

// 로그인상태라면 통과
exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		req.user = req.user;	
		// isLoggedIn 미들웨어를 통과한 router는 req.user로 유저 정보 사용 가능
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
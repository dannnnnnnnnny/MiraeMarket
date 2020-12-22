const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models/User');

module.exports = (passport) => {
	passport.use(
		new LocalStrategy(
			{
				// local 전략 (우리가 사용할 로그인 정보는 email, password)
				usernameField: 'email',
				passwordField: 'password',
				session: true, // 세션에 저장 여부
				passReqToCallback: false,
			},
			(email, password, done) => {
				User.findOne({ email }, (error, user) => {
					if (error) return done(error); // 서버 에러 처리
					if (!user)
						return done(null, false, { message: '존재하지 않는 아이디입니다' }); // 존재하지 않는 ID 에러 처리
					return user.comparePassword(password, (error, isMatch) => {
						if (error) return done(error);
						if (isMatch) {
							return done(null, user); // 검증 성공 (해당 유저 정보 반환)
						}
						return done(null, false, { message: '비밀번호가 틀렸습니다' }); // 비밀번호 틀림 에러 처리
					});
				});
			},
		),
	);
};

// 1) 로그인 성공시
// done(null, User);
// => passport.authenticate('local', (error, user, info) => {})
// error에 null, user에 User 대입

// 2) 로그인 실패시
// done(null, false, { message: "비밀번호 일치하지 않음"});
// => passport.authenticate('local', (error, user, info) => {})
// error에 null, user에 false, info에 JSON 형식 (error message) 대입

// 3) 서버 에러시
// done(error);
// passport.authenticate('local', (error, user, info) => {})
// error에 error 대입

// done이 호출된 이후에는 users route 에서 passport.authenticate 콜백 함수에서 나머지 로직 실행하여 로컬, 소셜 로그인 진행

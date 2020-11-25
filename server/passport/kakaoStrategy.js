const KakaoStrategy = require('passport-kakao').Strategy;
const KAKAO_ID = require('../config/dev').KAKAO_ID;
const { User } = require('../models/User');

module.exports = (passport) => {
	// 카카오에서 발급해주는 REST_API Key (id) (노출되지 않아야 하므로 process.env.KAKAO_ID로 설정)
	// callbackURL은 카카오로부터 인증 결과를 받을 라우터 주소
	passport.use(
		new KakaoStrategy(
			{
				clientID: KAKAO_ID,
				callbackURL: 'http://localhost:5000/api/users/kakao/callback',
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					// console.log('kakao 프로필 : ', profile);
					// 카카오로 로그인한 사용자가 있는지 조회
					const exUser = await User.findOne({
						snsId: profile.id,
						provider: 'kakao',
					});
					if (exUser) {
						done(null, exUser);
					} else {
						// 없다면 회원가입
						// 카카오에서 인증 후 callbackURL에 적힌 주소로
						// accessToken, refreshToken과 profile을 보내줌
						// profile객체에서 원하는 정보를 꺼내와 회원가입 진행
						const newUser = new User({
							email: profile._json && profile._json.kaccount_email,
							name: profile.displayName,
							snsId: profile.id,
							provider: 'kakao',
						});

						newUser.save();

						done(null, newUser);
					}
				} catch (err) {
					console.error(err);
					done(err);
				}
			},
		),
	);
};

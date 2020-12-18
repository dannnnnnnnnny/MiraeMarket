const FBStrategy = require('passport-facebook').Strategy;
const { FACEBOOK_ID, FACEBOOK_SECRET } = require('../config/dev');
const { User } = require('../models/User');

// 페이스북 소셜로그인 passport.js
// 페이스북 개발자 센터에서 설정한 id, 시크릿키를 사용하고 콜백URL 설정
// 받아온 페이스북 프로필 데이터를 통해 가입된 유저인지 DB에서 찾아봄.
// 가입되어 있는 유저라면 그대로 해당 유저 데이터를 넘김
// 가입되어 있지 않은 유저라면 회원가입시키고 해당 유저 데이터를 넘김
 
module.exports = (passport) => {
	passport.use(
		new FBStrategy(
			{
				clientID: FACEBOOK_ID,
				clientSecret: FACEBOOK_SECRET,
				callbackURL: 'http://localhost:5000/api/users/facebook/callback',
				// callbackURL:
				// 	'https://mirae-market.herokuapp.com/api/users/facebook/callback',
			},
			async (req, accessToken, refreshToken, profile, done) => {
				try {
					// 받아온 facebook profile을 통해 이미 존재하는 유저인지 확인
					const exUser = await User.findOne({
						snsId: profile.id,
						provider: 'facebook',
					});
					// 있으면 그냥 로그인 진행
					if (exUser) {
						done(null, exUser);
					} else {
						// 없으면 회원가입 시킴
						const newUser = new User({
							email: 'Facebook' + profile.id,
							name: profile.displayName,
							snsId: profile.id,
							provider: profile.provider,
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

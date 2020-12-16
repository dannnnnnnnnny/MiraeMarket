const NaverStrategy = require('passport-naver').Strategy;
const { NAVER_ID, NAVER_CLIENT } = require('../config/dev');
const { User } = require('../models/User');

// 타 소셜로그인 로직과 동일함
module.exports = (passport) => {
	passport.use(
		new NaverStrategy(
			{
				clientID: NAVER_ID,
				clientSecret: NAVER_CLIENT,
				callbackURL: 'http://localhost:5000/api/users/naver/callback',
				// callbackURL:
				// 	'https://mirae-market.herokuapp.com/api/users/naver/callback',
			},
			async (req, accessToken, refreshToken, profile, done) => {
				try {
					// console.log('네이버 프로필 : ', profile);

					const exUser = await User.findOne({
						snsId: profile.id,
						provider: 'naver',
					});
					if (exUser) {
						done(null, exUser);
					} else {
						const newUser = new User({
							email: 'Naver' + profile.id,
							name: profile.displayName,
							snsId: profile.id,
							provider: 'naver',
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

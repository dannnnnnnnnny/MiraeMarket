const FBStrategy = require('passport-facebook').Strategy;
const { FACEBOOK_ID, FACEBOOK_SECRET } = require('../config/dev');
const { User } = require('../models/User');

module.exports = (passport) => {
	passport.use(
		new FBStrategy(
			{
				clientID: FACEBOOK_ID,
				clientSecret: FACEBOOK_SECRET,
				callbackURL: 'http://localhost:5000/api/users/facebook/callback',
			},
			async (req, accessToken, refreshToken, profile, done) => {
				try {
					// console.log('페북 프로필 : ', profile);
					const exUser = await User.findOne({
						snsId: profile.id,
						provider: 'facebook',
					});
					if (exUser) {
						done(null, exUser);
					} else {
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

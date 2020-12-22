const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// 이름, 이메일, 비밀번호, 전공, (일반유저, 관리자 구분 : 아직 관리자 따로 안만들긴 함), 거래목록, 핸드폰번호, 소셜로그인id, 소셜로그인 제공

const userSchema = mongoose.Schema({
	name: {
		type: String,
		maxlength: 50,
	},
	email: {
		type: String,
		trim: true,
		unique: 1,
	},
	password: {
		type: String,
		minglength: 5,
	},
	major: {
		type: String,
		default: '',
	},
	role: {				// 0: 일반 유저, 1: 관리자
		type: Number,
		default: 0,
	},
	cart: {
		type: Array,
		default: [],
	},
	phone: {
		type: String,
		default: '',
	},
	image: String,
	snsId: {
		type: String,
	},
	provider: {
		type: String,
	},
});

// user 데이터 save 이전(pre)에, bcrypt 모듈을 통해서 비밀번호를 해쉬함수로 암호화하는 로직
userSchema.pre('save', function (next) {
	var user = this;

	if (user.isModified('password')) {
		bcrypt.genSalt(saltRounds, function (err, salt) {
			if (err) return next(err);

			bcrypt.hash(user.password, salt, function (err, hash) {
				if (err) return next(err);
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

// 기존 비밀번호와 비교하는 로직
// bcrypt.compare는 두 패스워드를 해쉬함수를 통해 같은 해쉬를 가지는지 확인 (평문 password를 해쉬암호화하여 같은 해쉬값을 가지는지 체크)
userSchema.methods.comparePassword = function (plainPassword, cb) {
	bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

const User = mongoose.model('User', userSchema);

module.exports = { User };

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require('moment');

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

userSchema.pre('save', function (next) {
	var user = this;

	if (user.isModified('password')) {
		// console.log('password changed')
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

userSchema.methods.comparePassword = function (plainPassword, cb) {
	bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

// userSchema.methods.generateToken = function(cb) {
//     var user = this;
//     console.log('user',user)
//     console.log('userSchema', userSchema)
//     var token =  jwt.sign(user._id.toHexString(),'secret')
//     var oneHour = moment().add(1, 'hour').valueOf();

//     user.tokenExp = oneHour;
//     user.token = token;
//     user.save(function (err, user){
//         if(err) return cb(err)
//         cb(null, user);
//     })
// }

// userSchema.statics.findByToken = function (token, cb) {
//     var user = this;

//     jwt.verify(token,'secret',function(err, decode){
//         user.findOne({"_id":decode, "token":token}, function(err, user){
//             if(err) return cb(err);
//             cb(null, user);
//         })
//     })
// }

const User = mongoose.model('User', userSchema);

module.exports = { User };

const express = require('express');
const router = express.Router();
const { Chat } = require('../models/Chat');
const multer = require('multer');
const { isLoggedIn } = require('./middlewares');

router.get('/getChats', (req, res) => {
	Chat.find()
		.populate('sender')
		.exec((err, chats) => {
			if (err) return res.status(400).send(err);
			res.status(200).send(chats);
		});
});

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/chats/');
	},
	filename: function (req, file, cb) {
		cb(null, `chat_${file.originalname}_${Date.now()}`);
	},
});

var upload = multer({ storage: storage }).single('file');

router.post('/uploadfiles', isLoggedIn, (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			return res.json({ success: false, err });
		}
		return res.json({ success: true, url: res.req.file.path });
	});
});

module.exports = router;

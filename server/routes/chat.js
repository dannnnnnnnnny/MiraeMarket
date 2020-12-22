const express = require('express');
const router = express.Router();
const { Chat } = require('../models/Chat');
const multer = require('multer');
const { isLoggedIn } = require('./middlewares');

// 전체 채팅 기록 조회
// populate를 통해서 sender 유저 정보까지 모두 가져옴 (SQL join한 것 처럼)
router.get('/getChats', (req, res) => {
	Chat.find()
		.populate('sender')
		.exec((err, chats) => {
			if (err) return res.status(400).send(err);
			res.status(200).send(chats);
		});
});




/* 추후 Text 채팅이 아닌 image도 보내기 위한 설정 및 route  */

// multer를 통해 destination 경로에 이미지 파일을 filename 명으로 지정해서 저장
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/chats/');
	},
	filename: function (req, file, cb) {
		cb(null, `chat_${file.originalname}_${Date.now()}`);
	},
});

// single을 통해 파일 하나를 받는다고 선언함.
var upload = multer({ storage: storage }).single('file');

// isLoggedIn 미들웨어를 통해서 이미 로그인된 유저만 접근 가능하게 함
// 이미지 업로드 기능 수행 API
router.post('/uploadfiles', isLoggedIn, (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			return res.json({ success: false, err });
		}
		// success와 저장된 파일 경로 json 형식으로 리턴
		return res.json({ success: true, url: res.req.file.path });
	});
});

module.exports = router;

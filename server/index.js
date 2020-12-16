const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const session = require('express-session'); // 세션 설정
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { Chat } = require('./models/Chat');

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
	cors: {
		origin: [
			'http://localhost:3000', 
			// 'https://mirae-market.herokuapp.com'
		],
		methods: ['GET', 'POST'],
	},
});	// 채팅을 위한 socket io 서버 설정

// 소셜로그인 및 로컬로그인을 위한 passport 설정
const passport = require('passport');
const passportConfig = require('./passport');
passportConfig(passport);

// heroku 배포를 위해 개발 모드와 배포 모드 설정 구분
const config = require('./config/key');

const mongoose = require('mongoose');
const connect = mongoose
	.connect(config.mongoURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() => console.log('몽고DB 연결 성공'))
	.catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser('secret', { SameSite: 'Lex', Secure: true }));	// 쿠키 에러가 나길래 넣어놓음
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true })); // 세션 활성화
app.use(passport.initialize()); // passport 구동

// CORS 설정
app.use(
	cors({
		origin: [
			'http://localhost:3000',
			// 'https://mirae-market.herokuapp.com',
		],
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,	// 쿠키 허용
	}),
);

app.use(passport.session()); // passport 세션 연결

// 헤더 허용
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept',
	);
	next();
});

// 유저, 상품, 채팅, 베스트셀러, 댓글 router 설정
app.use('/api/users', require('./routes/users'));
app.use('/api/product', require('./routes/product'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/bestseller', require('./routes/bestseller'));
app.use('/api/comment', require('./routes/comment'));

// Input Chat Message 이벤트 발생시 (채팅 입력받았을 때) 처리
// 메시지와 글쓴이, 메시지 타입(text)를 받아서 채팅 collection에 저장함
// 저장 후 emit으로 이벤트를 다시 발생시켜 모든 사용자에게 채팅 데이터를 보냄
io.on('connection', (socket) => {
	socket.on('Input Chat Message', (msg) => {
		connect.then((db) => {
			try {
				let chat = new Chat({
					message: msg.chatMessage,
					sender: msg.userId,
					type: msg.type,
				});

				chat.save((err, doc) => {
					if (err) return res.json({ success: false, err });

					Chat.find({ _id: doc._id })
						.populate('sender')
						.exec((err, doc) => {
							return io.emit('Output Chat Message', doc);
						});
				});
			} catch (error) {
				console.error(error);
			}
		});
	});
});

// 이미지 파일을 저장할 업로드 경로
app.use('/uploads', express.static('uploads'));


// heroku 배포를 위한 설정
// if(process.env.NODE_ENV === "production") {
// 	app.use(express.static("client/build")); // static 파일 처리 주소
// 	app.get("*", (req, res) => {
// 		res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));	// 모든 경로를 위한 client index.html 경로 지정
// 	});
// }

// 서버 5000번 포트 사용
server.listen(process.env.PORT || 5000, () => {
	console.log(`서버 5000번 포트 이용 중`);
});

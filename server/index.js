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
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
});

const passport = require('passport');
const passportConfig = require('./passport');
passportConfig(passport);

const config = require('./config/key');

// const mongoose = require("mongoose");
// mongoose
//   .connect(config.mongoURI, { useNewUrlParser: true })
//   .then(() => console.log("DB connected"))
//   .catch(err => console.error(err));

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
app.use(cookieParser('secret', { SameSite: 'Lex', Secure: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true })); // 세션 활성화
app.use(passport.initialize()); // passport 구동

app.use(
	cors({
		origin: [
			'http://localhost:3000',
			'https://mirae-market.herokuapp.com',
		], // allow to server to accept request from different origin
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true, // allow session cookie from browser to pass through
	}),
);

app.use(passport.session()); // 세션 연결

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept',
	);
	next();
});

app.use('/api/users', require('./routes/users'));
app.use('/api/product', require('./routes/product'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/bestseller', require('./routes/bestseller'));
app.use('/api/comment', require('./routes/comment'));

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
	// socket.on('Upload Post', (type) => {
	// 		console.log("Upload Post socket");
	// 		return io.emit('Get Post Data', { success: true });
	// });
});

app.use('/uploads', express.static('uploads'));


// 배포를 위한 설정
if(process.env.NODE_ENV === "production") {
	app.use(express.static("client/build")); // static 파일 처리 주소
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));	// 모든 경로를 위한 client index.html 경로 지정
	});
}



server.listen(process.env.PORT || 5000, () => {
	console.log(`서버 5000번 포트 이용 중`);
});

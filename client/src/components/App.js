import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Auth from '../hoc/auth';
import MainPage from './views/MainPage';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import UploadProductPage from './views/UploadProductPage';
import DetailProductPage from './views/DetailProductPage';
import BookEditPage from './views/BookEditPage';
import MyPage from './views/MyPage';
import LogoutPage from './views/LogoutPage';
import MyPageEdit from './views/MyPage/MypageEdit';
import CartPage from './views/CartPage';
import ChatPage from './views/ChatPage';
import NavBar from './views/NavBar';
import Footer from './views/Footer';
import OtherUserPage from './views/OtherUserPage';

/* 
	High Order Component 고차 컴포넌트 (hoc)
	Auth hoc를 통해서 접근 제어
	true : 로그인한 유저만 접근 허용
	false : 미로그인 유저만 접근 허용
	null : 모두 이용 가능
*/
function App() {
	return (
		<React.Fragment>
			<NavBar />
			<div
				style={{
					paddingTop: '69px',
					minHeight: 'calc(100vh)',
					// backgroundColor: '#23272a',
				}}
			>
				<Switch>
					<Route exact path="/" component={Auth(MainPage, null)} />
					<Route exact path="/chat" component={Auth(ChatPage, true)} />
					<Route exact path="/login" component={Auth(LoginPage, false)} />
					<Route exact path="/register" component={Auth(RegisterPage, false)} />
					<Route
						exact
						path="/upload"
						component={Auth(UploadProductPage, true)}
					/>
					<Route
						exact
						path="/product/:productId"
						component={Auth(DetailProductPage, null)}
					/>
					<Route
						exact
						path="/product/:productId/edit"
						component={Auth(BookEditPage, true)}
					/>
					<Route exact path="/user/cart" component={Auth(CartPage, true)} />
					<Route exact path="/mypage" component={Auth(MyPage, true)} />
					<Route exact path="/edit" component={Auth(MyPageEdit, true)} />
					<Route
						exact
						path="/profile/:userId"
						component={Auth(OtherUserPage, true)}
					/>
					<Route exact path="/logout" component={Auth(LogoutPage, true)} />
				</Switch>
			</div>
			<Footer />
		</React.Fragment>
	);
}

export default App;

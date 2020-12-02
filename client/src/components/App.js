import 
	React 
	// ,{ Suspense } 
	from 'react';
import { Route, Switch } from 'react-router-dom';
import Auth from '../hoc/auth';

import LandingPage from './views/LandingPage/LandingPage.js';
import LoginPage from './views/LoginPage/LoginPage.js';
import RegisterPage from './views/RegisterPage/RegisterPage.js';
import UploadProductPage from './views/UploadProductPage/UploadProductPage.js';
import DetailProductPage from './views/DetailProductPage/DetailProductPage.js';
import BookEditPage from './views/BookEditPage/BookEditPage.js';
import MyPage from './views/MyPage/MyPage.js';
import LogoutPage from './views/LogoutPage/LogoutPage.js';
import MyPageEdit from './views/MyPage/MypageEdit.js';
import CartPage from './views/CartPage/CartPage.js';
import ChatPage from './views/ChatPage/ChatPage.js';
import NavBar from './views/NavBar/NavBar';
import Footer from './views/Footer/Footer';
import OtherUserPage from './views/OtherUserPage/OtherUserPage';

//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
	return (
		// <Suspense fallback={<div>Loading...</div>}>
		<React.Fragment>
			<NavBar />
			<div
				style={{
					paddingTop: '69px',
					// overflow: 'auto',
					// maxeight: '900px',
					minHeight: 'calc(100vh)',
					// backgroundColor: '#23272a',
				}}
			>
				<Switch>
					<Route exact path="/" component={Auth(LandingPage, null)} />
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
			{/* </Suspense> */}
		</React.Fragment>
	);
}

export default App;

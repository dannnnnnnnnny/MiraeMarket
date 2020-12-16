import React, { useState } from 'react';
import LeftMenu from './Sections/LeftMenu';
import RightMenu from './Sections/RightMenu';
import { Link } from 'react-router-dom';
import { Drawer, Button } from 'antd';
import './Sections/Navbar.css';
import { AlignRightOutlined } from '@ant-design/icons';

function NavBar() {
	const [visible, setVisible] = useState(false);

	const showDrawer = () => {
		setVisible(true);
	};

	const onClose = () => {
		setVisible(false);
	};

	return (
		<nav
			className="menu"
			style={{ position: 'fixed', zIndex: 5, width: '100%' }}
		>
			<div className="menu__logo">
				<Link to="/">
					{/* 미래장터로고 */}
					<img src="dongyang.png" alt="dongyang" style={{ width: '130px' }} />
				</Link>
			</div>
			<div className="menu__container" style={{ marginTop: '15px' }}>
				<div className="menu_left">
					<LeftMenu mode="horizontal" />
				</div>
				<div className="menu_rigth">
					<RightMenu mode="horizontal" />
				</div>
				
				<Button
					className="menu__mobile-button"
					type="primary"
					onClick={showDrawer}
				>
					<AlignRightOutlined />
				</Button>

				<Drawer
					title="간편 메뉴"
					placement="left"
					className="menu_drawer"
					closable={true}
					onClose={onClose}
					visible={visible}
				>
					<LeftMenu mode="inline" />
					<RightMenu mode="inline" />
				</Drawer>
			</div>
		</nav>
	);
}

export default NavBar;

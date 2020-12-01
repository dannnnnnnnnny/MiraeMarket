import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

function LeftMenu(props) {
	return (
		<Menu mode={props.mode}>
			{/* <Menu.Item key="home">
				<Link to="/">Home</Link>
			</Menu.Item> */}
			<Menu.Item key="chat">
				<Link to="/chat">시끌벅적</Link>
			</Menu.Item>
		</Menu>
	);
}

export default LeftMenu;

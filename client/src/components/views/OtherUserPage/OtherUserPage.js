import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { Avatar, Typography, Row, Col, Card } from 'antd';

function OtherUserPage(props) {
    const userId = props.match.params.userId;
    const [user, setUser] = useState({});
	const [userProduct, setUserProduct] = useState([]);

    console.log(userId);
	useEffect(() => {

		Axios.get(`https://mirae-market.herokuapp.com/api/users/userInfo?id=${userId}`)
        // Axios.get(`http://localhost:3000/api/users/userInfo?id=${userId}`)
            .then((response) => {
                console.log(response);
                if (response.data.success) {
                    console.log(response);
                    setUser(response.data.user);
                }
                else
                    alert('유저정보를 가져오지 못했습니다.')
			})
		Axios.get(`https://mirae-market.herokuapp.com/api/product/mypage?id=${userId}`).then(	
		// Axios.get(`http://localhost:3000/api/product/mypage?id=${userId}`).then(
			(response) => {
				if (response.data.success) {
					setUserProduct(response.data.Product);
				} else {
					alert('유저의 게시물을 가져오지 못했습니다.');
				}
			},
		);
	}, [userId]);

    console.log(user && user);
	const renderUserProducts = userProduct.map((product, index) => (
		<Col lg={6} md={8} sm={12} xs={24} key={index}>
			<Card
				bordered={false}
				headStyle={{
					width: '210px',
					Height: '270px',
				}}
				bodyStyle={{ width: '210px', height: '30px', fontSize: '13px' }}
				hoverable
				cover={
					<Link to={`/product/${product._id}`}>
						<img
							// src={`http://localhost:5000/${product.image[0]}`}
							src={`https://mirae-market.herokuapp.com/${product.image[0]}`}
							alt={product.title}
							style={{
								width: '210px',
								height: '270px',
							}}
						/>
					</Link>
				}
			>
				<Card.Meta
					title={product.title}
					description={
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<span>{product.price} 원</span>
							{/* <span>{product.writer.name}</span> */}
						</div>
					}
				/>
			</Card>
		</Col>
	));

	return (
		<div className="profile">
			{/* 자신 프로필 사진, 이름, 편집 버튼 등.. */}
			<div
				style={{ width: '100%', paddingLeft: '100px', paddingRight: '100px' }}
			>
				<div style={{ display: 'flex', marginTop: '70px' }}>
					<div style={{ marginLeft: '30px' }}>
						<Avatar
							size={180}
							icon={
								<img
									// src={`http://localhost:5000/${user && user.image}`}
									src={`https://mirae-market.herokuapp.com/${
										user && user.image
									}`}
									alt={user && user.image}
								/>
							}
						/>
					</div>
					<div style={{ marginLeft: '60px' }}>
						<Typography.Title level={2}>{user && user.name}</Typography.Title>
						{/* <Typography.Title level={3}></Typography.Title> */}
						<div style={{ display: 'flex', marginTop: '30px' }}>
							<div>
								<span style={{ fontWeight: 'lighter', fontSize: '18px' }}>
									동양미래대학교
								</span>
								<br />
								<span style={{ fontSize: '18px' }}>{user && user.major}</span>
							</div>
						</div>
					</div>
					<hr />
				</div>
				<div
					style={{
						// margin: '100px 0 0 100px',
						// width: '100%',
						paddingTop: '100px',
						paddingLeft: '100px',
						paddingRight: '100px',
					}}
				>
					<Row gutter={[16, 16]}>
						{userProduct && renderUserProducts}
						{/* {Mypost &&
								Mypost.map((post) => <ProfilePost post={post} key={post.id} />)} */}
					</Row>
				</div>
			</div>
		</div>
	);
}

export default OtherUserPage;

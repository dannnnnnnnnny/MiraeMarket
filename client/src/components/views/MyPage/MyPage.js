import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { Avatar, Typography, Row, Col, Card } from 'antd';
import { useSelector } from 'react-redux';

function MyPage() {
    const user = useSelector(state => state.user);
    const [myProduct, setMyProduct] = useState([])
    
    useEffect(() => {
			Axios.get(`api/product/mypage?id=${user.userData._id}`).then(
				(response) => {
					if (response.data.success) {
						setMyProduct(response.data.Product);
					} else {
						alert('error');
					}
				},
			);
		}, [user.userData._id]);

    const renderMyProducts = myProduct.map((product, index) => (
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
										// src={`http://localhost:5000/${
										// 	user.userData && user.userData.image
										// }`}
										src={`https://mirae-market.herokuapp.com/${
											user.userData && user.userData.image
										}`}
										alt={user.userData && user.userData.image}
									/>
								}
							/>
						</div>
						<div style={{ marginLeft: '60px' }}>
							<Typography.Title level={2}>
								{user.userData && user.userData.name}
							</Typography.Title>
							{/* <Typography.Title level={3}></Typography.Title> */}
							<div style={{ display: 'flex', marginTop: '30px' }}>
								<div>
									<span style={{ fontWeight: 'lighter', fontSize: '18px' }}>
										동양미래대학교
									</span>
									<br />
									<span style={{ fontSize: '18px' }}>
										{user.userData && user.userData.major}
									</span>
								</div>
							</div>
						</div>
						<hr />
						<div style={{ float: 'right' }}>
							<Link to="/edit">프로필 수정</Link>
						</div>
					</div>
					<div
						style={{
							// margin: '100px 0 0 100px',
							// width: '1280px',
							paddingTop: '100px',
							paddingLeft: '50px',
							paddingRight: '50px',
						}}
					>
						<Row gutter={[16, 16]}>
							{myProduct && renderMyProducts}
							{/* {Mypost &&
								Mypost.map((post) => <ProfilePost post={post} key={post.id} />)} */}
						</Row>
					</div>
				</div>
			</div>
		);
}

export default MyPage

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';
import { Row, Col, Button, Modal, notification, Popconfirm, message } from 'antd';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';


function DetailProductPage(props) {
	const productId = props.match.params.productId;
	const [Product, setProduct] = useState({});
	const user = useSelector(state => state.user)
	const [visible, setVisible] = useState(false)
	const history = useHistory();

	const openNotificationWithIcon = type => {
		notification[type]({
			message: '삭제 완료',
			description:
				'게시물이 삭제되었습니다.',
			duration: 2
		});
	};

	useEffect(() => {		
		axios
			.get(`/api/product/products_by_id?id=${productId}&type=single`)
			.then((response) => {
				// console.log(response)
				setProduct(response.data[0]);
			})
			.catch((err) => alert(err));
		// console.log("user:", user.userData)
	}, [productId]);

	const showModal = () => {
		setVisible(true);
	}

	const handleOk = () => {
		axios.delete(`/api/product/products_by_id?id=${productId}`)
			.then(response => {
				if(response.data.success)
					openNotificationWithIcon('success')
			})
			.catch((err) => alert(err));
		
		setVisible(false);	
		return history.push('/');

	}
	
	const handleCancel = () => {
		setVisible(false);
	}

	const confirm = () => {
		message.success('수정 페이지로');
		return history.push({
			pathname: `/product/${productId}/edit`,
			state: `/product/${productId}`,
		});
	}

	const cancel = () => {
		message.error('수정 취소');
	}


	return (
		<div style={{ width: '100%', padding: '3rem 4rem' }}>
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<h1>{Product.title}</h1>
			</div>

			<br />

			<Row gutter={[16, 16]}>
				<Col lg={12} sm={24}>
					<ProductImage detail={Product} />
				</Col>
				<Col lg={12} sm={24}>
					<ProductInfo detail={Product} />
					{Product.writer &&
					user.userData._id &&
					Product.writer._id === user.userData._id ? (
						<>
							<Popconfirm
								title="게시물을 수정하시겠습니까?"
								onConfirm={confirm}
								onCancel={cancel}
								okText="Ok"
								cancelText="No"
							>
								<Button>
									수정
								</Button>
							</Popconfirm>
							<Button onClick={showModal} type="danger">
								{' '}
								삭제{' '}
							</Button>
							,
							<Modal
								title="게시물 삭제"
								visible={visible}
								onOk={handleOk}
								onCancel={handleCancel}
								okText={'삭제'}
								cancelText={'취소'}
								okType="danger"
							>
								<p>이 게시물을 삭제하시겠습니까?</p>
							</Modal>
						</>
					) : (
						''
					)}
				</Col>
			</Row>
		</div>
	);
}

export default DetailProductPage;

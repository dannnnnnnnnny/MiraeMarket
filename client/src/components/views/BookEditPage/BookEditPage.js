import React, { useEffect, useState } from 'react';
import { Button, Typography, Form, Input, notification } from 'antd';

import FileUpload from '../../utils/FileUpload';
import Axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;

const Categories = ['전공', '교양', '만화', '시 / 에세이', '자기 계발', '문학'];

function BookEditPage(props) {
    const productId = props.match.params.productId;
    const [Product, setProduct] = useState({
        title:'', 
        describtion: '', 
        price: '', 
        category: '',
        images: [],
        writer: {},
    });

    const openNotificationWithIcon = (type) => {
        notification[type]({
            message: '수정 완료',
            description: '게시물이 수정되었습니다.',
            duration: 2,
        });
    };
    
    
    useEffect(() => {
        Axios
            .get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then((response) => {
                setProduct({ 
                    title: response.data[0].title,
                    describtion: response.data[0].describtion,
                    price: response.data[0].price,
                    category: response.data[0].category,
                    images: response.data[0].image,
                    writer: response.data[0].writer,
                });
            })
            .catch((err) => alert(err));    
    }, [productId]);
        
    const titleChangeHandler = (e) => {
        setProduct({...Product, title: e.currentTarget.value});
    };

    const describtionChangeHandler = (e) => {
        setProduct({ ...Product, describtion: e.currentTarget.value });
    };

    const priceChangeHandler = (e) => {
        setProduct({ ...Product, price: e.currentTarget.value });
    };

    const categoryChangeHandler = (e) => {
        setProduct({ ...Product, category: e.currentTarget.value });
    };

    const updateImages = (newImages) => {
        setProduct({ ...Product, images: newImages });
    };

    const submitHandler = (e) => {
        e.preventDefault();

        if (!Product.title || !Product.describtion || !Product.price || !Product.category || !Product.images) {
            return alert('모든 값을 채워주세요.');
        }

        const body = {
            // 로그인된 사람의 ID
            writer: Product.wrtier,
            title: Product.title,
            describtion: Product.describtion,
            price: Product.price,
            category: Product.category,
            image: Product.images,
        };
        // 서버에 값들을 request로 보냄
        Axios.put(`/api/product/products_by_id?id=${productId}`, body).then(
					(response) => {
						if (response.data.success) {
							openNotificationWithIcon('success');
							props.history.push('/');
						} else {
							alert('수정 실패');
						}
					},
				);
    };

    return (
			<div style={{ maxWidth: '700px', margin: '2rem auto' }}>
				<div style={{ textAlign: 'center', marginBottom: '2rem' }}>
					<Title level={2}> 수정 페이지 </Title>
				</div>

				<Form onSubmit={submitHandler}>
					<FileUpload
						refreshFunction={updateImages}
						editData={Product.images}
					/>

					<br />
					<br />
					<label>이름</label>
					<Input
						onChange={titleChangeHandler}
						value={Product.title && Product.title}
					/>

					<br />
					<br />
					<label>설명</label>
					<TextArea
						onChange={describtionChangeHandler}
						value={Product.describtion && Product.describtion}
					/>

					<br />
					<br />
					<label>가격</label>
					<Input
						type="number"
						onChange={priceChangeHandler}
						value={Product.price && Product.price}
					/>

					<br />
					<br />
					<select
						onChange={categoryChangeHandler}
						// defaultValue={Product.category && Product.category}
						value={Product.category && Product.category}
					>
						{Categories.map((item, index) => (
							<option key={index} value={item}>
								{item}
							</option>
						))}
					</select>

					<br />
					<br />
					<Button onClick={submitHandler}>등록</Button>
				</Form>
			</div>
		); 
}

export default BookEditPage

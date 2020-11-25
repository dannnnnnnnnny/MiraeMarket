import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Card, Row, Button } from 'antd';
import { Link } from 'react-router-dom';
import ImageSlider from '../../utils/ImageSlider';
import './CardStyle.css';
import CheckCategory from './Sections/CheckCategory';
import Price from './Sections/Price';
import SearchBook from './Sections/SearchBook';
import { continents, price } from './Sections/Datas';
import './LandingPage.css';

function LandingPage() {
	const [Products, setProducts] = useState([]);
	const [Skip, setSkip] = useState(0);
	// const [Limit, setLimit] = useState(8);
	const Limit = 8;
	const [PostSize, setPostSize] = useState(0);
	const [Filters, setFilters] = useState({
		category: [],
		price: [],
	});
	// const [SearchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		let body = {
			skip: Skip,
			limit: Limit,
		};

		getProducts(body);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const getProducts = (body) => {
		axios.post('/api/product/products', body).then((response) => {
			if (response.data.success) {
				if (body.loadMore) {
					setProducts([...Products, ...response.data.productInfo]);
				} else {
					setProducts(response.data.productInfo);
				}

				setPostSize(response.data.postSize);
			} else {
				alert('상품들을 가져오는 데 실패했습니다.');
			}
		});
	};

	const loadMoreHandler = () => {
		let skip = Skip + Limit;
		let body = {
			skip: skip,
			limit: Limit,
			loadMore: true,
		};

		getProducts(body);
		setSkip(skip);
	};

	const showFilteredResults = (filters) => {
		let body = {
			skip: 0,
			limit: Limit,
			filters: filters,
		};

		getProducts(body);
		setSkip(0);
	};

	// div는 NoSQL where절 검색 구분을 위한 문자열 인자값
	const handleFilters = (filters, div) => {
		const newFilters = { ...Filters };
		newFilters[div] = filters;
		// console.log(newFilters);

		if (div === 'price') {
			if (newFilters[div][0] === '' && newFilters[div][1] === '') {
				newFilters[div] = [];
			} else if (newFilters[div][0] === '') {
				newFilters[div][0] = 0;
			} else if (newFilters[div][1] === '') {
				newFilters[div][1] = 500000;
			}
		}

		showFilteredResults(newFilters);
		setFilters(newFilters);
	};

	const updateSearchTerm = (newSearchTerm) => {
		let body = {
			skip: 0,
			limit: Limit,
			filters: Filters,
			searchTerm: newSearchTerm,
		};

		setSkip(0);
		// setSearchTerm(newSearchTerm);
		getProducts(body);
	};

	const renderCards = Products.map((product, index) => {
		return (
			<Col lg={6} md={8} sm={12} xs={24} key={index}>
				<Card
					bordered={false}
					headStyle={{
						width: '210px',
						Height: '270px',
					}}
					bodyStyle={{ width: '210px', height: '80px', fontSize: '13px' }}
					hoverable
					cover={
						<Link to={`/product/${product._id}`}>
							<ImageSlider images={product.image} />
						</Link>
					}
				>
					<Card.Meta
						title={product.title}
						description={
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<span>{product.price} 원</span>
								<span>{product.writer.name}</span>
							</div>
						}
					/>
				</Card>
			</Col>
		);
	});

	return (
		<div
			style={{
				width: '75%',
				margin: '1rem auto',
				height: '100%',
			}}
		>
			<Price
				list={price}
				handleFilters={(filters) => handleFilters(filters, 'price')}
			/>

			<div style={{ height: '20px' }}></div>

			<Row gutter={[16, 16]}>
				<Col lg={12} xs={24}>
					{/* CheckBox */}
					<CheckCategory
						list={continents}
						handleFilters={(filters) => handleFilters(filters, 'category')}
					/>
				</Col>
				<Col lg={12} xs={24}>
					<SearchBook refreshFunction={updateSearchTerm} />
				</Col>
			</Row>

			<div style={{ height: '130px' }}></div>

			<Row gutter={[16, 16]}>{Products && renderCards}</Row>

			{PostSize >= Limit && (
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						height: '100%',
						marginTop: '20px',
					}}
				>
					<Button
						onClick={loadMoreHandler}
						type="primary"
						style={{
							border: 'none',
						}}
					>
						더 보기
					</Button>
				</div>
			)}
		</div>
	);
}

export default LandingPage;

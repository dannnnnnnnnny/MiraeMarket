import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Card, Row, Button, Space, Spin, Typography } from 'antd';
import { Link, useLocation, useHistory } from 'react-router-dom';
import ImageSlider from '../../utils/ImageSlider';
import CheckCategory from './Sections/CheckCategory';
import Price from './Sections/Price';
import SearchBook from './Sections/SearchBook';
import BestSeller from './Sections/BestSeller';
import './MainPage.css';
import './CardStyle.css';

const { Title } = Typography;

function LandingPage() {
	const [Products, setProducts] = useState([]);
	const [Skip, setSkip] = useState(0);

	const Limit = 12;
	const [PostSize, setPostSize] = useState(0);
	const [Filters, setFilters] = useState({
		category: [],
		price: [],
	});
	const location = useLocation();
	const history = useHistory();

	// 먼저 12개 데이터를 조회함
	useEffect(() => {
		let body = {
			skip: Skip,
			limit: Limit,
		};

		getProducts(body);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// 검색버튼 누른 후 #BookLists 로 스크롤 이동하기 위함
	useEffect(() => {
		if (location.hash !== '') {
			setTimeout(() => {
				const id = location.hash.replace('#', '');
				const element = document.getElementById(id);
				if (element) {
					history.push('/');
					element.scrollIntoView({ behavior: 'smooth' });
				}
			}, 0);
		}
	});

	// 데이터 조회 함수
	// 더 보기 버튼일 때는 이전 데이터와 합침
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

	// 더보기 버튼 눌렀을 때 기존 skip 데이터와 Limit 더한 후 그 부분부터 12개 데이터 가져옴
	const loadMoreHandler = () => {
		let skip = Skip + Limit;
		let body = {
			skip: skip,
			limit: Limit,
			loadMore: true,
			filters: Filters,
		};

		getProducts(body);
		setSkip(skip);
	};

	// 데이터 검색 결과 조회
	const showFilteredResults = (filters) => {
		let body = {
			skip: 0,
			limit: Limit,
			filters: filters,
		};

		setFilters(filters)

		getProducts(body);
		setSkip(0);
	};

	// div는 NoSQL where절 검색 구분을 위한 문자열 인자값 (category OR price)
	const handleFilters = (filters, div) => {
		const newFilters = { ...Filters };
		newFilters[div] = filters;

		// div가 가격 filter 이면
		if (div === 'price') {
			// 두 칸 다 빈칸이면
			if (newFilters[div][0] === '' && newFilters[div][1] === '') {
				// newFilters[div] = [];
				newFilters[div][0] = 0;
				newFilters[div][1] = 5000000; 

				// 첫칸이 빈칸이면 첫칸은 0원으로 처리
			} else if (newFilters[div][0] === '') {
				newFilters[div][0] = 0;
				// 두번째 칸이 빈칸이면 Max값(500000)으로 처리
			} else if (newFilters[div][1] === '') {
				newFilters[div][1] = 5000000;
			}
		}
		showFilteredResults(newFilters);
		setFilters(newFilters);
	};

	// 검색 (SearchBook 컴포넌트에 props로 함수를 보내고 검색창에 입력된 데이터를 가져와서 검색)
	const updateSearchTerm = (newSearchTerm) => {
		let body = {
			skip: 0,
			limit: Limit,
			filters: Filters,
			searchTerm: newSearchTerm,
		};

		setSkip(0);
		getProducts(body);
	};

	// 데이터 없을 시 띄울 로딩창
	const renderLoading = () => {
		return (
			<Space size="middle">
				<Spin size="large" />
			</Space>
		);
	};

	// 검색시 #BookLists 앵커로 넘어감
	const onClickSearch = (e) => {
		history.push('/#BookLists');
	};

	// 상품들을 반응형 Column으로 배치 + 이미지 슬라이더 적용
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
				margin: 'auto',
				height: '100%',
			}}
		>
			{/* 배경이미지 */}
			<div
				style={{
					marginLeft: '-20%',
					width: '1557px',
					height: '700px',
					backgroundImage: 'url(bg3.jpg)',
					backgroundSize: 'contain',
					opacity: 0.9,
				}}
			>
				<div style={{ height: '100px' }}></div>

				{/* 검색 창 */}
				<SearchBook refreshFunction={updateSearchTerm} />

				<div
					style={{
						display: 'flex',
						marginLeft: '21%',
						width: '70%',
						paddingTop: '5%',
					}}
				>
					{/* Select Check 카테고리 */}
					<CheckCategory
						handleFilters={(filters) => handleFilters(filters, 'category')}
					/>
					{/* 가격 설정 칸 */}
					<Price handleFilters={(filters) => handleFilters(filters, 'price')} />
				</div>
				<div style={{ height: '80px' }}></div>
				<div>
					{/* 검색 버튼 */}
					<Button
						size="large"
						style={{ marginLeft: '45%', width: '150px' }}
						shape="round"
						type="danger"
						onClick={(e) => onClickSearch(e)}
					>
						검색
					</Button>
				</div>
			</div>
			<div style={{ height: '30px' }}></div>

			{/* BestSeller */}
			<BestSeller />

			<div style={{ height: '90px' }}></div>
			<Title style={{ textAlign: 'center' }} level={2}>
				동양미래 중고 서적 리스트
			</Title>
			<br />
			{/* 반응형 상품 데이터 카드 */}
			<Row id="BookLists" gutter={[16, 16]}>
				{!Products && renderLoading}
				{Products && renderCards}
			</Row>

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

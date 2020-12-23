import React, { useState, useEffect } from 'react'
import { Typography } from 'antd';
import Axios from 'axios';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import "./BestSeller.css";

const { Title } = Typography;
function BestSeller() {
    const [BestSellerData, setBestSellerData] = useState([])

		// 베스트셀러 상품 목록 가져오기
    useEffect(() => {
        const getDatas = async () => {
            const response = await Axios.get('/api/bestseller');
            setBestSellerData(response.data.bestseller);
        };
        getDatas();
    }, []);

		// 이미지 슬라이더 기능
    const renderSlide = BestSellerData.map((book, index) => {
        return (
					<div style={{ width: '210px', height: '270px' }}  key={index}>
						<img
							style={{ width: '210px', height: '270px' }}
							src={book.image}
							alt={book.title}
						/>
					</div>
				);
    });

		// 데스크탑용 사이즈
    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
        },
    };   

    return (
			<div style={{ marginTop: '50px', height: '400px', transform: 'scale(0.8)'}}>
				<Title style={{ textAlign: 'center', fontSize: '23px' }}>
					2020년 12월 베스트셀러
				</Title>
				<Carousel
					responsive={responsive}
					infinite={true}
					autoPlay={true}
					autoPlaySpeed={3000}
					showDots={false}
					focusOnSelect={true}
					transitionDuration={500}
					removeArrowOnDeviceType={['tablet', 'mobile']}
					dotListClass="custom-dot-list-style"
					trackClass="track"
					itemClass="image-item"
				>
					{BestSellerData && renderSlide}
				</Carousel>
				<div className="line"></div>
			</div>
		);
}

export default BestSeller

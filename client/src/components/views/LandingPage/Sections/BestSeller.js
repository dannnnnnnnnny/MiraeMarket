import React, { useState, useEffect } from 'react'
import { Typography } from 'antd';
import Axios from 'axios';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import "./BestSeller.css";

const { Title } = Typography;
function BestSeller() {
    const [BestSellerData, setBestSellerData] = useState([])

    useEffect(() => {
        const getDatas = async () => {
            const response = await Axios.get('/api/bestseller');
            setBestSellerData(response.data.bestseller);
        };
        getDatas();
    }, []);

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

     const responsive = {

        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
        },

    };   

    return (
			<div style={{ marginTop: '50px', height: '400px', transform: 'scale(0.8)'}}>
				<Title style={{ textAlign: 'center', fontSize: '23px' }}>
					2020년 11월 베스트셀러
				</Title>
				<Carousel
					// swipeable={false}
					// draggable={false}
					responsive={responsive}
					// ssr={true} // means to render carousel on server-side.
					infinite={true}
					autoPlay={true}
					autoPlaySpeed={3000}
					showDots={false}
					// keyBoardControl={true}
					// customTransition="all .5"
					// centerMode={true}
					focusOnSelect={true}
					transitionDuration={500}
					// containerClass="carousel-container-padding-40-px"
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

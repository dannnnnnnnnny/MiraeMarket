import React, { useEffect, useState } from 'react';
import Carousel from 'nuka-carousel';

function ProductImage(props) {
	const [Images, setImages] = useState();

	useEffect(() => {
		if (props.detail.image && props.detail.image.length > 0) {

			let images = [];
			props.detail.image.forEach(item => {
				images.push(`http://localhost:5000/${item}`)
			})
			setImages(images);		
		}
	}, [props.detail]);
	// props.detail 값이 바뀔때마다 lifeCycle 다시 작동
	// 처음 랜더링시 props.detail.image가 없었고, 생겼을 때 다시 작동

	const imageCarousel = (image, index) => {
		return (
			<img src={`${image}`} alt={image} key={index}/>
		)
	}
	
	return (
		<div>
			<Carousel
				style={{ margin: '0 auto', maxHeight: '780px', maxWidth: '540px' }}
				autoplay={true}
				autoplayReverse={true}
				autoGenerateStyleTag={false}
				defaultControlsConfig={{
					nextButtonText: '>',
					prevButtonText: '<',
				}}
			>
				{Images && Images.map((image, index) => imageCarousel(image, index))}
			</Carousel>
		</div>
	);
}

export default ProductImage;

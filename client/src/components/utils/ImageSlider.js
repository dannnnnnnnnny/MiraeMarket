import React from 'react';
import { Carousel } from 'antd';
function ImageSlider(props) {
	return (
		<div>
			<Carousel>
				{props.images &&
					props.images.map((image, index) => (
						<div key={index} style={{
							width: '210px',
							height: '270px'
						}}>
							<img
								style={{
									width: '210px',
									height: '270px',
									objectFit: 'cover',
								}}
								src={`http://localhost:5000/${image}`}
								alt={`product_${image}`}
							/>
						</div>
					))}
			</Carousel>
		</div>
	);
}

export default ImageSlider;

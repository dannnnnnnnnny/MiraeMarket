import React, { useEffect, useState } from 'react';
import ImageGallery from 'react-image-gallery';

function ProductImage(props) {
	const [Images, setImages] = useState([]);
	// console.log(props.detail);
	useEffect(() => {
		if (props.detail.image && props.detail.image.length > 0) {
			let images = [];
			props.detail.image.forEach((item) => {
				images.push({
					original: `http://localhost:5000/${item}`,
					thumbnail: `http://localhost:5000/${item}`,
				});
			});
			setImages(images);
		}
	}, [props.detail]);
	// props.detail 값이 바뀔때마다 lifeCycle 다시 작동
	// 처음 랜더링시 props.detail.image가 없었고, 생겼을 때 다시 작동

	return (
		<div>
			<ImageGallery items={Images} />
		</div>
	);
}

export default ProductImage;

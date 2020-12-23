import React, { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

// 파일 업로드 컴포넌트
function FileUpload(props) {
	const [images, setImages] = useState([]);

	// 첫 작성이 아닌 수정이라면 이미지 그대로 가져옴
	useEffect(() => {
		if (props.editData && props.editData) {
			setImages(props.editData);
		}
	}, [props.editData]);

	// 이미지 drop 후, 서버에 이미지 저장한 후, 이미지에 대한 경로 상위 컴포넌트로 보냄
	const dropHandler = async (files) => {
		let formData = new FormData();
		const config = {
			header: { 'content-type': 'multipart/form-data' },
		};
		formData.append('file', files[0]);
		try {
			const response = await axios.post('/api/product/image', formData, config);
			setImages([...images, response.data.filePath]);
			props.refreshFunction([...images, response.data.filePath]);
		} catch (error) {
			alert('이미지 업로드 실패');
		}
	};

	// 더블 클릭시 이미지 삭제 (이미지의 index 찾은 후 splice로 삭제)
	const deleteHandler = (image) => {
		const currentIndex = images.indexOf(image);
		let newImages = [...images];

		newImages.splice(currentIndex, 1);
		setImages(newImages);

		props.refreshFunction(newImages);
	};

	return (
		<div style={{ display: 'flex', justifyContent: 'space-between' }}>
			<Dropzone onDrop={dropHandler}>
				{({ getRootProps, getInputProps }) => (
					<section>
						<div
							style={{
								width: 250,
								height: 330,
								display: 'flex',
								border: '1px solid lightgray',
								alignItems: 'center',
								justifyContent: 'center',
							}}
							{...getRootProps()}
						>
							<input {...getInputProps()} />
							<PlusOutlined style={{ fontSize: '5rem' }} />
						</div>
					</section>
				)}
			</Dropzone>

			<div
				style={{
					display: 'flex',
					width: '250px',
					height: '330px',
					overflow: 'auto',
				}}
			>
				{images &&
					images.map((image, idx) => (
						<div onDoubleClick={() => deleteHandler(image)} key={idx}>
							<img
								style={{ width: '250px', height: '330px' }}
								src={`http://localhost:5000/${image}`}
								alt={`${image}_${idx}`}
							/>
						</div>
					))}
			</div>
		</div>
	);
}

export default FileUpload;

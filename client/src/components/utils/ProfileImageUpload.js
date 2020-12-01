import React, { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

function FileUpload(props) {
	const [image, setImage] = useState('');

	useEffect(() => {
		if (props.editData && props.editData) {
			console.log(props.editData);
			setImage(props.editData);
		}
	}, [props.editData]);

	const dropHandler = async (files) => {
		let formData = new FormData();
		const config = {
			header: { 'content-type': 'multipart/form-data' },
		};
		formData.append('file', files[0]);
		console.log('files : ', files);
		try {
            const response = await axios.post('/api/users/profileImage', formData, config);
            console.log("res : ", response)
			setImage(response.data.filePath);
            props.refreshFunction(response.data.filePath);
            
		} catch (error) {
			alert('프로필 이미지 업로드 실패');
		}
	};

	const deleteHandler = (image) => {
		setImage('');
		props.refreshFunction('');
	};

	return (
		<div style={{ display: 'flex', justifyContent: 'space-between' }}>
			{image === '' ? (
				<Dropzone onDrop={dropHandler}>
					{({ getRootProps, getInputProps }) => (
						<section>
							<div
								style={{
									width: 100,
									height: 100,
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
			) : (
				<div
					style={{
						// display: 'flex',
						width: '100px',
						height: '100px',
					}}
				>
					{image !== '' && (
						<div onDoubleClick={() => deleteHandler(image)}>
							<img
								style={{ width: '100px', height: '100px' }}
								src={`http://localhost:5000/${image}`}
								alt={`${image}`}
							/>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default FileUpload;

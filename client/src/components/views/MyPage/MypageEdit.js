import React, { useState } from 'react';
import Axios from 'axios';
import { Typography, Input, Button, Form } from 'antd';
import { useSelector } from 'react-redux';
import ProfileImageUpload from '../../utils/ProfileImageUpload';

// 내 프로필 수정 컴포넌트
function MypageEdit(props) {
	const user = useSelector(state => state.user);
    const [image, setImage] = useState(user.userData.image)


	const [editProfile, setEditProfile] = useState({
		name: user.userData.name,
		major: user.userData.major, 
		phone: user.userData.phone,
	})


    const updateImages = (newImage) => {
        setImage(newImage);
    };
        
    const onFinish = (values) => {
        let dataToSubmit = {
					id: user.userData._id,
					name: editProfile.name,
					major: editProfile.major,
					image: image,
					phone: editProfile.phone,
        };

        Axios.put(`api/users/edit`, dataToSubmit).then((response) => {
            if (response.data.success) {
                props.history.push('/mypage');
            } else {
                alert('프로필 수정 에러');
            }
        });
    };
        
    const HandleFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
	};
	
	const nameChange = (e) => {
		setEditProfile({...editProfile, name: e.target.value })
	}

	const majorChange = (e) => {
		setEditProfile({...editProfile, major: e.target.value });
	};

	const phoneChange = (e) => {
		setEditProfile({ ...editProfile, phone: e.target.phone });
	};

    return (
			<div
				style={{
					display: 'block',
					margin: '10% auto',
					justifyContent: 'center',
					alignItems: 'center',
					width: '350px',
					height: '600px',
				}}
			>
				<div
					style={{
						display: 'flex',
						margin: '0 auto',
						justifyContent: 'center',
					}}
				>
					<Typography.Title level={2}>프로필 수정</Typography.Title>
				</div>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
					}}
				>
					<div style={{ marginTop: '10%' }}>
						<label>프로필 이미지</label>
					</div>
					<div>
						<ProfileImageUpload
							refreshFunction={updateImages}
							editData={user.userData.image}
						/>
					</div>
				</div>
				<br />
				<Form
					layout={'horizontal'}
					onFinish={onFinish}
					onFinishFailed={HandleFinishFailed}
					scrollToFirstError={true}
				>
					<Input
						onChange={nameChange}
						value={editProfile.name && editProfile.name}
					/>
					<br />
					<Input
						onChange={majorChange}
						value={editProfile.major && editProfile.major}
					/>
					<br />
					<Input
						onChange={phoneChange}
						value={editProfile.phone && editProfile.phone}
					/>
					<br />
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							className="register-form-button"
							style={{ minWidth: '100%' }}
						>
							프로필 수정
						</Button>
					</Form.Item>
				</Form>
			</div>
		);
}

export default MypageEdit

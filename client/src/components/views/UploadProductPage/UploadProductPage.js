import React, { useState } from 'react'
import { Typography, Button, Form, Input } from 'antd';
import FileUpload from "../../utils/FileUpload";
import Axios from 'axios';


const { Title } = Typography;
const { TextArea } = Input;

const Categories = [ "전공", "교양", "만화", "시 / 에세이", "자기 계발", "문학" ]



function UploadProductPage(props) {
    const [title, setTitle] = useState('')
    const [describtion, setDescribtion] = useState('')
    const [price, setPrice] = useState(0)
    const [category, setCategory] = useState('전공')
    const [images, setImages] = useState([])
    

    const titleChangeHandler = (e) => {
        setTitle(e.currentTarget.value)
    }

    const describtionChangeHandler = (e) => {
        setDescribtion(e.currentTarget.value)
    }
    
    const priceChangeHandler = (e) => {
        setPrice(e.currentTarget.value)
    }

    const categoryChangeHandler = (e) => {
        console.log(e.currentTarget.value);
        setCategory(e.currentTarget.value)
    }

    const updateImages = (newImages) => {
        setImages(newImages)
    }

    const submitHandler = (e) => {
        e.preventDefault();

        console.log(title, describtion, price, category, images)
        if (!title || !describtion || !price || !category || !images ) {
            return alert('모든 값을 채워주세요.')
        }

        const body = {
            // 로그인된 사람의 ID
            writer: props.user.userData._id,
            title: title,
            describtion: describtion,
            price: price,
            category: category,
            image: images
        }
        // 서버에 값들을 request로 보냄
        Axios.post('/api/product', body)
            .then(response => {
                if (response.data.success) {
                    alert('업로드 성공')
                    props.history.push('/')
                } else {
                    alert('업로드 실패')
                }
            })

    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}> Upload </Title>
            </div> 

            <Form onSubmit={submitHandler}>

                <FileUpload refreshFunction={updateImages} />

                <br />
                <br />
                <label>이름</label>
                <Input onChange={titleChangeHandler} value={title} />
                
                <br />
                <br />
                <label>설명</label>
                <TextArea onChange={describtionChangeHandler} value={describtion} />

                <br />
                <br />
                <label>가격</label>
                <Input type='number' onChange={priceChangeHandler} value={price} />

                <br />
                <br />
                <select onChange={categoryChangeHandler} value={category}>

                    { Categories.map((item,index) => (
                        <option key={index} value={item}>{item}</option>
                    ))}
                    

                </select>

                <br />
                <br />
                <Button onClick={submitHandler}>
                    등록
                </Button>

            </Form>
        </div>
    )
}

export default UploadProductPage

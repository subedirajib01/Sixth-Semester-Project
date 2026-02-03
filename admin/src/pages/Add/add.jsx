import React from 'react'
import './add.css';
import { assets } from '../../assets/assets';
import { useState} from 'react';


const add = () => {
    const[image,setImage]=useState(false);
    const[data,setData]=useState({
        name:"",
        description:"",
        price:"",
        category:"Salad"
    })
    const onChangeHandler=(event)=>{
        const name=event.target.name;
        const value=event.target.value;
        // const description=event.target.description;
        // const price=event.target.price;
        // const category=event.target.category;
        setData(data=>({...data,[name]:value}))
    }

    const onSubmitHandler= async (event)=>{
        event.preventDefault();
        const formData=- new FormData();
        formData.append("name",data.name);
        formData.append("description",data.description);
        formData.append("price",Number(data.price));
        formData.append("category",Number(data.category));
        formData.append("image",image);
        


    }

    return (
    <div className='add'>
        <form className='flex-column' onSubmit={onSubmitHandler}>
            <div className="add-img-upload flex-col">
                <p>upload Image</p>
                <label htmlFor='image'>
                    <img src={image? URL.createObjectURL(image):assets.upload_area} alt="" />
                </label>
                <input onChange={(e)=>{setImage(e.target.files[0])}} type="file" id='image' hidden required />
            </div>
            <div className="add-product-name flex-col" >
                <p>Product Name</p>
                <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here' />
            </div>
            <div className="add-product-description flex-col" >
                <p>Product Desription</p>
                <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Write Content here' required></textarea>
            </div>
            <div className="add-category-price">
                <div className="add-category flex-col" >
                    <p>Product Category</p>
                    <select onChange={onChangeHandler} name="category" >
                        <option value="Salad"></option>
                        <option value="Rolls"></option>
                        <option value="Dessert"></option>
                        <option value="Sanwich"></option>
                        <option value="Cake"></option>
                        <option value="Pure Veg"></option>
                        <option value="Pasta"></option>
                        <option value="Noodles"></option>
                    </select>
                </div>
                <div className="add-price flex-col">
                    <p>Product Price</p>
                    <input onChange={onChangeHandler} value={data.price} type="number" name="price" placeholder="$20" />
                </div>
            </div>
            <button type='submit' className="add-button">ADD</button>
        </form>
        
    </div>
    )
}

export default add
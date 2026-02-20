import React from 'react'
import './verify.css'
import {useNavigate, useSearchParams} from 'react-router-dom'
import { useContext, useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';


const Verify = () => {

    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const {url} = useContext(StoreContext);
    const navigate = useNavigate();

    useEffect(()=>{
        const verifyPayment = async () =>{
            const response = await axios.post(url+"/api/order/verify",{success,orderId});
            if(response.data.success){
                navigate("MyOrders");
            }
            else{
                navigate("/")
            }
        }
        verifyPayment();
    },[success, orderId, url, navigate])

    return (
    <div className='verify'>
        <div className='spinner'></div>
    </div>
    )
}

export default Verify;
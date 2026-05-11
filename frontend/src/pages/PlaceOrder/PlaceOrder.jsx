import React, { useContext, useState, useEffect } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
    const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    });

    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    //  Main order + payment handler
    const placeOrder = async (event) => {
        event.preventDefault();

        try {
            let orderItems = [];

            food_list.forEach((item) => {
                if (cartItems[item._id] > 0) {
                    orderItems.push({
                        ...item,
                        quantity: cartItems[item._id]
                    });
                }
            });

            const orderData = {
                address: data,
                items: orderItems,
                amount: getTotalCartAmount() + 2
            };

            const response = await axios.post(
                `${url}/api/order/place`,
                orderData,
                { headers: { token } }
            );

            if (response.data.success) {
                const paymentData = response.data.paymentData;

                //  Create dynamic eSewa form
                const form = document.createElement("form");
                form.method = "POST";
                form.action = `${import.meta.env.VITE_ESEWA_GATEWAY_URL}/api/epay/main/v2/form`;

                Object.keys(paymentData).forEach((key) => {
                    const input = document.createElement("input");
                    input.type = "hidden";
                    input.name = key;
                    input.value = paymentData[key];
                    form.appendChild(input);
                });

                document.body.appendChild(form);
                form.submit();
            } else {
                alert("Error placing order");
            }

        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        }
    };

    //  Redirect if no token or empty cart
    useEffect(() => {
        if (!token || getTotalCartAmount() === 0) {
            navigate('/cart');
        }
    }, [token, getTotalCartAmount, navigate]);

    return (
        <form onSubmit={placeOrder} className='place-order'>

            {/* LEFT SIDE */}
            <div className="place-order-left">
                <p className="title">Delivery Information</p>

                <div className="multi-fields">
                    <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
                    <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
                </div>

                <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
                <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />

                <div className="multi-fields">
                    <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
                    <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
                </div>

                <div className="multi-fields">
                    <input required name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip-code' />
                    <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
                </div>

                <input required name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
            </div>

            {/* RIGHT SIDE */}
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>

                    <div>
                        <div className="cart-total-details">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>

                        <hr />

                        <div className="cart-total-details">
                            <p>Delivery Fee</p>
                            <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
                        </div>

                        <hr />

                        <div className="cart-total-details">
                            <b>Total</b>
                            <b>
                                ${getTotalCartAmount() === 0
                                    ? 0
                                    : getTotalCartAmount() + 2}
                            </b>
                        </div>
                    </div>

                    {/* ✅ Correct button */}
                    <button type="submit">Pay with eSewa</button>
                </div>
            </div>

        </form>
    );
};

export default PlaceOrder;
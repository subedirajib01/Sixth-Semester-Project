import React, {useState,useEffect} from 'react'
import "./list.css"
import axios from "axios"
import {toast} from "react-toastify"

const List = () => {

const [list,setList]=useState([]);
const url="http://localhost:5000";

const removeFood = async (foodId) => {
    try {
        const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
        if (response.data.success) {
            // update state locally to avoid an extra network fetch
            setList(prev => prev.filter(item => item._id !== foodId));
            toast.success(response.data.message);
        } else {
            toast.error("Error");
        }
    } catch (err) {
        toast.error("Error");
        console.error(err);
    }
};

useEffect(() => {
    let isMounted = true;

    const fetchList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            console.log(response.data);
            if (!isMounted) return;
            if (response.data.success) {
                setList(response.data.data);
            } else {
                toast.error("Error");
            }
        } catch (err) {
            if (!isMounted) return;
            toast.error("Error fetching list");
            console.error(err);
        }
    };

    fetchList();

    return () => {
        isMounted = false;
    };
}, []);

    return (
    <div className='list add flex-col'>
        <p>All Foods List</p>
        <div className="list-table">
            <div className="list-table-format title" >
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Action</b>
            </div>
            {list.map((item, index) => {
                return (
                    <div key={index} className="list-table-format">
                        <img src={`${url}/images/` + item.image} alt="" />
                        <p>{item.name}</p>
                        <p>{item.category}</p>
                        <p>${item.price}</p>
                        <p className="cursor" onClick={()=>removeFood(item._id)}>X</p>
                    </div>
                );
            })}
        </div>
    </div>
    )
}

export default List;

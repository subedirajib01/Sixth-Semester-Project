import React, { useContext, useState } from 'react'
import './navbar.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("Menu")
    const {getTotalCartAmount} = useContext(StoreContext)


    return (
        <div className='navbar'>
            <Link to="/"><img src={assets.logo} alt="" className='logo' /></Link>
            <ul className="navbar-menu">
                <Link to="/" onClick={() => setMenu("Home")} className={menu === "Home" ? "active" : ""}>Home</Link>
                <li onClick={() => setMenu("Menu")} className={menu === "Menu" ? "active" : ""}>Menu</li>
                <li onClick={() => setMenu("Mobile-app")} className={menu === "Mobile-app" ? "active" : ""}>Mobile-app</li>
                <li onClick={() => setMenu("Contact-us")} className={menu === "Contact-us" ? "active" : ""}>Contact-us</li>
            </ul>
            <div className="navbar-right">
                <img src={assets.search_icon} alt="" />
                <div className="navbar-search-icon">
                    <Link to="/cart"><img src={assets.basket_icon} alt="" /></Link>
                    <div className= {getTotalCartAmount() === 0?"":"dot"}>

                    </div>
                </div>
                <button onClick={() => { setShowLogin(true) }}>Sign In</button>
            </div>
        </div>
    )
}

export default navbar

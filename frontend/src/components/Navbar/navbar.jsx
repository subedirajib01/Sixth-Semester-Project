import React, { useContext, useState } from 'react'
import './navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("Home")
    const { getTotalCartAmount, token, setToken } = useContext(StoreContext)
    const navigate = useNavigate()

    const logOut = () => {
        localStorage.removeItem("token")
        setToken("")
        navigate("/")
    }

    return (
        <div className="navbar">
            {/* LOGO */}
            <Link to="/">
                <img src={assets.logo} alt="logo" className="logo" />
            </Link>

            {/* MENU */}
            <ul className="navbar-menu">
                <Link to="/" onClick={() => setMenu("Home")} className={menu === "Home" ? "active" : ""}>Home</Link>
                <Link to="/" onClick={() => setMenu("Menu")} className={menu === "Menu" ? "active" : ""}>Menu</Link>
                <Link to="/" onClick={() => setMenu("Mobile-app")} className={menu === "Mobile-app" ? "active" : ""}>Mobile-app</Link>
                <Link to="/contact" style={{ textDecoration: "none", color: "inherit" }}>
                <li
                        onClick={() => setMenu("Contact-us")}
                        className={menu === "Contact-us" ? "active" : ""}
                    >
                    Contact-us
                    </li>
</Link>
            </ul>

            {/* RIGHT SECTION */}
            <div className="navbar-right">
                {/* SEARCH */}
                <img src={assets.search_icon} alt="search" className="icon" />

                {/* CART */}
                <div className="navbar-cart">
                    <Link to="/cart">
                        <img src={assets.basket_icon} alt="cart" className="icon" />
                    </Link>
                    {getTotalCartAmount() !== 0 && <div className="dot"></div>}
                </div>

                {/* AUTH / PROFILE */}
                {!token ? (
                    <button className="signin-btn" onClick={() => setShowLogin(true)}>
                        Sign In
                    </button>
                ) : (
                    <div className="navbar-profile">
                        <img src={assets.profile_icon} alt="profile" className="icon" />
                        <ul className="nav-profile-dropdown">
                            <li
                                onClick={()=>navigate('/MyOrders')}>
                                <img src={assets.bag_icon} alt="" />
                                <p>Orders</p>
                            </li>
                            <hr />
                            <li onClick={logOut}>
                                <img src={assets.logout_icon} alt="" />
                                <p>Log Out</p>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar

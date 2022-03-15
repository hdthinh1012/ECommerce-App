import React from 'react';
import {
    Link
} from "react-router-dom";
import "./NavBar.css";
import { BsCartPlus } from "react-icons/bs";
import { IconContext } from "react-icons";
import $ from "jquery";


const NavBar = () => {
    const navigationList = [{ link: "/", name: "Home" }, { link: "/menu", name: "Menu" }, { link: "/register", name: "Register" }, { link: "/login", name: "Login" }, { link: "/chat", name: "Chat" }];

    return (
        <nav>
            <div className="logo-search-cart-bar">
                <img className='logo' src="/images/hcmut-logo.png" alt="hcmut-logo" />
                <p className='app-name'>Funiture Store</p>
                <Link to="/cart">
                    <div className='view-cart-btn'>
                        <p>View Cart</p>
                        <IconContext.Provider value={{ className: "add-to-cart-icon" }}>
                            <BsCartPlus />
                        </IconContext.Provider>
                    </div>
                </Link>
            </div>
            <ul className='nav-bar'>
                {navigationList.map(navItem => <li key={navItem.name} onClick={(event) => changePage(event.target)}><Link to={navItem.link}>{navItem.name}</Link></li>)}
            </ul>
        </nav>
    );
}

export default NavBar;

const changePage = (target) => {
    if ($(target).parent().is("li")) {
        const otherNavbarItems = $(target).parent().siblings("li");
        $(otherNavbarItems).removeClass("active-navbar-item");
        $(target).parent().addClass("active-navbar-item");
    }
}
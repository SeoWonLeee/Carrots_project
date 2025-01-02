import React from "react";
import Header from "./header/Header";
import HeaderSearch from "./header/HeaderSearch";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Footer from "./footer/Footer";


const Layout = ({ children , isChatPage}) => {
    return (
        <div id="wrap">
            <Header />
            {!isChatPage && <HeaderSearch/>}
            <main>{children}</main>
            <Footer/>
        </div>
    );
};

export default Layout;

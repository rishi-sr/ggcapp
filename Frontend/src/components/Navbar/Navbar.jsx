import React from 'react'
import './navbar.scss'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
    <div className="navbar">
        <div className="logo">
            <div className="imglogo">
                <img src="ggclogo.png" alt="" />
                <h2>Green Gold Club</h2>
            </div>
        </div>
        <div className="links">
            <div className="links1">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/service">Services</Link>
                <Link to="/portfolio">Portfolio</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/blog">Blog</Link>
            </div>
        </div>
    </div>
    </>
  )
}

export default Navbar

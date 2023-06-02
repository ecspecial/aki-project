import './nav.css';
import React, { useState, useEffect } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logo from '../../../assets/images/logo-1.svg';
import MobileNavigation from './MobileNavigation';

function NavigationBar() {
  const [open, setOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [scrollBackground, setScrollBackground] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    const handleScroll = () => {
      const scrolled = window.scrollY > 0;
      setScrollBackground(scrolled);
    };

    const handleWindowWidth = () => {
      if (window.innerWidth > 768) {
        setOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('resize', handleWindowWidth);
    window.addEventListener('scroll', handleScroll);


    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', handleWindowWidth);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className='Navbar-wrapper'>
    <Navbar className={`navigation-bar ${open ? 'open' : ''} ${scrollBackground ? 'scrolled' : ''}`}>
      <Navbar.Brand as={Link} to='/'>
        <img src={Logo} alt='Logo' className='logo' />
      </Navbar.Brand>
      {(windowWidth > 768) && (
        <Nav className='navigation-links'>
            <Nav.Link as={Link} to='/'>
                Пространства
            </Nav.Link>
            <Nav.Link as={Link} to='/'>
                Профиль
            </Nav.Link>
            <Nav.Link as={Link} to='/'>
                О нас
            </Nav.Link>
            <Nav.Link className='login-link' as={Link} to='/login'>
                Войти
            </Nav.Link>
        </Nav>
      )}
      {(windowWidth < 768) && (
      <div className={`burger ${open ? 'open' : ''}`} onClick={handleClick}>
        <div className='bar1'></div>
        <div className='bar2'></div>
        <div className='bar3'></div>
      </div>)}
    </Navbar>
    {(windowWidth < 768) && open && (
        <MobileNavigation open={open} onClose={handleClose}/>
      )}
    </div>
  );
}

export default NavigationBar;
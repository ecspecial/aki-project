import './nav.css';
import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logo from '../../../assets/images/logo-1.svg';

function MobileNavigation({ open, onClose }) {
  return (
    <div className={`mobile-navigation ${open ? 'open' : ''}`}>
      <div className="mobile-navigation-content">
        <Navbar className='mobile-navigation-bar'>
          <div className='mobile-nav-head'>
            <Navbar.Brand as={Link} to='/'>
              <img src={Logo} alt='Logo' className='logo' />
            </Navbar.Brand>
            <div className={`burger ${open ? 'open' : ''}`} onClick={onClose}>
                <div className='bar1'></div>
                <div className='bar2'></div>
                <div className='bar3'></div>
            </div>
          </div>
          <Nav className='mobile-navigation-links'>
            <Nav.Link as={Link} to='/' onClick={onClose}>
              Пространства
            </Nav.Link>
            <Nav.Link as={Link} to='/' onClick={onClose}>
              Профиль
            </Nav.Link>
            <Nav.Link as={Link} to='/' onClick={onClose}>
              О нас
            </Nav.Link>
            <Nav.Link as={Link} to='/login' onClick={onClose}>
              Войти
            </Nav.Link>
          </Nav>
        </Navbar>
      </div>
    </div>
  );
}

export default MobileNavigation;
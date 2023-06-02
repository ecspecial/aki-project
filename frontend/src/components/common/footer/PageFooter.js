import React from 'react';
import './footer.css';
import Logo from '../../../assets/images/logo-footer-1.svg'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer_row">
          <div className="footer_logo">
          <img src={Logo} alt='Logo' className='logo' />
          </div>
        </div>
        <div className="footer_contacts">
          <div className="footer_contactsAddress">
            125009, Россия, Москва Вознесенский пер. 11. стр. 2
          </div>
          <div className="footer_contactsPhone">
            <a href="tel:+7 495 988-30-80" className="footer_link">+7 495 988-30-80</a>
          </div>
          <div className="footer_contactsMail">
            <a href="mailto:aki.info@develop.mos.ru" className="footer_link">aki.info@develop.mos.ru</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
import React from 'react';
import '../styles/FooterStyles.css';

const Footer = () => {
    return (
        <div className='footerDiv'>
            <div className='linksDiv'>
                <div>
                    <h5>About Us</h5>
                    <p href='' className='about'>Lorem</p>
                </div>
                <div>
                    <h5>Contact us</h5>
                    <span>Ufa</span>
                    <span>Moskow</span>
                    <span>Kazan</span>
                    <span>St. Petersburg</span>
                </div>
                <div>
                    <h5>Social Media</h5>
                    <span>Facebook</span>
                    <span>Instagram</span>
                    <span>Twitter</span>
                    <span>Vk</span>
                </div>
            </div>
        </div>
    );
}

export default Footer
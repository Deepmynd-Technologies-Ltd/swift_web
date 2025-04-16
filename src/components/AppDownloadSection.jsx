import React from 'react';
import '../assets/styles/AppDownloadSection.css';

const AppDownloadSection = () => {
    return (
        <section className="app-download-section mt-24">
            <div className="container">
                <div className="content-wrapper">
                    {/* Phone Mockup with Purple Background */}
                    <div className="phone-container">
                        {/* Purple background element */}
                        <div className="purple-glow"></div>
                        
                        {/* Phone Image */}
                        <div className="phone-image-wrapper">
                            <img
                                src={require('../assets/img/mobile_phone.png')}
                                alt="SwiftAza mobile app interface"
                                className="phone-image"
                            />
                        </div>
                    </div>
                    
                    {/* Download Info */}
                    <div className="download-info">
                        <h2 className="title">
                            Download the App
                        </h2>
                        
                        <p className="description">
                            While you have more features with the web version, We urge you to 
                            also download the mobile app so you can have a handy version 
                            that's ready to go anytime.
                        </p>
                        
                        <div className="download-buttons">
                            {/* Apple Store Button */}
                            <a href="#" className="store-button">
                                <img
                                    src={require('../assets/img/dnl_app_store.png')}
                                    alt="Download on the App Store"
                                />
                            </a>
                            
                            {/* Google Play Button */}
                            <a href="#" className="store-button">
                                <img
                                    src={require('../assets/img/dnl_play_store.png')}
                                    alt="Get it on Google Play"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppDownloadSection;

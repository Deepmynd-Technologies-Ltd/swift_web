// ContactUs.jsx
import "../assets/styles/contact.css";
import { FaWhatsapp, FaInstagram, FaTwitter, FaTelegram } from "react-icons/fa";

const ContactUs = () => {
    return (
        <div className="contact-wrapper">
            <section className="hero-section">
                <div className="hero-container">
                    <div className="tag-container">
                        <div className="feature-tag">Contact Us</div>
                    </div>

                    <div className="hero-content">
                        <h1 className="hero-title">
                            Want to reach out to us?
                            <br />
                            Look below for how to do that
                        </h1>

                        {/* Phone Number Header */}
                        <div className="contact-sections">
                            {/* Contact Form */}
                            <div className="contact-section">
                                <h2 className="section-heading">Send us a Message</h2>
                                <div className="form-group">
                                    <div className="input-label">Full Name</div>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="What should we call you?"
                                    />
                                </div>
                                <div className="form-group">
                                    <div className="input-label">Email</div>
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder="Where can we reach you?"
                                    />
                                </div>
                                <div className="form-group">
                                    <div className="input-label">Message</div>
                                    <textarea
                                        className="form-textarea"
                                        placeholder="Type your message here"
                                    ></textarea>
                                </div>
                                <button className="primary-button">Send Message</button>
                            </div>

                            {/* Contact Methods */}
                            <div className="contact-methods">
                                <div className="contact-method">
                                    <img src={require("../assets/img/phone.png")} alt="phone_call_img" style={{ width: "30px" }} />
                                    <div className="contct-sec">
                                    <h2 className="section-heading">Call Us</h2>
                                    <p className="method-description">
                                        Call us to speak to a member of our team.
                                        <br />
                                        We are always happy to help.
                                    </p>
                                    <div className="highlight-text">+234 801 234 5679</div>
                                    </div>
                                </div>

                                <div className="section-divider"></div>

                                <div className="contact-method">
                                    <img src={require("../assets/img/email.png")} alt="phone_call_img" style={{ width: "30px" }} />
                                    <div className="contct-sec">
                                    <h2 className="section-heading">Email Us</h2>
                                    <p className="method-description">
                                        Email us for general queries, including difficulties and any other problem.
                                    </p>
                                    <div className="highlight-text">info@swiftaza.io</div>
                                    </div>
                                </div>

                                <div className="section-divider"></div>

                                <div className="contact-method">
                                <div className="contct-sec">
                                    <h2 className="section-heading">Socials</h2>
                                    <p className="method-description">
                                        Reach us on our social media accounts.
                                    </p>
                                    <div className="social-icons">
                                        <FaWhatsapp />
                                        <FaInstagram />
                                        <FaTelegram />
                                        <FaTwitter />
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactUs;

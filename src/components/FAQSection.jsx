import React, { useState } from 'react';
import { CirclePlus, CircleMinus, MessageSquare } from 'lucide-react';
import '../assets/styles/faq.css';

const FAQSection = () => {
    const [activeCategory, setActiveCategory] = useState(0);
    const [activeDropdown, setActiveDropdown] = useState(3);

    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const faqCategories = [
        {
            name: "Account Management",
            questions: [
                {
                    question: "How do I create an account on SwiftAza?",
                    answer: "To create an account on SwiftAza, visit our website and click on the 'Sign Up' button. Follow the on-screen instructions to enter your personal details and complete the verification process."
                },
                {
                    question: "Can I have multiple accounts on SwiftAza?",
                    answer: "Yes, you can have multiple accounts on SwiftAza. Each account must be registered with a unique email address and comply with our terms of service."
                },
                {
                    question: "How do I update my personal information on SwiftAza?",
                    answer: "Log into your account, navigate to the 'Profile' or 'Account Settings' section, and you'll find options to update your personal information."
                },
                {
                    question: "What should I do if I forget my password?",
                    answer: "If you forget your password, you can easily reset it by clicking on the \"Forgot Password\" link on the login page. Follow the instructions provided to reset your password and regain access to your account."
                },
                {
                    question: "Is there a minimum deposit requirement for opening an account on SwiftAza?",
                    answer: "Yes, there is a minimum deposit requirement. The exact amount depends on the type of account you wish to open. Please check our pricing page for the most current requirements."
                },
                {
                    question: "How do I close my SwiftAza account?",
                    answer: "To close your SwiftAza account, please contact our customer support team through the 'Help' section or send an email to support@swiftaza.com with your account details."
                }
            ]
        },
        {
            name: "Investment Options",
            questions: [
                {
                    question: "What investment options are available on SwiftAza?",
                    answer: "SwiftAza offers various investment options including stocks, bonds, ETFs, mutual funds, and cryptocurrency trading."
                },
                {
                    question: "How do I start investing on SwiftAza?",
                    answer: "After creating and funding your account, navigate to the 'Trade' or 'Invest' section, select your preferred investment option, and follow the guided process."
                },
                {
                    question: "Are there any fees for investing through SwiftAza?",
                    answer: "Yes, there are trading fees and commissions that vary based on the type of investment and transaction volume. Full details can be found on our 'Fees' page."
                },
                {
                    question: "What is the minimum investment amount?",
                    answer: "The minimum investment amount varies depending on the investment type. Some stocks can be purchased as fractional shares with as little as $1."
                }
            ]
        },
        {
            name: "Security and Privacy",
            questions: [
                {
                    question: "How does SwiftAza protect my personal information?",
                    answer: "SwiftAza employs industry-standard encryption, two-factor authentication, and strict data protection policies to safeguard your personal information."
                },
                {
                    question: "Is my money safe with SwiftAza?",
                    answer: "Yes, SwiftAza is registered with appropriate financial authorities and provides insurance coverage up to specified limits, protecting clients' assets."
                },
                {
                    question: "How can I enable two-factor authentication?",
                    answer: "Login to your account, go to 'Security Settings', and follow the instructions to enable two-factor authentication for an extra layer of security."
                },
                {
                    question: "What should I do if I notice unauthorized activity on my account?",
                    answer: "If you notice any suspicious activity, immediately change your password and contact our security team through the emergency helpline provided in our 'Contact' section."
                }
            ]
        },
        {
            name: "Technical Support",
            questions: [
                {
                    question: "The SwiftAza app is not working. What should I do?",
                    answer: "Try updating the app to the latest version, clearing the cache, or reinstalling the app. If issues persist, contact our technical support team."
                },
                {
                    question: "How do I report a technical issue?",
                    answer: "You can report technical issues through the 'Help' section in the app or website, or by emailing support@swiftaza.com with details of the problem."
                },
                {
                    question: "Is there a desktop application for SwiftAza?",
                    answer: "Yes, SwiftAza offers desktop applications for Windows and Mac, which can be downloaded from our website's 'Downloads' section."
                },
                {
                    question: "How can I recover my account if I can't access my registered email?",
                    answer: "Please contact our customer support with valid identification documents to verify your identity, and we will help you recover your account."
                }
            ]
        }
    ];

    return (
        <div className="faq-container">
            <div className="faq-header">
                <div className="section-tag">Help</div>
                <h1>Frequently Asked Questions</h1>
                <p>
                    Visit our <a href="#" className="help-link">Help Centre</a> for more information.
                </p>
            </div>

            <div className="faq-content">
                {/* Categories Sidebar */}
                <div className="faq-sidebar">
                    {faqCategories.map((category, index) => (
                        <div
                            key={index}
                            className={`category-item ${index === activeCategory ? 'active' : ''}`}
                            onClick={() => {
                                setActiveCategory(index);
                                setActiveDropdown(null);
                            }}
                        >
                            {category.name}
                        </div>
                    ))}

                    <div className="support-container">
                        <p className="question-title">Still have a question?</p>
                        <p className="support-text">Reach out to our support team.</p>
                        <button className="message-button">
                            <MessageSquare size={18} />
                            <span>Message Us</span>
                        </button>
                    </div>
                </div>

                {/* FAQ Questions */}
                <div className="faq-questions">
                    {faqCategories[activeCategory].questions.map((item, index) => (
                        <div key={index} className="question-container">
                            <div
                                className={`question-header ${activeDropdown === index ? 'active' : ''}`}
                                onClick={() => toggleDropdown(index)}
                            >
                                <h3>{item.question}</h3>
                                {activeDropdown === index ? (
                                    <CircleMinus size={18} className="toggle-icon" />
                                ) : (
                                    <CirclePlus size={18} className="toggle-icon" />
                                )}
                            </div>

                            {activeDropdown === index && (
                                <div className="question-answer">
                                    {item.answer || 'No answer provided for this question.'}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQSection;
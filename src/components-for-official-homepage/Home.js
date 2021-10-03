import React, { useEffect, useState } from 'react'
import background from '../images/homepage_intro.jpeg'
import '../official-homepage-css/home.css'
import { DisplayQuotes } from './DisplayQuotes'
import philosophers from '../data/philosophers.json'
import Footer from '../components-for-official-homepage/Footer'



const Home = () => {

    return (

        <div id="home-page">
            <section className="welcome-container">
                <h1>WELCOME!</h1>
            </section>
            <section className="homepage-picture-container">
                <img src={background} alt={"background_image"} />
                <DisplayQuotes />
            </section>
            <section className="welcome-message-container">
                <div className="title-container">
                    <h1>"Love of Wisdom"</h1>
                </div>
                <div className="message-container">
                    <span className="welcome-message">
                        Caritatem Veritatis is dedicated to promote ancient Greco-Roman philosophy and how it can not only be an intellectually pursuit, but a practical one as well.
                    </span>
                    <span style={{
                        "margin-top": "10px"
                    }} className="welcome-message">Check us out!</span>
                </div>
                <section className="main-links-container">
                    <div className="info-box">
                        <h3>Books</h3>
                        <p>Our recommended reading about virtue, theism, metaphysics, morality, & more according to the ancient Greco-Romans.</p>
                        <div className="homePage-button-container">
                            <button className="homePage-button">BROWSE</button>
                        </div>
                    </div>
                    <div className="info-box">
                        <h3>Blog</h3>
                        <p>We have weekly posts about wide-variety of topics relating to philosophy. Become a member!</p>
                        <div className="homePage-button-container">
                            <button className="homePage-button">VIEW BLOG</button>
                        </div>
                    </div>
                    <div className="info-box">
                        <h3>Apologetics</h3>
                        <p>Caritatem Veritatis are followers of the Aristotelian/Platonic philosophical tradition. We love reason/argumentation and we believe they are great guides towards discovering what is true.</p>
                        <div className="homePage-button-container">
                            <button className="homePage-button">APOLOGETICS</button>
                        </div>
                    </div>
                </section>
            </section>
            <section className="the-philosophers">
                <h1>The Philosophers</h1>
                {philosophers.map((philosopher) =>
                    <>
                        <section className="the-philosopher-container">
                            <div className="philosopher-pic-container">
                                <img src={philosopher.img} alt={philosopher.alt} />
                            </div>
                            <div className="the-philosophers-description">
                                <h1>{philosopher.name}</h1>
                                <p>{philosopher.bioShort}</p>
                            </div>
                            <div className="the-philoshopers-button-container">
                                <button>Learn More</button>
                            </div>
                        </section>
                        <div className="the-philosopher-border" />
                    </>
                )}
                <button className="the-philosophers-checkout-our-philosophers-button">
                    CLICK HERE to view all of our philoshopers!
                </button>
            </section>
            <section className="checkout-our-blog-container">
                <div className="the-philosopher-border" />
                <h5>Share your thoughts!</h5>
                <h5>Join our Blog!</h5>
                <button>CLICK HERE to become a member</button>
            </section>
            <Footer />
        </div>

    )
}

export default Home;

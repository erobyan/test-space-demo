import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

import imgGambas from '../assets/gambas al ajillo.jpeg';
import imgPaella from '../assets/paella de marisco.jpeg';
import imgDorada from '../assets/dorada a la plancha.jpeg';

import imgExp1 from '../assets/exp1.png';
import imgExp2 from '../assets/exp2.png';
import imgExp3 from '../assets/exp3.png';
import imgExp4 from '../assets/exp4.png';
const LandingPage = () => {
    const [currentExpImg, setCurrentExpImg] = useState(0);
    const expImages = [imgExp1, imgExp2, imgExp3, imgExp4];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentExpImg((prev) => (prev + 1) % expImages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Dining Cruise por la costa de Mallorca</h1>
                    <p className="hero-subtitle">
                        Descubra una experiencia culinaria inolvidable a bordo de nuestro exclusivo restaurante flotante. Paisajes mediterráneos, brisa marina y alta gastronomía.
                    </p>
                    <Link to="/reservar" className="btn-primary hero-cta">
                        RESERVAR
                    </Link>
                </div>
            </section>

            {/* Sobre Nosotros */}
            <section className="about-section">
                <div className="container about-container">
                    <div className="about-text">
                        <h2>Sobre Nosotros</h2>
                        <p>
                            Costa Mallorca Cruise Dining nace de la pasión por el Mediterráneo y la alta gastronomía.
                            Nuestro propósito es brindar una travesía inolvidable donde el sonido de las olas y
                            los sabores más exquisitos se encuentran en perfecta armonía. Navegamos ofreciendo
                            un servicio excepcional en un entorno inigualable.
                        </p>
                    </div>
                </div>
            </section>

            {/* Experiencia a bordo Slider */}
            <section className="exp-slider-section">
                <h2 className="text-center section-title">Experiencia a Bordo</h2>
                <div className="exp-slider-container">
                    {expImages.map((src, idx) => (
                        <img
                            key={idx}
                            src={src}
                            alt={`Experiencia ${idx + 1}`}
                            className={`exp-slide ${idx === currentExpImg ? 'active' : ''}`}
                        />
                    ))}
                    <div className="slider-indicators">
                        {expImages.map((_, idx) => (
                            <div
                                key={idx}
                                className={`indicator ${idx === currentExpImg ? 'active' : ''}`}
                                onClick={() => setCurrentExpImg(idx)}
                            ></div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Platos Estrella */}
            <section className="dishes-section">
                <div className="container">
                    <h2 className="text-center section-title">Platos Estrella</h2>
                    <div className="dishes-grid">
                        <div className="dish-card">
                            <img src={imgGambas} alt="Gambas al ajillo" className="dish-img" />
                            <div className="dish-info">
                                <h3>Gambas al ajillo</h3>
                                <p>Un clásico insuperable. Gamba roja fresca con un toque de ajo y guindilla en aceite de oliva virgen extra.</p>
                            </div>
                        </div>
                        <div className="dish-card">
                            <img src={imgPaella} alt="Paella de marisco" className="dish-img" />
                            <div className="dish-info">
                                <h3>Paella de marisco</h3>
                                <p>Arroz bomba en su punto perfecto con los mejores frutos del mar Mediterráneo y un fumet casero intenso.</p>
                            </div>
                        </div>
                        <div className="dish-card">
                            <img src={imgDorada} alt="Dorada a la plancha" className="dish-img" />
                            <div className="dish-info">
                                <h3>Dorada a la plancha</h3>
                                <p>Delicada dorada fresca cocinada a la plancha, servida con verduritas de temporada y un toque de limón.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* CTA Final */}
            <section className="final-cta-section text-center">
                <div className="container">
                    <h2 className="section-title">¿Listo para zarpar?</h2>
                    <p className="final-cta-text">Asegure su mesa y viva una velada inolvidable en el Mediterráneo.</p>
                    <Link to="/reservar" className="btn-primary hero-cta" style={{ marginTop: '30px' }}>
                        RESERVAR AHORA
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <p>© {new Date().getFullYear()} Costa Mallorca Cruise Dining. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

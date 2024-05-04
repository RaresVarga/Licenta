import React from 'react';
import { Link } from "@inertiajs/inertia-react"; // Asigură-te că acest import este prezent
import videoBg from '../../../../videos/8771658-hd_1920_1080_24fps.mp4';
import './sectiuni.css';
import { Fade } from "react-awesome-reveal";
import CardHomepage from '../CardHomepage/CardHomepage';
import {Contact} from '../FormularContact/Contact';
import img1 from '../../../../images/OIP.jpg';
import img2 from '../../../../images/apa.jpg';
import img3 from '../../../../images/paris.jpg';
import aboutBg from '../../../../images/alina-grubnyak-IsxaFsXi2rs-unsplash.jpg';


export default function SectiuniHomepage() {
    return (
        
        <div className="container">
                <Fade>
                    <section id="prima" className="prima">
                        <div className="videoclip">
                            <video src={videoBg} autoPlay loop muted />
                                <div className="videoScris">
                                    <div className="auth-buttons">
                                        <Link href={route('login')} className="nav-link">Autentificare</Link>
                                        <Link href={route('register')} className="nav-link">Inregistrare</Link>
                                    </div>
                                    
                                </div>
                        </div>   
                    </section>
                </Fade>

                <Fade cascade:true>
                <section id="categorii" className="categorii">
                        <h1>categorii</h1>
                        <p>Aici puteti gasi o gamă variată de obiecte de artă, 
                            meticulos selectate pentru a satisface pasiunile și gusturile fiecărui 
                            colecționar și iubitor de artă. </p>
                    <div className="cards">
                        <CardHomepage src={img1} denumire="Categoria 1" />
                        <CardHomepage src={img2} denumire="Categoria 2" />
                        <CardHomepage src={img3} denumire="Categoria 3" />
                    </div>
                </section>
                </Fade>
                
                <Fade>
                    <section id="about" className='about' style={{ backgroundImage: `url(${aboutBg})` }}>
                        <h1>about</h1>
                        <div className="about-content">
                            <div className="about-box">Text for first box
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                            Bibendum at varius vel pharetra vel turpis. Non blandit massa enim 
                            nec dui nunc. Maecenas sed enim ut sem viverra aliquet eget sit amet. 
                            Dignissim suspendisse in est ante in nibh. Sem et tortor consequat id. 
                            Sit amet cursus sit amet dictum sit amet justo. Lectus urna duis convallis 
                            convallis tellus id interdum. Ac tincidunt vitae semper quis lectus nulla at. 
                            Diam maecenas sed enim ut sem viverra aliquet eget. </div>
                            
                        </div>
                    </section>
                </Fade>

                <Fade>
                <section id="contact" className='contact'>
                    <div className='contactText'>
                        <h1>contacteaza-ne</h1>
                        <p>daca ai intrebari</p>
                    </div>
                    <div className='formular-container'>
                    <Contact/>

                    </div>
                </section>
                </Fade>
            </div>
        
      
    );
}
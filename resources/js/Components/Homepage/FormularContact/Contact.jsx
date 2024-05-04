import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './contact.css'

export const Contact = () => {
  const form = useRef();
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_54m83sy', 'template_agk024h', form.current, 'f9bvD3Se6fREpzxbX')
      .then((result) => {
        console.log('SUCCESS!', result.text);
        setMessage("Mesajul a fost transmis cu succes!"); // Setează mesajul de succes
        setSubmitted(true); // Marchează formularul ca fiind trimis
        form.current.reset(); // Resetare câmpuri formular
      }, (error) => {
        console.log('FAILED...', error.text);
        setMessage("Eroare la trimiterea mesajului. Încercați din nou."); // Setează un mesaj de eroare
      });
  };
  return (
    <div className="form-container">
  <form ref={form} onSubmit={sendEmail}>
      <label>Nume</label>
      <input type="text" name="from_name" />
      <label>Email</label>
      <input type="email" name="user_email" />
      <label>Mesaj</label>
      <textarea name="message" />
      <input type="submit" value="Send" />
  </form>
  {submitted && <p className="success-message">{message}</p>}
</div>

  );
};

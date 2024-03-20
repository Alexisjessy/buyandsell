
import React from 'react';


const ContactUs = () => {
  return (
    <div className="contact-us-container">
      <h1>Contact Us</h1>
      <p>
        Thank you for reaching out to us. We appreciate your interest. Please feel free to contact us using the information below:
      </p>

      <div className="contact-info">
        <h2>Email:</h2>
        <p>info@example.com</p>

        <h2>Phone:</h2>
        <p>(123) 456-7890</p>

        <h2>Address:</h2>
        <p>123 Main Street, Cityville, State, ZIP</p>
      </div>

      <div className="contact-form">
        <h2>Send us a Message:</h2>
      
        <form>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" />

          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" rows="4" />

          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;

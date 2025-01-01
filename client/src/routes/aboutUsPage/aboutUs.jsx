import { useContext } from "react";
import './aboutUs.scss';  // CSS for styling

const AboutUs = () => {
  return (
    <section className="about-us">
      <div className="main-section">
        <h2 className="title">About Us</h2>
        <p className="hero-description">
          Leaders in EV charging solutions, partnering globally to provide innovative energy services.
        </p>
        <div className="hero-intro"></div>
      </div>

      <div className="core-values">
        <h3 className="subtitle">Our Core Values</h3>
        <ul className="values-list">
          <li>
             <strong>Innovation</strong> - Cutting-edge technology to lead the way
          </li>
          <li>
            <strong>Honesty</strong> - Transparent solutions to build trust
          </li>
          <li>
            <strong>Service</strong> - Customer service is at the heart of everything we do
          </li>
          <li>
            <strong>Development</strong> - We strive for continuous growth and improvement
          </li>
        </ul>
      </div>

      <div className="global-reach">
        <h3 className="subtitle">Global Reach</h3>
        <p className="description">
          Our services span multiple countries, working with top companies to deliver premium EV solutions globally.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;

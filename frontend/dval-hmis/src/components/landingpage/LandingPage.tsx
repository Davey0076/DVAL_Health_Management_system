import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import landingPicture from '../../assets/images/landingPage.jpeg'
import dvalLogo from '../../assets/images/dval-logo.png'
import { FaArrowRight, FaEnvelope, FaKey, FaPhone, FaUser } from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing-page-container">
        {/* navbar section */}
        <nav>
            <div className="nav-logo">
            <img src={dvalLogo} alt="site logo" />
            </div>
            
            <div className="nav-options">
            <button onClick={() => scrollToSection("features")}>Features</button>
          <button onClick={() => scrollToSection("about-us")}>About Us</button>
            {/* <button>Contact us</button> */}
            </div>

            <div className="nav-login-register">
            <button onClick={() => navigate('/login')}><FaKey /> Login</button>
            <button onClick={() => navigate('/signup')}><FaUser /> Register</button>
            </div>
        </nav>
        <hr />

      {/* hero section */}
      <div className="hero-container">
       <div className="hero-left-section">
       <h1>Welcome 
        <br></br>DVAL Health Management Informatics</h1>
        <p>Redefining healthcare through better management</p>
        <button onClick={() => navigate('/login')}>Get Started <FaArrowRight /> </button>
       </div>
        <div className="hero-image">
        <img src={landingPicture} alt="landing picture" />
        </div>
      </div>

      {/* features and services */}
      <div className="features-container" id="features">
        <h2>Features</h2>
        <p>
          <strong>Electronic Health Records (EHR):</strong><br />Access and manage patient health
          information in real-time, improving care continuity across
          departments.
        </p>
        <p>
          <strong>Appointment Scheduling:</strong><br /> Integrated scheduling system for patient
          visits, consultations, and follow-up reminders.
        </p>
        <p>
         <strong> Flexible Design:</strong><br /> Adaptable to hospitals of all sizes, from small rural
          clinics to large urban hospitals, meeting unique needs and resources.
        </p>
        <p>
          <strong>Patient Monitoring and Follow-up:</strong><br /> Allow healthcare providers to track
          patient progress
        </p>
        <p>
          <strong>Cross-Department Data Access:</strong><br /> Facilitate collaboration with secure,
          shared access to diagnostic results, treatment history, and patient
          notes across departments.
        </p>
        <p>
          <strong>Inventory Management:</strong><br /> Monitor and manage essential medical supplies in
          real time with automated restock alerts.
        </p>
      </div>

      {/* about us, mission, vision */}
      <div className="about-us" id="about-us">
        {/* about us */}
        <h2>About Us</h2>
        <p>
          Welcome to <strong>DVAL</strong> Health System, where we are
          passionate about transforming healthcare to make it better for
          everyone—patients, providers, and healthcare teams. Our platform was
          designed from the ground up to bring simplicity, efficiency, and a bit
          of ease into the everyday tasks of managing patient care.
        </p>

        {/* our mission */}
        <h2>Our Mission</h2>
        <p>
          At <strong>DVAL</strong>, we are on a mission to make healthcare management
          smarter, more accessible, and focused on what really matters: the
          well-being of patients. We believe that by giving healthcare providers
          the right tools, they can deliver the best care possible while also
          making their own jobs a little easier.
        </p>

        {/* our vision */}
        <h2>Our Vision</h2>
        <p>
          We are working towards a future where every healthcare
          facility—whether it is a large hospital in a busy city or a small
          clinic in a rural town—has access to seamless, dependable technology.
          We want to create an environment where healthcare providers can spend
          more time with patients and less time on paperwork and administration.
        </p>

        {/* our commitment */}
        <h2>Our Commitment</h2>
        <p>
          We are dedicated to ongoing improvement, listening closely to the needs
          of our users, and staying responsive as healthcare evolves. Join us in
          our journey to make healthcare a bit simpler, a bit faster, and a
          whole lot better.
        </p>
      </div>

      {/* footer with contacts */}
      <div className="footer">
        <p><FaEnvelope />davidkwnd@gmail.com</p>
        <p><FaPhone /> +254113033470</p>
       
      </div>

      
    </div>
  );
};

export default LandingPage;

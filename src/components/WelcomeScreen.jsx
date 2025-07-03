import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PartyPopper, Ticket, Users } from "lucide-react";
import "./WelcomeScreen.css";

// Animated SVG Wave Component
function AnimatedWave() {
  return (
    <svg className="welcome-wave-svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path
        fill="#ffffff22"
        fillOpacity="1"
        d="
          M0,192L48,176C96,160,192,128,288,117.3C384,107,480,117,576,144C672,171,768,213,864,213.3C960,213,1056,171,1152,160C1248,149,1344,171,1392,181.3L1440,192L1440,0L0,0Z"
      >
        <animate
          attributeName="d"
          dur="6s"
          repeatCount="indefinite"
          values="
            M0,192L48,176C96,160,192,128,288,117.3C384,107,480,117,576,144C672,171,768,213,864,213.3C960,213,1056,171,1152,160C1248,149,1344,171,1392,181.3L1440,192L1440,0L0,0Z;
            M0,160L48,144C96,128,192,96,288,85.3C384,75,480,85,576,112C672,139,768,181,864,181.3C960,181,1056,139,1152,128C1248,117,1344,139,1392,149.3L1440,160L1440,0L0,0Z;
            M0,192L48,176C96,160,192,128,288,117.3C384,107,480,117,576,144C672,171,768,213,864,213.3C960,213,1056,171,1152,160C1248,149,1344,171,1392,181.3L1440,192L1440,0L0,0Z
          "
        />
      </path>
    </svg>
  );
}

function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="welcome-wrapper"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="welcome-header-box"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h1 className="welcome-title-text">
          <PartyPopper className="welcome-icon" /> Batch B Stream 2 POP Pool Party
        </h1>
        <p className="welcome-subtitle-text">Celebrate your Passing Out in Style!</p>
      </motion.div>

      <motion.div
        className="welcome-info-block"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <AnimatedWave />
        <p className="welcome-description">
          Get ready for the most unforgettable party of your service year! Grab your ticket now and join the celebration!
        </p>
      </motion.div>

      <div className="welcome-button-group">
        <motion.button
          onClick={() => navigate("/signup-corper")}
          className="welcome-action-btn corper"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Ticket className="welcome-icon" /> I'm a Corper – Get My Ticket
        </motion.button>

        <motion.button
          onClick={() => navigate("/signup-non-corper")}
          className="welcome-action-btn noncorper"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Users className="welcome-icon" /> I'm Not a Corper – Join the Fun
        </motion.button>
      </div>

      <motion.p
        className="welcome-footer-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        Let’s make history at the hottest POP party of the year!
      </motion.p>

      <motion.p
        className="welcome-credit-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Powered by <strong>BadMan</strong>
      </motion.p>
    </motion.div>
  );
}

export default WelcomeScreen;

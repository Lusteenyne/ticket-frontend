import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  PartyPopper,
  Sparkles,
  Gamepad2,
  Gift,
  GlassWater,
  Hourglass,
  BadgeCheck,
  LogOut
} from 'lucide-react';
import './Dashboard.css';
import fallbackArtwork from '../assets/POP CENT.jpg';

const Navbar = ({ onLogout }) => (
  <nav className="party-navbar">
    <h1><PartyPopper className="party-icon" /> IBNW BATCH B STREAM 2 POP PARTY <PartyPopper className="party-icon" /></h1>
    <button className="party-logout-btn" onClick={onLogout}>
      <LogOut className="party-icon" /> Logout
    </button>
  </nav>
);

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [globalArtwork, setGlobalArtwork] = useState(null);
  const ticketRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const rawType = localStorage.getItem('type');
      const type = rawType === 'non-corper' ? 'noncorper' : rawType;

      if (!token || !type) {
        window.location.href = rawType === 'corper' ? '/corper-login' : '/non-corper-login';
        return;
      }

      try {
        const res = await axios.get(`https://ibnw-pop-party-ticket.onrender.com/event/event-info/${type}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.eventInfo);

        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#6e00ff', '#b700ff', '#ffc107', '#ff4081'],
        });
      } catch (err) {
        console.error('Error fetching user:', err.response?.data || err.message);
        window.location.href = rawType === 'corper' ? '/corper-login' : '/non-corper-login';
      }
    };

    const fetchGlobalArtwork = async () => {
      try {
        const res = await axios.get('https://ibnw-pop-party-ticket.onrender.com/event/event-artwork');
        const artworkPath = res.data.artworkUrl;
        if (artworkPath) {
          setGlobalArtwork(artworkPath); // fixed typo here
        }
      } catch (err) {
        console.warn('Global artwork not found:', err.response?.data || err.message);
      }
    };

    fetchUser();
    fetchGlobalArtwork();
  }, []);

  useEffect(() => {
    if (!user?.date) return;

    const eventDate = new Date(user.date);
    const interval = setInterval(() => {
      const now = new Date();
      const distance = eventDate - now;

      if (distance <= 0) {
        clearInterval(interval);
        setCountdown('The party has started!');
        confetti({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.6 },
          colors: ['#6e00ff', '#b700ff', '#ffc107', '#00e5ff'],
        });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / 1000 / 60) % 60);
      const seconds = Math.floor((distance / 1000) % 60);

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [user]);

  const handleSendTicketToEmail = async () => {
    const token = localStorage.getItem('token');
    const rawType = localStorage.getItem('type');
    const type = rawType === 'non-corper' ? 'noncorper' : rawType;

    try {
      await axios.post(
        'https://ibnw-pop-party-ticket.onrender.com/event/send-ticket',
        { type },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      document.getElementById('ticket-status').innerText = 'Your ticket has been sent to your email.';
    } catch (err) {
      console.error('Ticket email error:', err);
      document.getElementById('ticket-status').innerText = 'Failed to send ticket. Try again.';
    }
  };

  const handleLogout = () => {
    const rawType = localStorage.getItem('type');
    const redirectType = rawType === 'corper' ? '/corper-login' : '/non-corper-login';
    localStorage.clear();
    window.location.href = redirectType;
  };

  if (!user) {
    return (
      <div className="party-loading-container">
        <div className="party-spinner" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const formattedDate = user.date
    ? new Date(user.date).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      })
    : 'To Be Announced';

  // Check if user.artwork is a full URL, else prefix localhost
  const artworkSrc = user.artwork
    ? (user.artwork.startsWith('http') ? user.artwork : `https://ibnw-pop-party-ticket.onrender.com${user.artwork}`)
    : globalArtwork || fallbackArtwork;

  return (
    <div className="party-container">
      <Navbar onLogout={handleLogout} />

      <section className="party-congrats">
        <h2><Sparkles className="party-icon" /> Congratulations, Aqua Mob {user.firstName}!</h2>
        <p>You’ve successfully joined the party list. Get ready to dance, vibe, and celebrate!</p>
      </section>

      <section className="party-artwork">
        <img src={artworkSrc} alt="Party Artwork" className="party-artwork-img" />
      </section>

      <section className="party-info">
        <h3><PartyPopper className="party-icon" /> Party Information</h3>
        <ul className="party-info-list">
          <li><Calendar className="party-icon" /> <strong>Date:</strong> {formattedDate}</li>
          <li><MapPin className="party-icon" /> <strong>Venue:</strong> {user.venue || 'Coming soon'}</li>
          <li><Clock className="party-icon" /> <strong>Time:</strong> {user.time || 'Coming soon'}</li>
          <li><Ticket className="party-icon" /> <strong>Note:</strong> {user.ticketNote || 'Will be made available'}</li>
        </ul>
        <p className="party-info-features">
          <GlassWater className="party-icon" /> Poolside vibes | <Gamepad2 className="party-icon" /> Games | <Gift className="party-icon" /> Giveaways
        </p>
        <p className="party-info-description">
          This is the party of the year. Dress to impress, bring your energy, and let's celebrate our NYSC journey in style!
        </p>
        {countdown && (
          <div className="party-info-countdown">
            <h4><Hourglass className="party-icon" /> Countdown to Party:</h4>
            <p className={countdown.includes('started') ? 'party-countdown-live' : ''}>{countdown}</p>
          </div>
        )}
      </section>

      <section className="party-ticket-section">
        <h3><Ticket className="party-icon" /> Your Party Ticket</h3>
        <div className="party-ticket-wrapper" ref={ticketRef}>
          <div className="party-ticket-left">
            <div className="party-ticket-barcode" />
            <p>ADMIT ONE</p>
            <p>Ticket No.<br />{user.ticketId || 'TBD'}</p>
          </div>
          <div className="party-ticket-right">
            <h2>POP PARTY 2025</h2>
            <p className="party-ticket-id">No. {user.ticketId || 'TBD'}</p>
            <p>Name: <span>Aqua Mob {user.lastName} {user.firstName}</span></p>
            <p>Date: <span>{formattedDate}</span></p>
            <p>Local Government: <span>{user.localGov}</span></p>
            <p className="party-ticket-congrats"><BadgeCheck className="party-icon" /> Congratulations</p>
          </div>
        </div>
        <button className="party-ticket-download-btn" onClick={handleSendTicketToEmail}>
          Get Ticket
        </button>
        <p id="ticket-status" style={{ marginTop: '10px', color: '#6e00ff', fontWeight: 'bold' }}></p>
      </section>
    </div>
  );
};

export default Dashboard;

// src/pages/index.js

import React from 'react';

export default function LandingPage() {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div style={styles.body}>
      <header style={styles.header}>
        Solucio AI
      </header>
      <div style={styles.container}>
        <h1 style={styles.title}>Discover Delicious Food Around You</h1>
        <p style={styles.subtitle}>Let us recommend the best restaurants based on your taste</p>
        <a
          href="#"
          style={isHovered ? { ...styles.button, ...styles.buttonHover } : styles.button}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Get Started
        </a>
      </div>
      <div style={styles.imagesContainer}>
        <img src="/images/food1.jpg" alt="Delicious food" style={styles.image} />
        <img src="/images/food2.jpg" alt="Delicious food" style={styles.image} />
        <img src="/images/food3.jpg" alt="Delicious food" style={styles.image} />
      </div>
    </div>
  );
}

const styles = {
  body: {
    margin: 0,
    fontFamily: 'Roboto, sans-serif',
    backgroundColor: '#fff8e1',
    color: '#333',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
  },
  header: {
    width: '100%',
    padding: '20px',
    backgroundColor: '#ff7043',
    color: 'white',
    textAlign: 'center',
    fontSize: '2em',
  },
  container: {
    padding: '20px',
  },
  title: {
    fontSize: '3em',
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '1.2em',
    marginBottom: '40px',
    color: '#555',
  },
  button: {
    padding: '15px 30px',
    fontSize: '1em',
    color: 'white',
    backgroundColor: '#ff7043',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  buttonHover: {
    backgroundColor: '#e64a19',
  },
  imagesContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '40px',
  },
  image: {
    width: '200px',
    height: '200px',
    margin: '0 10px',
    borderRadius: '10px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
};

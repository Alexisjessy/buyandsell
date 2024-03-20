import React from 'react';

const Page404 = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Erreur 404</h1>
      <p style={styles.message}>Sorry, the page you are looking for could not be found.</p>
    
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
  },
  title: {
    fontSize: '2em',
    color: '#333',
  },
  message: {
    fontSize: '1.2em',
    color: '#555',
    margin: '10px 0',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    marginTop: '20px',
  },
};

export default Page404;

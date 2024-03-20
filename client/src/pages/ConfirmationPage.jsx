import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ConfirmationPage = () => {
  const { confirmationCode } = useParams();
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [isCodeValid, setIsCodeValid] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/confirm/${confirmationCode}`);

        if (response.status === 200) {
          setIsCodeValid(true);
          setConfirmationMessage('Your account has been successfully confirmed. You can now connect.');
          setTimeout(() => {
            setConfirmationMessage('');
          }, 60000); 
          return;
        } 
        if (response.status === 410) {
          setConfirmationMessage('Expired confirmation code.');
        } else {
          setConfirmationMessage('Invalid confirmation code.');
        }
      } catch (error) {
        console.error('Error confirming account:', error);
        setConfirmationMessage('Error confirming account.');
      }
    };

    fetchData();
  }, [confirmationCode]);

  return (
    <section>
      {isCodeValid && <img className="logo_validate" src="../../public/img/validate.png" alt="Validation" />}
      <h2>Confirmation de votre compte</h2>
      <p>{confirmationMessage}</p>
      {confirmationMessage.includes('expiré') && !isCodeValid && (
        <img className="logo_fail" src="../../public/img/Red-Cross.png" alt="fail" />
      )}
      {isCodeValid && (
        <button>
          <Link to="/login">Connexion</Link>
        </button>
      )}
    </section>
  );
};

export default ConfirmationPage;

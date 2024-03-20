import React, { useState } from 'react';
import zxcvbn from 'zxcvbn';
import { useRegisterUserMutation } from '../features/api/apiSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { BsSendFill } from "react-icons/bs";
import { useTranslation } from 'react-i18next';

export default function LoginPage(props) {
  
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
  const [formShake, setFormShake] = useState(false);

  const [passwordConditions, setPasswordConditions] = useState([
     { label: t('8 characters minimum', { lng: 'lao' }), isValid: false },
     { label: t('1 digit minimum', { lng: 'lao' }), isValid: false },
     { label: t('1 lower case letter minimum', { lng: 'lao' }), isValid: false },
    { label: t('1 upper case letter minimum', { lng: 'lao' }), isValid: false },
    { label: t('1 special character minimum', { lng: 'lao' }), isValid: false },
    { label: t('50 characters maximum', { lng: 'lao' }), isValid: false },
  ]);

  const [registerUser, registerUserRequest] = useRegisterUserMutation();
  const navigate = useNavigate();

  function handlePasswordChange(e) {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const passwordResult = zxcvbn(newPassword);

    const updatedConditions = passwordConditions.map((condition, index) => {
      if (index === 0) {
        condition.isValid = newPassword.length >= 8;
      } else if (index === 1) {
        condition.isValid = passwordResult.score > 0;
      } else if (index === 2) {
        const hasLowercase = /[a-z]/.test(newPassword);
        condition.isValid = hasLowercase;
      } else if (index === 3) {
        const hasUppercase = /[A-Z]/.test(newPassword);
        condition.isValid = hasUppercase;
      } else if (index === 4) {
        const hasSpecialCharacter = /[!@#$%^&*()_+={}\[\]:;<>,.?~\\/-]/.test(newPassword);
        condition.isValid = hasSpecialCharacter;
      } else if (index === 5) {
        condition.isValid = newPassword.length <= 50;
      }
      return condition;
    });

    setPasswordConditions(updatedConditions);
  }

  async function handleUserRegister(e) {
    e.preventDefault();

    if (registerUserRequest.isLoading) {
      return;
    }

    if (!username || !email || !password || !confirmPassword) {
      setFormShake(true);
      setErrorMessages([t('Please fill in all mandatory fields.')]);
      return;
    }

    if (password !== confirmPassword) {
      setFormShake(true);
      setErrorMessages([t('Passwords do not match')]);
      return;
    }

    if (passwordConditions.some((condition) => !condition.isValid)) {
      setFormShake(true);
      setErrorMessages([t('The password does not meet all conditions.')]);
      return;
    }

    try {
      const response = await registerUser({
        username,
        firstname,
        lastname,
        email,
        password,
      });

      if (response.error) {
        const errorData = await response.error.data;

        console.error(errorData);

        if (errorData.error === 'username_taken') {
          setErrorMessages([t('Sorry, This nickname is already taken. Please choose another one.')]);
        } else if (errorData.error === 'email_taken') {
          setErrorMessages([t('This email is already in use. Please choose another email.')]);
        } else {
          setErrorMessages([t('An unexpected error has occurred.')]);
        }

        setFormShake(true);
        return;
      }

      if (response.data) {
        setSuccessMessage(t('An email with a confirmation link has been sent to your email address.'));
      }
    } catch (error) {
      console.error(error);
      setErrorMessages([t('An unexpected error has occurred.')]);
      setFormShake(true);
    }
  }

  return (
    <main className="container">
      <aside className="aside">
        <p>{t('Welcome Back')}</p>
        <Link to="/login">
          <button>{t('Login')}</button>
        </Link>
      </aside>

      <section className="content register-section">
        <h1>{t('Create an Account')}</h1>
        <p className="clear"></p>

        {registerUserRequest.isLoading ? (
          <Loader />
        ) : registerUserRequest.isSuccess ? (
          <p className="success-message">{successMessage}</p>
        ) : (
          <form onSubmit={handleUserRegister} encType="multipart/form-data" className={formShake ? 'shake' : ''}>
            {errorMessages && errorMessages.length > 0 && (
              <div className="error-messages">
                {errorMessages.map((errorMessage, index) => (
                  <p key={index}>{errorMessage}</p>
                ))}
              </div>
            )}
             <label htmlFor="username"></label>
            <input
              required
              id="username"
              type="text"
              placeholder={t('Username')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
             <label htmlFor="firstname"></label>
            <input
              id="firstname"
              type="text"
              placeholder={t('Firstname')}
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
             <label htmlFor="lastname"></label>
            <input
              id="lastname"
              type="text"
              placeholder={t('Name')}
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
             <label htmlFor="password"></label>
            <input
              required
              id="password"
              type="password"
              placeholder={t('Password')}
              value={password}
              onChange={handlePasswordChange}
            />
            <div className="validation-card">
              {passwordConditions.map((condition, index) => (
                <p key={index} className={`card ${condition.isValid ? 'valid' : 'invalid'}`}>
                  {condition.isValid ? '\u2713' : 'X'} {condition.label}
                </p>
              ))}
            </div>
            <label htmlFor="confirmPassword"></label>
            <input
              required
              id="confirmPassword"
              type="password"
              placeholder={t('Confirm password')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
             <label htmlFor="email"></label>
            <input
              required
              id="email"
              type="email"
              placeholder={t('Email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button>{t('Create my account')}</button>
          </form>
        )}
      </section>
    </main>
  );
}

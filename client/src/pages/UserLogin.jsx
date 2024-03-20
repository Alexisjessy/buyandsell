import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import { useLoginUserMutation } from '../features/api/apiSlice';
import { setUser } from '../features/session/sessionSlice';
import { useDispatch } from 'react-redux';
import Loader from '../components/Loader';

export default function UserLogin(props) {
    const { t } = useTranslation(); 

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const [attempts, setAttempts] = useState(0);
    const [blocked, setBlocked] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const [loginUser, loginUserRequest] = useLoginUserMutation();
    
    /* **If the user enters the wrong password three times he is blocked for 5 minutes * */
    useEffect(() => {
        const blockDuration = 5 * 60;

        const startBlockedTime = parseInt(localStorage.getItem('blockedTime') || '0', 10);
        const currentTime = Math.floor(Date.now() / 1000);

        if (currentTime - startBlockedTime < blockDuration) {
            setBlocked(true);
            setCountdown(blockDuration - (currentTime - startBlockedTime));
            const intervalId = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);

            return () => {
                clearInterval(intervalId);
            };
        } else {
            setBlocked(false);
            localStorage.removeItem('blockedTime');
        }
    }, []);

    const handleUserLogin = async (e) => {
        e.preventDefault();

        if (loginUserRequest.isLoading) {
            return;
        }

        if (email.trim() === '' || password.trim() === '') {
            return;
        }

        if (blocked) {
            return;
        }

        const result = await loginUser({ email, password });

        if (result.data && result.data.success) {
            dispatch(setUser(result.data.user));

            setAttempts(0);
            setBlocked(false);
            setCountdown(0);
            localStorage.removeItem('blockedTime');
        } else {
            setAttempts(attempts + 1);

            if (attempts >= 3) {
                setBlocked(true);
                const blockDuration = 5 * 60;
                localStorage.setItem('blockedTime', Math.floor(Date.now() / 1000).toString());
                setCountdown(blockDuration);
                const intervalId = setInterval(() => {
                    setCountdown(prevCountdown => prevCountdown - 1);
                }, 1000);

                return () => {
                    clearInterval(intervalId);
                };
            }
        }
    };

    let content;
    if (loginUser.isLoading) {
        content = <Loader />;
    } else {
        content = (
            <>
                {blocked && countdown > 0 ? (
                    <div className="error-message">
                        {t('Too many attempts, please try again later:')}
                        <p className="countdown">{Math.floor(countdown / 60)}:{countdown % 60}</p>
                    </div>
                ) : (
                    <>
                        {loginUserRequest.isError && <p className="error-messages">{t('Authentication error.')}</p>}
                        {loginUserRequest.isSuccess ? (<div>
                            <img className="logo_validate" src="../../public/img/validate.png" alt="Validation" />
                            <p className="success-message">{t('You have been successfully logged in.')}</p></div>
                        ) : (
                            <form action="" method="" onSubmit={handleUserLogin}>
                                <input 
                                required id="email" 
                                type="email" 
                                placeholder={t('Email')} 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                />
                                <input required id="password" 
                                type="password" placeholder={t('Password')}
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                />
                                <button disabled={blocked}>{t('Login')}</button>
                            </form>
                        )}
                    </>
                )}
            </>
        );
    }

    return (
        <main className="container">
            <section className="content login-section">
                <h1>{t('Login')}</h1>
                <p className="clear"></p>
                {content}
            </section>
            <aside className="aside">
                <p>{t('New Here ?')}</p>
                <Link to="/register">
                    <button>{t('Register')}</button>
                </Link>
            </aside>
        </main>
    );
}

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { unsetUser } from '../features/session/sessionSlice';
import { useNavigate } from 'react-router-dom';
import { useLogoutUserMutation } from '../features/api/apiSlice';
import Loader from '../components/Loader';

export default function Logout(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutUser, logoutUserRequest] = useLogoutUserMutation();

    useEffect(() => {
        const logOut = async () => {
            try {
                
                const result = await logoutUser();
               

                if (result.data.message === 'End of session') {
                    dispatch(unsetUser());
                     document.userLastInteraction = new Date();
                     localStorage.clear();
                     sessionStorage.clear();
                    navigate('/login');
                     window.location.reload();
                } else {
                    console.error('Déconnexion échouée');
                }
            } catch (error) {
                console.error('Error during logout:', error);
            }
        };

        logOut().catch(console.error);
    }, [dispatch, logoutUser, navigate]);

    let content;
    if (logoutUserRequest.isLoading) {
        content = <Loader />;
    } else if (logoutUserRequest.isError) {
        content = <p className="error-message">Logout fail, re-try.</p>;
    } else {
    
       content= <p className="success-message">Logout sucess !
      <img className="logo_validate" src="../../public/img/validate.png" alt="Validation" />
         </p>
    }

    return (
        <main className="container">
            <section id="login">
                <h1>Déconnexion</h1>
                <p className="clear"></p>
                {content}
            </section>
        </main>
    );
}

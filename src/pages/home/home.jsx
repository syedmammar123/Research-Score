import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import styles from './index.module.css';
import ResearchRatingComponent from '../../components/ResearchRating/index';


const Home = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleLogout = async () => {
        await signOut(auth);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const email = user.email;

                const q = query(collection(db, 'users'), where('email', '==', email));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs[0].data();
                    setUserData(userData);
                } else {
                    navigate('/register');
                }
            } else {
                // Handle case where user is not logged in
                navigate('/login');
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);


    

    if (loading) {
        return  (
      <div className={styles['loading-overlay']}>
        <div className={styles['loading-spinner']}></div>
        <div className={styles['loading-text']}>Loading...</div>
      </div>
    );
    }

    return (
        <>  
        <div className={styles.navBar} >
            <div className={styles.homeBtn} onClick={()=>window.location.reload()} >Home</div>
            <div className={styles.welcome}>Welcome, <span style={{color:"green"}}>{userData.firstName}</span></div>
            <div>
                <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
            </div>
        </div>

            {userData && <ResearchRatingComponent userData={userData} />}
        </>
    );
};

export default Home;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {auth, db} from '../../firebase'
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import styles from './index.module.css';


const Register = (props) => {
    const [userEmail,setUserEmail] = useState('')
    const [loading, setLoading] = useState(true);


    
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    // email: '',
    institution: '',
    specialty: ''
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
            const email = user.email;

            const q = query(collection(db, 'users'), where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                navigate('/');
            } else {
                // navigate('/');
                setUserEmail(user.email)
                  
            }
        } else {
            // Handle case where user is not logged in
            navigate('/login');
        }
              setLoading(false);


    });

    return unsubscribe;
}, []);


    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.firstName || !formData.lastName  || !formData.institution ) {
    alert('Please fill out all fields.');
    return;
  }
  // Check if Specialty is not set to "Select Specialty"
  if (formData.specialty === "") {
    alert('Please select a specialty.');
    return;
  }

  try {
     
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: auth.currentUser?.email,
      institution: formData.institution,
      specialty: formData.specialty
    };

    // Add user data to Firestore collection
    const docRef = await addDoc(collection(db, 'users'), userData);
    navigate('/')

  } catch (error) {
    console.error(error);
    alert(error.message)
  }
};

    if (loading) {
        return  (
      <div className={styles['loading-overlay']}>
        <div className={styles['loading-spinner']}></div>
        <div className={styles['loading-text']}>Loading...</div>
      </div>
    );
    }
    

    return (
      <div className={styles.container}>
     <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h1 style={{textAlign:"center"}}>Registration Form</h1>
      <label className={styles.label}>
        First Name:
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          className={styles.inputField}
          placeholder="Enter your first name..."

        />
      </label>
      <label className={styles.label}>
        Last Name:
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          className={styles.inputField}
          placeholder="Enter your last name..."
        />
      </label>
      <label className={styles.label}>
        Email Address:
        <input
          type="text"
          name="email"
          value={auth.currentUser?.email || ""}
          disabled
          // onChange={handleInputChange}
          className={styles.inputField}
          placeholder="Enter your email..."

        />
      </label>
      <label className={styles.label}>
        Institution:
        <input
          type="text"
          name="institution"
          value={formData.institution}
          onChange={handleInputChange}
          className={styles.inputField}
          placeholder="Enter your institution name..."

        />
      </label>
      <label className={styles.label}>
        Specialty:
        <select
          name="specialty"
          value={formData.specialty}
          onChange={handleInputChange}
          className={styles.selectField}

        >
          <option value="">Select Specialty</option>
          <option value="Anesthesiology">Anesthesiology</option>
          <option value="Dermatology">Dermatology</option>
          <option value="Emergency Medicine">Emergency Medicine</option>
          <option value="Family Medicine">Family Medicine</option>
          <option value="Internal Medicine">Internal Medicine</option>
          <option value="Medical Genetics">Medical Genetics</option>
          <option value="Neurology">Neurology</option>
          <option value="Neurosurgery">Neurosurgery</option>
          <option value="Nuclear Medicine">Nuclear Medicine</option>
          <option value="Obstetrics and Gynecology">Obstetrics and Gynecology</option>
          <option value="Ophalmology">Ophalmology</option>
          <option value="Orthapedic Surgery">Orthapedic Surgery</option>
          <option value="Otolaryngology">Otolaryngology</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="Physical Medicine and Rehabilitation">Physical Medicine and Rehabilitation</option>
          <option value="Plastic Surgery">Plastic Surgery</option>
          <option value="Preventative Medicine">Preventative Medicine</option>
          <option value="Psychiatry">Psychiatry</option>
          <option value="Radiology">Radiology</option>
          <option value="Surgery">Surgery</option>
          <option value="Thoracic Surgery">Thoracic Surgery</option>
          <option value="Urology">Urology</option>
          <option value="Vascular Surgery">Vascular Surgery</option>
        </select>
      </label>
      <input type="submit" value="Submit" className={styles.submitButton} />

    </form>
    </div>


    );
}

export default Register
 

 

 

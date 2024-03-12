import React, { useEffect, useState } from 'react';
import ProductInfo from '../ResearchProducts';
import styles from './index.module.css';
import {auth, db} from '../../firebase'
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';



const ResearchRatingComponent = ({userData}) => {
    const [showRatingComp,setShowRatingComp] = useState(true)

    const [ratings, setRatings] = useState({
        totalNumberOfResearchProducts: 0,
        researchRelatesToSpecialty: 0,
        firstAuthorOnProject: 0,
        peerReviewedJournalArticles: 0,
        abstractResearch: 0,
        publishedResearch: 0,
        impactFactorOfJournals: 0
    });

    const handleRatingChange = (event, characteristic) => {
        const value = parseFloat(event.target.value);
        setRatings(prevState => ({
        ...prevState,
        [characteristic]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
        // Reference to the document for the current user
        const userDocRef = doc(db, 'ratings', auth.currentUser?.email);

        // Check if the document exists
        const docSnap = await getDoc(userDocRef);

        if(docSnap.exists()){
            await updateDoc(userDocRef,
                ratings
            )
        }else {
            // If the document doesn't exist, create it and set the form data
            await setDoc(userDocRef, ratings);
        }
        
        setShowRatingComp(false)  

    } catch (error) {
        console.error('Error saving ratings: ', error);
        alert(error.message)
    }
    };

    const fetchData = async () => {
        try {
          const q = query(collection(db, 'ratings'),where('__name__', '==', auth.currentUser?.email));
          
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                setRatings(userData)
          } else {
            //do nothing.
          } 
          
        }catch (error) {
          console.error('Error getting ratings: ', error);
          alert(error.message)
        }                
    };
    
    useEffect(() => {
      fetchData()
    }, []);


return (
    <>{
      showRatingComp ? (

        <form onSubmit={handleSubmit} className={styles.mainContainer}>
        <div className={styles.container} >
           
          <label>
            A. Total Number of Research Products:
            <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={ratings.totalNumberOfResearchProducts}
                onChange={(event) => handleRatingChange(event, 'totalNumberOfResearchProducts')}
                />
            <div>
            <input
              type="range"
              min={0}
              max={10}
              step={0.1}
              value={ratings.totalNumberOfResearchProducts}
              onChange={(event) => handleRatingChange(event, 'totalNumberOfResearchProducts')}
            />
              
            </div>
            
   
          </label>
        </div>
        


          <div className={styles.container} >
            <label >
              B. Having Research that Relates to Your Specialty:
               <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={ratings.researchRelatesToSpecialty}
                onChange={(event) => handleRatingChange(event, 'researchRelatesToSpecialty')}
                />
              <div>
                <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.1}
                    value={ratings.researchRelatesToSpecialty}
                    onChange={(event) => handleRatingChange(event, 'researchRelatesToSpecialty')}
                />
               
               

              </div>

            </label>
          </div>

          <div className={styles.container} >
            C. Being First Author on the Project:

              <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={ratings.firstAuthorOnProject}
                onChange={(event) => handleRatingChange(event, 'firstAuthorOnProject')}
              />
            <label >
              <div>
                <input
                type="range"
                min={0}
                max={10}
                step={0.1}
                value={ratings.firstAuthorOnProject}
                onChange={(event) => handleRatingChange(event, 'firstAuthorOnProject')}
                
              />
            

              </div>
              
            </label>
          </div>

          <div className={styles.container} >
            <label >
              D. Having research that is categorized as "Peer-Reviewed Journal Articles" rather than other types of research products (abstracts, presentations, etc.)
               <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={ratings.peerReviewedJournalArticles}
                onChange={(event) => handleRatingChange(event, 'peerReviewedJournalArticles')}
                />
              <div>
                <input
                type="range"
                min={0}
                max={10}
                step={0.1}
                value={ratings.peerReviewedJournalArticles}
                onChange={(event) => handleRatingChange(event, 'peerReviewedJournalArticles')}
                />
               

              </div>
            </label>
          </div>

          <div className={styles.container} >
            <label >
              E. Having research that is categorized as "Abstract" or "Presentation":
                <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={ratings.abstractResearch}
                onChange={(event) => handleRatingChange(event, 'abstractResearch')}
              />
              <div>
                <input
                type="range"
                min={0}
                max={10}
                step={0.1}
                value={ratings.abstractResearch}
                onChange={(event) => handleRatingChange(event, 'abstractResearch')}
              />


              </div>
              
            </label>
          </div>

          <div className={styles.container}>
            <label >
              F. Number of research products that are published (rather than accepted or submitted):
                            <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={ratings.publishedResearch}
                onChange={(event) => handleRatingChange(event, 'publishedResearch')}
              />
              <div>
                <input
                type="range"
                min={0}
                max={10}
                step={0.1}
                value={ratings.publishedResearch}
                onChange={(event) => handleRatingChange(event, 'publishedResearch')}
              />


              </div>
              
            </label>
          </div>

          <div className={styles.container}>
            <label >
              G. Impact Factor of the journals published in/submitted to:
               <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={ratings.impactFactorOfJournals}
                onChange={(event) => handleRatingChange(event, 'impactFactorOfJournals')}
                
              />
              <div>
                <input
                type="range"
                min={0}
                max={10}
                step={0.1}
                value={ratings.impactFactorOfJournals}
                onChange={(event) => handleRatingChange(event, 'impactFactorOfJournals')}
              />
              </div>
              
            </label>
          </div>

          <button type="submit"  className={styles.submitButton}>Submit Ratings</button>
        </form>


      ):(
     <>
        <ProductInfo userData={userData} ratings={ratings}  />
     </>
      )
      }

    </>
  );

};

export default ResearchRatingComponent;
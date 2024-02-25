import React, { useState } from 'react';
import ProductInfo from '../ResearchProducts';
import styles from './index.module.css';


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

    const handleSubmit = (event) => {
        event.preventDefault();
        setShowRatingComp(false)  
    };

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


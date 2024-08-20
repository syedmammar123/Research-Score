import OpenAI from "openai";
import { sleep } from "openai/core";
import { useEffect, useState } from "react";
import styles from './index.module.css';
import { impactData } from "./ImpactFactor";


const Result = ( {userData,rating,stdData,characteristics}) => {
  const [loading, setLoading] = useState(true);
  const [result,setResult] = useState([])
  const [resData,setResData] = useState([])
  const [stdName,setStdName] = useState('')

  var userSpecialty = userData.specialty
  
  const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_KEY,
  dangerouslyAllowBrowser: true
  });

  var userSpecialty = "Radiology"
  // var userSpecialty = "Neurology"

  const countFirstName1 = (fName,lName,products)=>{
    let count = 0
    let allAuthors = []
    
    for(let i = 0; i<products.length ;i++){
      allAuthors.push(products[i].authors)
      fName,lName
      //[[],[],[],[]]

      if(fName===authorList[0].firstName){
        count++;
      }
    }

    console.log(count)
    return count;
  }

  const terminalStates = ["cancelled", "failed", "completed", "expired"];
  const statusCheckLoop = async (threadID, runId) => {
      const run = await openai.beta.threads.runs.retrieve(
        threadID,
        runId
    );

    if(terminalStates.indexOf(run.status) < 0){
        await sleep(1000);
        return statusCheckLoop(threadID, runId);
    }
    return run.status;
  }

  const  countSpecialty = async(specialty,products) =>{
    let title = []
    
    for(let i = 0; i<products.length; i++){
      title.push(products[i].title)
    }
    
    const message = await openai.beta.threads.messages.create(
      import.meta.env.VITE_THREAD_ID_1,
    {
      role: "user",
      content: `Specialty:${specialty} \n${title}`
    })

    const run = await openai.beta.threads.runs.create(
      import.meta.env.VITE_THREAD_ID_1,
    { 
      assistant_id:import.meta.env.VITE_ASST_ID_1
    }
    );

    const status = await statusCheckLoop(import.meta.env.VITE_THREAD_ID_1, run.id);

    const messages = await openai.beta.threads.messages.list(
      import.meta.env.VITE_THREAD_ID_1,
    );
    let response = messages.data[0].content[0].text.value;
    var num = parseInt(response);
    console.log(`For 2: ${specialty}is : ${response}`);
    return num;
  }

  const  countFirstName = async (fName,lName,products) =>{
    let authorList = []
    
    for(let i = 0; i<products.length; i++){
      authorList.push(products[i].authors[0])
    }
    console.log(authorList)
    
    const message = await openai.beta.threads.messages.create(
      import.meta.env.VITE_THREAD_ID_2,
    {
      role: "user",
      content: `Name:${fName} ${lName} \nauthorList ${authorList}`
    })

    const run = await openai.beta.threads.runs.create(
      import.meta.env.VITE_THREAD_ID_2,
    { 
      assistant_id:import.meta.env.VITE_ASST_ID_2
    }
    );

    const status = await statusCheckLoop(import.meta.env.VITE_THREAD_ID_2, run.id);

    const messages = await openai.beta.threads.messages.list(
      import.meta.env.VITE_THREAD_ID_2,
    );
    let response = messages.data[0].content[0].text.value;
    var num = parseInt(response);
    console.log(`for 3: ${fName} ${lName}: ${response}`);

    return num;
  }

  const countPeerReviewedArticles = (products)=>{
    let count = 0;
      for(let i = 0; i<products.length ;i++){
        if(products[i].researchType==="Peer-reviewed publication"){
          count++;
        }
    }

    console.log(`for 4: : ${count}`);
    return count;
  }
  
  const countAbstractResearch = (products)=>{
    let count = 0;
    
    for(let i = 0; i<products.length ;i++){
      if(products[i].researchType==="Abstract" || products[i].researchType==="Presentation" ){
          count++;
      }
    }

    console.log(`for 5: : ${count}`);

    return count;
  }

  const countPublished = (products)=>{
    let count = 0;
      for(let i = 0; i<products.length ;i++){
        if(products[i].publicationStatus==="Published"){
          count++;
        }
    }

    console.log(`for 6: : ${count}`);

    return count;
  }  

  const searchImpact = (journalName) => {
    let highestIF = -Infinity;
    let found = false;

    journalName = journalName.trim().toLowerCase();

    for (let i = 0; i < impactData.length; i++) {
      const data = impactData[i];
      const dataLowerCase = data['Journal name'].toLowerCase();
      
      if (dataLowerCase === journalName) {
        found = true;
        const jif = data['2022 JIF'];
        if (jif > highestIF) {
          highestIF = jif;
        }
      }
    }

    if (found) {
      return highestIF;
    } else {
      
      
      return null;
    }
  }
    
  const countImpact = (products) => {
    let count = 0; 
    let totalPeerReviewed = 0; 
    
    for(let i = 0; i < products.length; i++) {
      if(products[i].researchType==="Peer-reviewed publication"){
        
        totalPeerReviewed++;
          
        const journalName = products[i].publicationName;
        const impactFactor = searchImpact(journalName);

        if (impactFactor !== null) {
          if (impactFactor >= 0.1 && impactFactor <= 2.0) {
            count += 1;
          } else if (impactFactor >= 2.1 && impactFactor <= 4.0) {
            count += 2;
          } else if (impactFactor >= 4.1 && impactFactor <= 6.0) {
            count += 3;
          } else if (impactFactor >= 6.1 && impactFactor <= 10.0) {
            count += 4;
          } else if (impactFactor >= 10.1) {
            count += 5;
          }
        } else {
          count += 1.5;
        }

      }
    }

    if (totalPeerReviewed === 0) {
      console.log("No peer-reviewed products found.");
      console.log(`For impact factor: ${count}`);
    } else {
      count = count / totalPeerReviewed;
      console.log(`For impact factor: ${count}`);
    }
    return count;
  }

  const calculations = async ()=>{
    const totalRating = Object.values(rating).reduce((acc,curr)=>acc+curr,0)

    for(let i=0;i<stdData.length;i++){

      let currentStd = stdData[i];
      let score = 0;
      setStdName(currentStd.fName)

      //a
      score = currentStd.researchProducts.length * (rating.totalNumberOfResearchProducts);
      console.log(`1: ${currentStd.researchProducts.length}`);

      //b 
      let specialtyCount = await countSpecialty(userSpecialty,currentStd.researchProducts)
      score += specialtyCount * (rating.researchRelatesToSpecialty)

      //c
      let fNameCount = await countFirstName(currentStd.fName,currentStd.lName,currentStd.researchProducts)
      score += fNameCount * (rating.firstAuthorOnProject)

      //d 
      let peerReviewedCount = countPeerReviewedArticles(currentStd.researchProducts)
      score += peerReviewedCount * (rating.peerReviewedJournalArticles)
      
      //e 
      let abstractResearchCount = countAbstractResearch(currentStd.researchProducts)
      score += abstractResearchCount * (rating.abstractResearch)
      
      //f
      let publishedCount = countPublished(currentStd.researchProducts)
      score += publishedCount * (rating.publishedResearch)

      //g
      let impactFactorCount = countImpact(currentStd.researchProducts)
      score += impactFactorCount * (rating.impactFactorOfJournals)
      
      let final = {
        name:currentStd.fName+" "+currentStd.lName,
        score
      }

      resData.push(final)
    }

    resData.sort((a,b)=>b.score-a.score)
    setResult(resData)

    setLoading(false)
  }

  useEffect(()=>{
    calculations()
  },[])

   if (loading) {
        return  (
      <div className={styles['loading-overlay']}>
        <div className={styles['loading-spinner']}></div>
        <div className={styles['loading-text']}>Processing Results for {stdName}...</div>
      </div>
    );
    }

  return (
    <div>
        <div >

        {result.length > 0 && (
          <div className={styles.container} >
            <div className={styles.mainHeader}>
              <div className={styles.mainHeader1}>Rank #</div>
              <div className={styles.mainHeader2}>Name</div>
              <div className={styles.mainHeader3}>Score</div>
            </div>
          
          <div className={styles.sce}>
      
            <table >
              <tbody>
                     
            {result?.map((item, index) => (
            <tr  key={index}>
              <td className={styles.mainHeader1}>{index+1}</td>
              <td className={styles.mainHeader2}>{item.name}</td>
              <td className={styles.mainHeader3}>{item.score.toFixed(1)}</td>
            </tr>
                
            ))}
            </tbody>
            </table>
          </div>
          </div>
        ) }
        </div>
    </div>   
    )

}

export default Result

import { useEffect, useState } from "react";
import styles from './index.module.css';
import { createPdf } from "../../utils/createPdf";
import { dummyResult } from "../../mocks/mockData";
import { countAbstractResearch, countFirstName, countImpact, countPeerReviewedArticles, countPublished, countSpecialty, lorInfo, sopInfo } from "../../utils/calculationsHelper";



const Result = ( {userData,rating,stdData}) => {
  const [loading, setLoading] = useState(true);
  const [result,setResult] = useState([])
  const [resData,setResData] = useState([])
  const [stdName,setStdName] = useState('')
  const [selectedProperty,setSelectedProperty] = useState('research')

  var userSpecialty = userData.specialty
  // var userSpecialty = "Radiology"
  // var userSpecialty = "Neurology"

  useEffect(()=>{
    calculations()
  
  },[])

  // useEffect(()=>{
  //   setLoading(false)
  //   setResult(dummyResult)
  // },[])
  
  const calculations = async ()=>{
    const totalRating = Object.values(rating).reduce((acc,curr)=>acc+curr,0)


    for(let i=0;i<stdData.length;i++){

      let startTime = new Date().getTime()

      let currentStd = stdData[i];
      let score = 0;
      setStdName(currentStd.fName)

      //a
      let researchProductsCount = currentStd.researchProducts.length * (rating.totalNumberOfResearchProducts);
      score = researchProductsCount
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

      let sopScore = await sopInfo(rating.selectedCheckboxes,currentStd.sop)
      let lorScore = await lorInfo(rating.selectedCheckboxes, currentStd.lors);    
      
      console.log("Sop Score ",sopScore?.matchedCharacteristics)
      console.log("Lor scores",lorScore?.matchedCharacteristics)

      let final = {
        name:currentStd.fName+" "+currentStd.lName,
        researchScore:score,
        sopScore,
        lorScore, 
        // prefferedRating: (sopScore!=="NA" )? Math.floor(
        //   (Number(sopScore?.percentageMatchInSOP.replace('%', '') || 0) )
        // )
        // :"NA"
        // prefferedRating: (sopScore!=="NA" && lorScore!=="NA")? Math.floor(
        //   (Number(sopScore?.percentageMatchInSOP.replace('%', '') || 0) +
        //   Number(lorScore?.percentageMatchInLOR.replace('%', '') || 0)) / 2
        // )
        // :"NA",
        pic:currentStd.studentImage,
        dob:currentStd.dob,
        medSchool:currentStd.collegeName,
        lor:currentStd.lors,
        sop:currentStd.sop,
        researchProductsCount:currentStd.researchProducts.length,
        specialtyCount,
        fNameCount,
        peerReviewedCount,
        abstractResearchCount,
        publishedCount,
        id:i+1
      }

      let endTime = new Date().getTime()

      console.log("Time for ",i,(endTime-startTime)/1000)


      resData.push(final)
    }

    resData.sort((a,b)=>b.researchScore-a.researchScore)
    console.log(resData)
    setResult(resData)

    setLoading(false)
  }


  const handleSort = (val) => {
    setSelectedProperty(val);
    setResult(prevResult => {
      return [...prevResult].sort((a, b) => {
        if (val === 'research') {
          return b.researchScore - a.researchScore; 
        } else if (val === 'sopScore') {
          return Number((b.sopScore.matchedCharacteristics[0])) - 
                Number((a.sopScore.matchedCharacteristics[0])); 
        } else if (val === 'lorScore') {
          return (Number(b.lorScore.matchedCharacteristics[0])) - 
                Number((a.lorScore.matchedCharacteristics[0])); 
        }
        return 0;
      });
    });
  };


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
          <div className={styles.sce}>
            <table >
              <thead className={styles.mainHeader}>
                <tr>
                <th >Rank #</th>
                <th >Name</th>
                <th >Medical School</th>
                <th className={selectedProperty==="research"? `${styles.selectedProperty}`:`${styles.cursorPointer}`}
                onClick={()=>handleSort("research")}
                >Research Rating</th>
                <th className={selectedProperty==="sopScore"? `${styles.selectedProperty}`: `${styles.cursorPointer}`} 
                onClick={()=>handleSort("sopScore")}
                >Personal Statement Rating</th>
                <th className={selectedProperty==="lorScore"? `${styles.selectedProperty}`: `${styles.cursorPointer}`} 
                onClick={()=>handleSort("lorScore")}>LOR Rating</th>
                <th >Report</th>
                </tr>
              </thead>
              <tbody>
                     
            {result?.map((item, index) => (
            <tr  key={index}>
              <td className={styles.mainHeader1}>{index+1}</td>
              <td className={styles.mainHeader2}>{item.name}</td>
              <td className={styles.mainHeader3}>{item.medSchool}</td>
              <td className={styles.mainHeader4}>{item.researchScore.toFixed(1)}</td>
              <td className={styles.mainHeader5}>{item.sopScore.matchedCharacteristics}</td>
              <td className={styles.mainHeader6}>{item.lorScore.matchedCharacteristics}</td>
              <td className={styles.mainHeader7}> <a href="javascript:void(0);" onClick={()=>createPdf(item,index,result)}>Report</a></td>
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
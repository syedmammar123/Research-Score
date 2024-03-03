// import OpenAI from "openai";
// import { sleep } from "openai/core";
// import { useEffect, useState } from "react";
// import styles from './index.module.css';


// // const Result = ({dataa}) => {


// const Result = ( {userData,rating,stdData}) => {
//     const [loading, setLoading] = useState(true);
//     stdData = [
//     {
//         "fName": "Taylor",
//         "lName": "Morgan",
//         "researchProducts": [
//             {
//                 "title": "Innovations in Minimally Invasive Techniques for Brain Tumor Removal",
//                 "authors": [
//                     {
//                         "lastName": "Morgan",
//                         "initials": "T"
//                     },
//                     {
//                         "lastName": "Zhang",
//                         "initials": "E"
//                     },
//                     {
//                         "lastName": "Antonius",
//                         "initials": "M"
//                     }
//                 ],
//                 "researchType": "Peer-reviewed publication",
//                 "publicationStatus": "Published",
//                 "publicationName": "Journal of Neurosurgical Techniques"
//             },
//             {
//                 "title": "Neuroprotective Strategies in Acute Ischemic Stroke: A Comprehensive Review",
//                 "authors": [
//                     {
//                         "lastName": "Turing",
//                         "initials": "A"
//                     },
//                     {
//                         "lastName": "Morgan",
//                         "initials": "T"
//                     }
//                 ],
//                 "researchType": "Peer-reviewed publication",
//                 "publicationStatus": "Published",
//                 "publicationName": "Stroke Research and Therapy"
//             },
//             {
//                 "title": "The Role of AI in Predicting Outcomes After Spinal Cord Injury",
//                 "authors": [
//                     {
//                         "lastName": "Morgan",
//                         "initials": "T"
//                     },
//                     {
//                         "lastName": "Connor",
//                         "initials": "S"
//                     }
//                 ],
//                 "researchType": "Non-peer reviewed publication",
//                 "publicationStatus": "Accepted",
//                 "publicationName": "Innovations in Spinal Surgery and Rehabilitation"
//             },
//             {
//                 "title": "3D Printing of Customized Cranial Implants: Future Directions",
//                 "authors": [
//                     {
//                         "lastName": "Morgan",
//                         "initials": "T"
//                     },
//                     {
//                         "lastName": "Da Vinci",
//                         "initials": "L"
//                     },
//                     {
//                         "lastName": "Smith",
//                         "initials": "J"
//                     }
//                 ],
//                 "researchType": "Presentation",
//                 "publicationStatus": "Accepted",
//                 "publicationName": "International Symposium on Biomedical Engineering"
//             },
//             {
//                 "title": "Efficacy of Virtual Reality Training for Neurosurgical Residents",
//                 "authors": [
//                     {
//                         "lastName": "Tesla",
//                         "initials": "N"
//                     },
//                     {
//                         "lastName": "Morgan",
//                         "initials": "T"
//                     }
//                 ],
//                 "researchType": "Peer-reviewed publication",
//                 "publicationStatus": "Submitted",
//                 "publicationName": "Education in Neurosurgery"
//             },
//             {
//                 "title": "Mechanisms of Neural Regeneration After Traumatic Brain Injury",
//                 "authors": [
//                     {
//                         "lastName": "Morgan",
//                         "initials": "T"
//                     },
//                     {
//                         "lastName": "Curie",
//                         "initials": "M"
//                     },
//                     {
//                         "lastName": "Einstein",
//                         "initials": "A"
//                     }
//                 ],
//                 "researchType": "Abstract",
//                 "publicationStatus": "Submitted",
//                 "publicationName": "Neurotrauma Conference"
//             },
//             {
//                 "title": "Comparative Analysis of Endoscopic vs. Microscopic Transsphenoidal Pituitary Surgery",
//                 "authors": [
//                     {
//                         "lastName": "Morgan",
//                         "initials": "T"
//                     },
//                     {
//                         "lastName": "Newton",
//                         "initials": "I"
//                     }
//                 ],
//                 "researchType": "Peer-reviewed publication",
//                 "publicationStatus": "Accepted",
//                 "publicationName": "Journal of Pituitary Research"
//             },
//             {
//                 "title": "The Impact of Socioeconomic Status on Outcomes in Pediatric Epilepsy Surgery",
//                 "authors": [
//                     {
//                         "lastName": "Morgan",
//                         "initials": "T"
//                     },
//                     {
//                         "lastName": "Darwin",
//                         "initials": "C"
//                     },
//                     {
//                         "lastName": "Mendel",
//                         "initials": "G"
//                     }
//                 ],
//                 "researchType": "Peer-reviewed publication",
//                 "publicationStatus": "Published",
//                 "publicationName": "Pediatric Neurosurgery"
//             },
//             {
//                 "title": "Development of a New Intracranial Pressure Monitoring Device",
//                 "authors": [
//                     {
//                         "lastName": "Morgan",
//                         "initials": "T"
//                     },
//                     {
//                         "lastName": "Bell",
//                         "initials": "A"
//                     },
//                     {
//                         "lastName": "Edison",
//                         "initials": "T"
//                     }
//                 ],
//                 "researchType": "Presentation",
//                 "publicationStatus": "Published",
//                 "publicationName": "World Congress on Neurotechnology"
//             }
//         ]
//     },
//     {
//         "fName": "Jamie",
//         "lName": "Rivera",
//         "researchProducts": [
//             {
//                 "title": "Evaluating the Accuracy of MRI in Diagnosing Early Stage Osteoarthritis",
//                 "authors": [
//                     {
//                         "lastName": "Rivera",
//                         "initials": "J"
//                     },
//                     {
//                         "lastName": "Choi",
//                         "initials": "S"
//                     },
//                     {
//                         "lastName": "Patel",
//                         "initials": "A"
//                     }
//                 ],
//                 "researchType": "Peer-reviewed publication",
//                 "publicationStatus": "Published",
//                 "publicationName": "Journal of Musculoskeletal Imaging"
//             },
//             {
//                 "title": "Machine Learning Algorithms for Predicting Malignancy in Lung Nodule CT Scans",
//                 "authors": [
//                     {
//                         "lastName": "Ford",
//                         "initials": "H"
//                     },
//                     {
//                         "lastName": "Rivera",
//                         "initials": "J"
//                     }
//                 ],
//                 "researchType": "Peer-reviewed publication",
//                 "publicationStatus": "Accepted",
//                 "publicationName": "Radiology and Artificial Intelligence"
//             },
//             {
//                 "title": "The Role of Ultrasound in Managing Thyroid Disorders",
//                 "authors": [
//                     {
//                         "lastName": "Rivera",
//                         "initials": "J"
//                     },
//                     {
//                         "lastName": "Blackwell",
//                         "initials": "E"
//                     }
//                 ],
//                 "researchType": "Presentation",
//                 "publicationStatus": "Accepted",
//                 "publicationName": "International Thyroid Congress"
//             },
//             {
//                 "title": "Impact of Regular Exercise on Cardiovascular Health: A Systematic Review",
//                 "authors": [
//                     {
//                         "lastName": "Rivera",
//                         "initials": "J"
//                     },
//                     {
//                         "lastName": "Phelps",
//                         "initials": "M"
//                     },
//                     {
//                         "lastName": "Williams",
//                         "initials": "S"
//                     }
//                 ],
//                 "researchType": "Peer-reviewed publication",
//                 "publicationStatus": "Submitted",
//                 "publicationName": "Journal of Cardiovascular Medicine"
//             },
//             {
//                 "title": "Advancements in PET Imaging for Early Detection of Alzheimer’s Disease",
//                 "authors": [
//                     {
//                         "lastName": "Alzheimer",
//                         "initials": "A"
//                     },
//                     {
//                         "lastName": "Rivera",
//                         "initials": "J"
//                     }
//                 ],
//                 "researchType": "Non-peer reviewed publication",
//                 "publicationStatus": "Published",
//                 "publicationName": "Innovations in Neuroimaging"
//             },
//             {
//                 "title": "A Comparative Study of Digital vs. Film Mammography in Breast Cancer Screening",
//                 "authors": [
//                     {
//                         "lastName": "Rivera",
//                         "initials": "J"
//                     },
//                     {
//                         "lastName": "Curie",
//                         "initials": "M"
//                     },
//                     {
//                         "lastName": "Franklin",
//                         "initials": "R"
//                     }
//                 ],
//                 "researchType": "Abstract",
//                 "publicationStatus": "Submitted",
//                 "publicationName": "Annual Meeting of the Radiological Society"
//             }
//         ]
//     },
//     {
//         "fName": "Casey",
//         "lName": "Kim",
//         "researchProducts": [
//             {
//                 "title": "Vaccine Efficacy in Preventing Viral Infections in School-Aged Children: A Meta-Analysis",
//                 "authors": [
//                     {
//                         "lastName": "Kim",
//                         "initials": "C"
//                     },
//                     {
//                         "lastName": "Hernandez",
//                         "initials": "L"
//                     },
//                     {
//                         "lastName": "Ali",
//                         "initials": "M"
//                     }
//                 ],
//                 "researchType": "Peer-reviewed publication",
//                 "publicationStatus": "Published",
//                 "publicationName": "Journal of Pediatric Infectious Diseases"
//             },
//             {
//                 "title": "Impact of Screen Time on Sleep Patterns in Adolescents",
//                 "authors": [
//                     {
//                         "lastName": "Yu",
//                         "initials": "R"
//                     },
//                     {
//                         "lastName": "Kim",
//                         "initials": "C"
//                     }
//                 ],
//                 "researchType": "Peer-reviewed publication",
//                 "publicationStatus": "Accepted",
//                 "publicationName": "Pediatric Sleep Medicine"
//             },
//             {
//                 "title": "Nutritional Deficiencies and Developmental Delays in Early Childhood: A Systematic Review",
//                 "authors": [
//                     {
//                         "lastName": "Kim",
//                         "initials": "C"
//                     },
//                     {
//                         "lastName": "Patel",
//                         "initials": "A"
//                     }
//                 ],
//                 "researchType": "Presentation",
//                 "publicationStatus": "Accepted",
//                 "publicationName": "International Conference on Child Nutrition and Development"
//             },
//             {
//                 "title": "Exploring the Psychological Impact of Pediatric Chronic Illnesses on Families",
//                 "authors": [
//                     {
//                         "lastName": "Kim",
//                         "initials": "C"
//                     },
//                     {
//                         "lastName": "Lee",
//                         "initials": "S"
//                     },
//                     {
//                         "lastName": "Kim",
//                         "initials": "J"
//                     }
//                 ],
//                 "researchType": "Abstract",
//                 "publicationStatus": "Submitted",
//                 "publicationName": "World Congress on Pediatric Psychology"
//             }
//         ]
//     },
//     {
//         "fName": "Alex",
//         "lName": "Parker",
//         "researchProducts": [
//             {
//                 "title": "The Efficacy of New Anticoagulants in the Management of Atrial Fibrillation",
//                 "authors": [
//                     {
//                         "lastName": "Parker",
//                         "initials": "A"
//                     },
//                     {
//                         "lastName": "Singh",
//                         "initials": "H"
//                     },
//                     {
//                         "lastName": "Rodriguez",
//                         "initials": "E"
//                     }
//                 ],
//                 "researchType": "Peer-reviewed publication",
//                 "publicationStatus": "Published",
//                 "publicationName": "Journal of Cardiovascular Pharmacology"
//             },
//             {
//                 "title": "Assessing the Impact of Lifestyle Modifications on Hypertension Control: A Cohort Study",
//                 "authors": [
//                     {
//                         "lastName": "Johnson",
//                         "initials": "M"
//                     },
//                     {
//                         "lastName": "Parker",
//                         "initials": "A"
//                     }
//                 ],
//                 "researchType": "Peer-reviewed publication",
//                 "publicationStatus": "Accepted",
//                 "publicationName": "Internal Medicine Insights"
//             }
//         ]
//     }
// ];




//   const openai = new OpenAI({
//   apiKey: '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',
//   dangerouslyAllowBrowser: true
// });


//   const [result,setResult] = useState([])
//   const [result1,setResult1] = useState([{name:"Ammar",score:20},
// {name:"Ammar",score:20},{name:"Ammar",score:20}
// ])
// //   const [result1,setResult1] = useState([{name:"Ammar",score:20},
// // {name:"Ammar",score:20},{name:"Ammar",score:20},{name:"Ammar",score:20},{name:"Ammar",score:20},{name:"Ammar",score:20},{name:"Ammar",score:20},{name:"Ammar",score:20},{name:"Ammar",score:20},{name:"Ammar",score:20},{name:"Ammar",score:20},{name:"Ammar",score:20},{name:"Ammar",score:20},{name:"Ammar",score:20},
// // ])
//   const [resData,setResData] = useState([])
//   // var userSpecialty = "Anesthesiology"
//   var userSpecialty = userData.specialty
//   //  rating = {
//   //   "totalNumberOfResearchProducts": 7, 
//   //   "researchRelatesToSpecialty": 4,
//   //   "firstAuthorOnProject": 9,
//   //   "peerReviewedJournalArticles": 5,
//   //   "abstractResearch": 0,
//   //   "publishedResearch": 10,
//   //   "impactFactorOfJournals": 6
//   // }
//   // const dataa = [
//   //   {
//   //       "fName": "Syeda",
//   //       "lName": "Ammar",
//   //       "researchProducts": [
//   //           {
//   //               "title": "Emergency Medicine Protocols for Pediatric Trauma Cases",
//   //               "authors": [
//   //                   {
//   //                         "lastName": "Ammar",
//   //                         "initials": "S"
//   //                   },
//   //                   {
//   //                         "lastName": "Bilal",
//   //                         "initials": "S"
//   //                   },
//   //                   {
//   //                         "lastName": "Sidra",
//   //                         "initials": "S"
//   //                   }
//   //               ],
//   //               "researchType": "Peer-Reviewed Journal Article",
//   //               "publicationStatus": "Published",
//   //               "publicationName": "Science and Arest concil"
//   //           }
//   //       ]
//   //   },
//   //   {
//   //       "fName": "Syed",
//   //       "lName": "Ammar",
//   //       "researchProducts": [
//   //           {
//   //               "title": "Exploring the Efficacy of Multimodal Analgesia in Perioperative Pain Management: A Systematic Review and Meta-Analysis",
//   //               "authors": [
//   //                   {
//   //                         "lastName": "Ammar",
//   //                         "initials": "S"
//   //                   },
//   //                   {
//   //                         "lastName": "Bilal",
//   //                         "initials": "S"
//   //                   },
//   //                   {
//   //                         "lastName": "Sidra",
//   //                         "initials": "S"
//   //                   }
//   //               ],
//   //               "researchType": "Presentation",
//   //               "publicationStatus": "Accepted",
//   //               "publicationName": "Science and Arest concil"
//   //           },
//   //           {
//   //               "title": "Exploring the Role of Anesthesiology in Pain Management",
//   //               "authors": [
//   //                   {
//   //                         "lastName": "Ammar",
//   //                         "initials": "S"
//   //                   },
//   //                   {
//   //                         "lastName": "Bilal",
//   //                         "initials": "S"
//   //                   },
//   //                   {
//   //                         "lastName": "Sidra",
//   //                         "initials": "S"
//   //                   }
//   //               ],
//   //               "researchType": "Presentation",
//   //               "publicationStatus": "Published",
//   //               "publicationName": "Science and Arest concil"
//   //           },
//   //           {
//   //               "title": "Recent Advances in Anesthesiology Research: Implications for Clinical Practice",
//   //               "authors": [
//   //                   {
//   //                         "lastName": "Ammar",
//   //                         "initials": "S"
//   //                   },
//   //                   {
//   //                         "lastName": "Bilal",
//   //                         "initials": "S"
//   //                   },
//   //                   {
//   //                         "lastName": "Sidra",
//   //                         "initials": "S"
//   //                   }
//   //               ],
//   //               "researchType": "Abstract",
//   //               "publicationStatus": "Submitted",
//   //               "publicationName": "Science and Arest concil"
//   //           }
//   //       ]
//   //   }
//   // ]

//   const countFirstName = (lname,products)=>{
//     let count = 0
//     for(let i = 0; i<products.length ;i++){
//       let authorList = products[i].authors

//       if(lname===authorList[0].lastName){
//         count++;
//       }
//     }
//     return count;
//   }

//   const terminalStates = ["cancelled", "failed", "completed", "expired"];
//   const statusCheckLoop = async (threadID, runId) => {
//       const run = await openai.beta.threads.runs.retrieve(
//         threadID,
//         runId
//     );

//     if(terminalStates.indexOf(run.status) < 0){
//         await sleep(1000);
//         return statusCheckLoop(threadID, runId);
//     }
//     return run.status;
// }


//   const  countSpecialty = async(specialty,products) =>{
//     let title = []
//     for(let i = 0; i<products.length; i++){
//       title.push(products[i].title)
//     }
    
//     const message = await openai.beta.threads.messages.create(
//     'thread_tywwg1xQm8qI6bRzNbBuSsgk',
//     {
//       role: "user",
//       content: `Specialty:${specialty} \n${title}`
//     })

//     const run = await openai.beta.threads.runs.create(
//    'thread_tywwg1xQm8qI6bRzNbBuSsgk',
//     { 
//       assistant_id:'asst_R4DPYBCfuCRfCy5mlnh6lltK'
//     }
//     );

//     const status = await statusCheckLoop('thread_tywwg1xQm8qI6bRzNbBuSsgk', run.id);

//     const messages = await openai.beta.threads.messages.list(
//          'thread_tywwg1xQm8qI6bRzNbBuSsgk',
//     );
//     let response = messages.data[0].content[0].text.value;
//     var num = parseInt(response);

//     return num;
//   }

//   const countPeerReviewedArticles = (products)=>{
//     let count = 0;
//       for(let i = 0; i<products.length ;i++){
//         if(products[i].researchType==="Peer-reviewed publication"){
//           count++;
//         }
//     }
//     return count;
//   }
  
//   const countAbstractResearch = (products)=>{
//     let count = 0;
//       for(let i = 0; i<products.length ;i++){
//         if(products[i].researchType==="Abstract" || products[i].researchType==="Presentation" ){
//           count++;
//         }
//     }
//     return count;
//   }

//   const countPublished = (products)=>{
//     let count = 0;
//       for(let i = 0; i<products.length ;i++){
//         if(products[i].publicationStatus==="Published"){
//           count++;
//         }
//     }
//     return count;
//   }  

//   // const  countImpact = async (products) =>{
//   //    let journalName = []
//   //   for(let i = 0; i<products.length; i++){
//   //     if((products[i].researchType=='Peer-Reviewed Journal Article') && (products[i].publicationStatus=="Submitted" || products[i].publicationStatus=="Published" ))
//   //     journalName.push(products[i].publicationName)
//   //   }
    
//   //   const message = await openai.beta.threads.messages.create(
//   //   'thread_tywwg1xQm8qI6bRzNbBuSsgk',
//   //   {
//   //     role: "user",
//   //     content: `Specialty:${specialty} \n${title}`
//   //   })

//   //   const run = await openai.beta.threads.runs.create(
//   //  'thread_tywwg1xQm8qI6bRzNbBuSsgk',
//   //   { 
//   //     assistant_id:'asst_R4DPYBCfuCRfCy5mlnh6lltK'
//   //   }
//   //   );

//   //   const status = await statusCheckLoop('thread_tywwg1xQm8qI6bRzNbBuSsgk', run.id);

//   //   const messages = await openai.beta.threads.messages.list(
//   //        'thread_tywwg1xQm8qI6bRzNbBuSsgk',
//   //   );
//   //   let response = messages.data[0].content[0].text.value;
//   //   var num = parseInt(response);

//   //   return num;
//   // }

//   const calculations = async ()=>{
//     const totalRating = Object.values(rating).reduce((acc,curr)=>acc+curr,0)

//     for(let i=0;i<stdData.length;i++){

//       let currentStd = stdData[i];
//       let score = 0;

//       //a
//       score = currentStd.researchProducts.length * (rating.totalNumberOfResearchProducts/totalRating);

//       //b
//       let specialtyCount = await countSpecialty(userSpecialty,currentStd.researchProducts)
//       score += specialtyCount * (rating.researchRelatesToSpecialty/totalRating)
//       //c
//       let fNameCount = countFirstName(currentStd.lName,currentStd.researchProducts)
//       score += fNameCount * (rating.firstAuthorOnProject/totalRating)

//       //d 
//       let peerReviewedCount = countPeerReviewedArticles(currentStd.researchProducts)
//       score += peerReviewedCount * (rating.peerReviewedJournalArticles/totalRating)
      
//       //e 
//       let abstractResearchCount = countAbstractResearch(currentStd.researchProducts)
//       score += abstractResearchCount * (rating.abstractResearch/totalRating)
      
//       //f
//       let publishedCount = countPublished(currentStd.researchProducts)
//       score += publishedCount * (rating.publishedResearch/totalRating)

//       //g
//       // let impactFactorCount = countImpact(currentStd.researchProducts)
//       // score += impactFactorCount * (rating.impactFactorOfJournals/totalRating)
      
//       let final = {
//         name:currentStd.fName+" "+currentStd.lName,
//         score
//       } 
      
//       resData.push(final)
//     }

//     resData.sort((a,b)=>b.score-a.score)
//     setResult(resData)

//     setLoading(false)

//   }

//   useEffect(()=>{
//     calculations()
//   },[])

//    if (loading) {
//         return  (
//       <div className={styles['loading-overlay']}>
//         <div className={styles['loading-spinner']}></div>
//         <div className={styles['loading-text']}>Processing Results...</div>
//       </div>
//     );
//     }



//   return (
//     <div>
//         {/* <button onClick={calculations}>Run Cal!</button> */}
//         {/* <h2 >Result</h2> */}
//         <div >
//         {result.length > 0 && (
//           <div className={styles.container} >
//             <div className={styles.mainHeader}>
//               <div className={styles.mainHeader1}>Rank #</div>
//               <div className={styles.mainHeader2}>Name</div>
//               <div className={styles.mainHeader3}>Score</div>
//             </div>
          
//           <div className={styles.sce}>
      
//             <table >
//               <tbody>
                     
//             {result?.map((item, index) => (
//             <tr  key={index}>
//               <td className={styles.mainHeader1}>{index+1}</td>
//               <td className={styles.mainHeader2}>{item.name}</td>
//               <td className={styles.mainHeader3}>{item.score}</td>
//             </tr>
                
                
//             ))}
//             </tbody>


//             </table>
            
                    
          
//           </div>
//           </div>

//         ) }
//         </div>
//     </div>
   

   
//     )

// }

// export default Result


// // let b = [
// //     {
// //         "id": "asst_XFSFXoI5rhtbd8aPI46xUzNZ",
// //         "object": "assistant",
// //         "created_at": 1707392544,
// //         "name": "Research Product Type",
// //         "description": null,
// //         "model": "gpt-4-turbo-preview",
// //         "instructions": "Given a list of research products and their associated product types, identify the number of which are \"Peer-reviewed journal articles,\" \"Abstracts,\" and \"Presentations.\" Your response should be formatted as:\nPeer-reviewed journal articles = number \nAbstracts = number\nPresentations = number",
// //         "tools": [],
// //         "file_ids": [],
// //         "metadata": {}
// //     },
// //     {
// //         "id": "asst_vW6VQ1tjBimivTZ2pan1J7v9",
// //         "object": "assistant",
// //         "created_at": 1707392291,
// //         "name": "Research Product First Author",
// //         "description": null,
// //         "model": "gpt-4-turbo-preview",
// //         "instructions": "You are a helpful assistant that can help identify if an author is first author of a journal article. Given their first and last name and a list of articles they are an author on with their authors list, count the number of times the author is first author.",
// //         "tools": [],
// //         "file_ids": [],
// //         "metadata": {}
// //     },
// //     {
// //         "id": "asst_vZWUphgahgSWObqTyYKcX405",
// //         "object": "assistant",
// //         "created_at": 1707159157,
// //         "name": "Research Product Specialty",
// //         "description": null,
// //         "model": "gpt-4-turbo-preview",
// //         "instructions": "In the file are keywords for the following medical specialties:\nAnesthesiology\tDermatology\tEmergency Medicine\tFamily Medicine\tInternal Medicine\tMedical Genetics\tNeurology\tNeurosurgery\tNuclear Medicine\tObstetrics and Gynecology\tOphalmology\tOrthapedic Surgery\tOtolaryngology\tPediatrics\tPhysical Medicine and Rehabilitation\tPlastic Surgery\tPreventative Medicine\tPsychiatry\tRadiology\tSurgery\tThoracic Surgery\tUrology\tVascular Surgery\n\nBased on the keywords and your latest AI knowledge, identify which specialty (or specialties) the titles of medical journal articles match.\nParameters: Limit your specialty options to only the specialties defined by the headers provided with the keywords. You can provide up to three specialties for articles that match multiple specialties. Limit your specialty responses to the following specialties, only:\nAnesthesiology\tDermatology\tEmergency Medicine\tFamily Medicine\tInternal Medicine\tMedical Genetics\tNeurology\tNeurosurgery\tNuclear Medicine\tObstetrics and Gynecology\tOphalmology\tOrthapedic Surgery\tOtolaryngology\tPediatrics\tPhysical Medicine and Rehabilitation\tPlastic Surgery\tPreventative Medicine\tPsychiatry\tRadiology\tSurgery\tThoracic Surgery\tUrology\tVascular Surgery\n\nFormat your response as follows:\n1. Title-- Specialty\n2. Title-- Specialty\n3. Title-- Specialty\netc.",
// //         "tools": [
// //             {
// //                 "type": "retrieval"
// //             }
// //         ],
// //         "file_ids": [
// //             "file-VhuBAZskxUrSUBnV5LnYfmp0"
// //         ],
// //         "metadata": {}
// //     }
// // ]



// // let a ={
// //     "id": "run_dzKUuNlbj2DnBhkrzFUNcT5s",
// //     "object": "thread.run",
// //     "created_at": 1707823900,
// //     "assistant_id": "asst_vZWUphgahgSWObqTyYKcX405",
// //     "thread_id": "thread_S1A1wq3ZIuqpOjdZUXAOkc6K",
// //     "status": "queued",
// //     "started_at": null,
// //     "expires_at": 1707824500,
// //     "cancelled_at": null,
// //     "failed_at": null,
// //     "completed_at": null,
// //     "last_error": null,
// //     "model": "gpt-4-turbo-preview",
// //     "instructions": "In the file are keywords for the following medical specialties:\nAnesthesiology\tDermatology\tEmergency Medicine\tFamily Medicine\tInternal Medicine\tMedical Genetics\tNeurology\tNeurosurgery\tNuclear Medicine\tObstetrics and Gynecology\tOphalmology\tOrthapedic Surgery\tOtolaryngology\tPediatrics\tPhysical Medicine and Rehabilitation\tPlastic Surgery\tPreventative Medicine\tPsychiatry\tRadiology\tSurgery\tThoracic Surgery\tUrology\tVascular Surgery\n\nBased on the keywords and your latest AI knowledge, identify which specialty (or specialties) the titles of medical journal articles match.\nParameters: Limit your specialty options to only the specialties defined by the headers provided with the keywords. You can provide up to three specialties for articles that match multiple specialties. Limit your specialty responses to the following specialties, only:\nAnesthesiology\tDermatology\tEmergency Medicine\tFamily Medicine\tInternal Medicine\tMedical Genetics\tNeurology\tNeurosurgery\tNuclear Medicine\tObstetrics and Gynecology\tOphalmology\tOrthapedic Surgery\tOtolaryngology\tPediatrics\tPhysical Medicine and Rehabilitation\tPlastic Surgery\tPreventative Medicine\tPsychiatry\tRadiology\tSurgery\tThoracic Surgery\tUrology\tVascular Surgery\n\nFormat your response as follows:\n1. Title-- Specialty\n2. Title-- Specialty\n3. Title-- Specialty\netc.",
// //     "tools": [
// //         {
// //             "type": "retrieval"
// //         }
// //     ],
// //     "file_ids": [
// //         "file-VhuBAZskxUrSUBnV5LnYfmp0"
// //     ],
// //     "metadata": {},
// //     "usage": null
// // }


import OpenAI from "openai";
import { sleep } from "openai/core";
import { useEffect, useState } from "react";
import styles from './index.module.css';




const Result = ( {userData,rating,stdData}) => {
  const [loading, setLoading] = useState(true);

  const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_KEY,
  dangerouslyAllowBrowser: true
  });

  const [result,setResult] = useState([])

  const [resData,setResData] = useState([])
  // var userSpecialty = "Anesthesiology"
  var userSpecialty = userData.specialty

  const countFirstName = (fName,products)=>{
    let count = 0
    
    for(let i = 0; i<products.length ;i++){
      let authorList = products[i].authors

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
    console.log(response);

    return num;
  }

  const countPeerReviewedArticles = (products)=>{
    let count = 0;
      for(let i = 0; i<products.length ;i++){
        if(products[i].researchType==="Peer-reviewed publication"){
          count++;
        }
    }
    return count;
  }
  
  const countAbstractResearch = (products)=>{
    let count = 0;
    
    for(let i = 0; i<products.length ;i++){
      if(products[i].researchType==="Abstract" || products[i].researchType==="Presentation" ){
          count++;
      }
    }
    return count;
  }

  const countPublished = (products)=>{
    let count = 0;
      for(let i = 0; i<products.length ;i++){
        if(products[i].publicationStatus==="Published"){
          count++;
        }
    }
    return count;
  }  

  // const  countImpact = async (products) =>{
  //    let journalName = []
  //   for(let i = 0; i<products.length; i++){
  //     if((products[i].researchType=='Peer-Reviewed Journal Article') && (products[i].publicationStatus=="Submitted" || products[i].publicationStatus=="Published" ))
  //     journalName.push(products[i].publicationName)
  //   }
    
  //   const message = await openai.beta.threads.messages.create(
  //   'thread_tywwg1xQm8qI6bRzNbBuSsgk',
  //   {
  //     role: "user",
  //     content: `Specialty:${specialty} \n${title}`
  //   })

  //   const run = await openai.beta.threads.runs.create(
  //  'thread_tywwg1xQm8qI6bRzNbBuSsgk',
  //   { 
  //     assistant_id:'asst_R4DPYBCfuCRfCy5mlnh6lltK'
  //   }
  //   );

  //   const status = await statusCheckLoop('thread_tywwg1xQm8qI6bRzNbBuSsgk', run.id);

  //   const messages = await openai.beta.threads.messages.list(
  //        'thread_tywwg1xQm8qI6bRzNbBuSsgk',
  //   );
  //   let response = messages.data[0].content[0].text.value;
  //   var num = parseInt(response);

  //   return num;
  // }

  const calculations = async ()=>{
    const totalRating = Object.values(rating).reduce((acc,curr)=>acc+curr,0)

    for(let i=0;i<stdData.length;i++){

      let currentStd = stdData[i];
      let score = 0;

      //a
      score = currentStd.researchProducts.length * (rating.totalNumberOfResearchProducts);

      //b
    //   let specialtyCount = await countSpecialty(userSpecialty,currentStd.researchProducts)
    //   score += specialtyCount * (rating.researchRelatesToSpecialty)

      //c
      let fNameCount = countFirstName(currentStd.fName,currentStd.researchProducts)
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
      // let impactFactorCount = countImpact(currentStd.researchProducts)
      // score += impactFactorCount * (rating.impactFactorOfJournals/totalRating)
      
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
        <div className={styles['loading-text']}>Processing Results...</div>
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

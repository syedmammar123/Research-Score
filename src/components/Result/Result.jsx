import OpenAI from "openai";
import { sleep } from "openai/core";
import { useEffect, useState } from "react";
import styles from './index.module.css';
import { impactData } from "./ImpactFactor";
import jsPDF from 'jspdf';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);




const Result = ( {userData,rating,stdData}) => {
  const [loading, setLoading] = useState(true);
  const [result,setResult] = useState([])
  const [resData,setResData] = useState([])
  const [stdName,setStdName] = useState('')
  const [selectedProperty,setSelectedProperty] = useState('research')

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
    
    var num = JSON.parse(response);
    console.log(`For 2: ${specialty} is : ${num.count}`);
    return num.count;
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

  const  sopInfo = async (programValues,sop) =>{
    
    
    // const myUpdatedAssistant = await openai.beta.assistants.update(
    //   import.meta.env.VITE_ASST_ID_3,
    //   {
    //     instructions:
    //       `I am providing a personal statement of a student. Please read through the personal statement and generate me a list of the all characteristics that are mentioned and identified in the personal statement. After that, find out how many of those found characteristcs match the program values.
    //       The program valued characteristcs are ${programValues}. 
    //       Provide in Json Format like given below:
    //       {
    //         "characteristicsInSOP": [],
    //         "matchedCharateriscs": "no of charachterisics matched/(no of program values)",
    //       }`,
    //       model: "gpt-4o-mini",
    //       response_format:{
    //         "type": "json_object" 
    //       }
    //         // Lastly, please also generate a two line summary of personal statement. 
    //         // "SOPSummary": "Just two lines of summary",

          
    //   }
    // );

    
    const message = await openai.beta.threads.messages.create(
      import.meta.env.VITE_THREAD_ID_3,
      {
        role: "user",
        content: `Valued characteristics: ${programValues}\n
                  Statement of Purpose: \n${sop} `
    })

    const run = await openai.beta.threads.runs.create(
      import.meta.env.VITE_THREAD_ID_3,
    { 
      assistant_id:import.meta.env.VITE_ASST_ID_3
    }
    );

    const status = await statusCheckLoop(import.meta.env.VITE_THREAD_ID_3, run.id);

    const messages = await openai.beta.threads.messages.list(
      import.meta.env.VITE_THREAD_ID_3,
    );
    let response = messages.data[0].content[0].text.value;
    
    return JSON.parse(response);
  }

  const  lorInfo = async (programValues,lor) =>{
    
    
  // const myUpdatedAssistant = await openai.beta.assistants.update(
  //    import.meta.env.VITE_ASST_ID_4,
  //   {
  //     instructions:
  //       `I am providing few LORs of a student. Please read through the LORs and generate me a list of the all characteristics that are mentioned and identified in the LORs. After that, calculate the percentage of those which match the program values.
  //       The program values are ${programValues} 
  //       Provide in Json Format like given below:
  //       {
  //         "characteristicsInLOR": [],
  //         "percentageMatchInLOR": "x%"
  //       }`,
  //       model: "gpt-4o-mini",
  //       response_format:{
  //         "type": "json_object" 
  //       }
        
  //   }
  // );

    let refinedLors = lor
    .map((text, i) => `Letter Of Recommendation No. ${i + 1}\n${text.replace(/\n/g, '')}`)
    .join('\n\n');

    
    const message = await openai.beta.threads.messages.create(
      import.meta.env.VITE_THREAD_ID_4,
    {
      role: "user",
      content: `Valued characteristics: ${programValues}\n
                  Letter of Recommendations: \n${refinedLors} `
    })

    const run = await openai.beta.threads.runs.create(
      import.meta.env.VITE_THREAD_ID_4,
    { 
      assistant_id:import.meta.env.VITE_ASST_ID_4
    }
    );

    const status = await statusCheckLoop(import.meta.env.VITE_THREAD_ID_4, run.id);

    const messages = await openai.beta.threads.messages.list(
      import.meta.env.VITE_THREAD_ID_4,
    );
    let response = messages.data[0].content[0].text.value;
    console.log(response);

    return JSON.parse(response);
  }

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



const openPDFInNewTab = (item, index, result) => {
  const doc = new jsPDF();
  
  // Create a canvas element
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  
  const ctx = canvas.getContext('2d');

// function createChart(selectedStudentName, id) {
//   // Get scores from result array and calculate mean and standard deviation
//   const scores = result.map(student => student.researchScore);
//   const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
//   const stdDev = Math.sqrt(scores.map(score => Math.pow(score - mean, 2)).reduce((a, b) => a + b) / scores.length);

//   // Function to generate normal distribution points
//   function normalDistribution(x, mean, stdDev) {
//     return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2)));
//   }

//   // Generate the normal distribution curve data
//   const sortedScores = [...new Set(scores)].sort((a, b) => a - b); // Unique sorted scores
//   const bellCurveData = sortedScores.map(score => normalDistribution(score, mean, stdDev));

//   // Find the selected student's score
//   const selectedStudent = result.find(student => student.id === id);
//   const selectedScore = selectedStudent ? selectedStudent.researchScore : null;

//   // Create the chart
//   new Chart(ctx, {
//     type: 'line',
//     data: {
//       labels: sortedScores, // Use sorted scores for labels (x-axis)
//       datasets: [
//         {
//           label: 'Research Scores',
//           data: bellCurveData, // Use bell curve data for y-axis
//           backgroundColor: 'rgba(75, 192, 192, 0.2)',
//           borderColor: 'rgba(75, 192, 192, 1)',
//           borderWidth: 1,
//           fill: true,
//           tension: 0.4, // Smooth curve for the bell curve
//           pointRadius: 0, // Remove all dots from the main curve
//         },
//         {
//           label: false,
//           data: sortedScores.map(score => score === selectedScore ? normalDistribution(score, mean, stdDev) : null),
//           backgroundColor: 'rgba(255, 99, 132, 0.6)',
//           borderColor: 'rgba(255, 99, 132, 1)',
//           borderWidth: 1,
//           pointStyle: 'circle',
//           pointRadius: sortedScores.includes(selectedScore) ? 4 : 0, // Dot only for the selected student's score
//           pointHoverRadius: 4,
//           pointBackgroundColor: 'rgba(255, 99, 132, 1)',
//           pointBorderColor: '#fff',
//           showLine: false, // Disable the line for this dataset
//         }
//       ]
//     },
//     options: {
//       responsive: false,
//       plugins: {
//         legend: { display: false },
//         tooltip: {
//           callbacks: {
//             label: (tooltipItem) => `Score: ${tooltipItem.raw}`,
//           },
//         },
//       },
//       scales: {
//         x: {
//           title: {
//             display: true,
//             text: 'Research Score',
//           },
//           ticks: {
//             display: true, // Show score labels on the x-axis
//           },
//         },
//         y: {
//           title: {
//             display: false,
//             text: 'Probability Density',
//           },
//           ticks: {
//             display: false, // Show labels on the y-axis
//           },
//         },
//       },
//     },
//   });
// }




function createChart(selectedStudentName, id) {
  // Get scores from result array and calculate mean and standard deviation
  const scores = result.map(student => student.researchScore);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const stdDev = Math.sqrt(scores.map(score => Math.pow(score - mean, 2)).reduce((a, b) => a + b) / scores.length);

  // Function to generate normal distribution points
  function normalDistribution(x, mean, stdDev) {
    return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2)));
  }

  // Generate a range of values to cover the bell curve more effectively
  const minScore = Math.min(...scores) - 10; // Extend range below minimum score
  const maxScore = Math.max(...scores) + 10; // Extend range above maximum score
  const step = 1; // Step size for generating values
  const range = Array.from({ length: (maxScore - minScore) / step + 1 }, (_, i) => minScore + i * step);
  
  const bellCurveData = range.map(score => normalDistribution(score, mean, stdDev));

  // Find the selected student's score
  const selectedStudent = result.find(student => student.id === id);
  const selectedScore = selectedStudent ? selectedStudent.researchScore : null;

  // Create the chart
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: range, // Use the extended range for labels (x-axis)
      datasets: [
        {
          label: 'Research Scores',
          data: bellCurveData, // Use bell curve data for y-axis
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          fill: true,
          tension: 0.4, // Smooth curve for the bell curve
          pointRadius: 0, // Remove all dots from the main curve
        },
        {
          label: `Selected Student (${selectedStudentName})`,
          data: range.map(score => score === selectedScore ? normalDistribution(score, mean, stdDev) : null),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          pointStyle: 'circle',
           pointRadius: function(context) {
            const { dataIndex } = context;
            return range[dataIndex] === selectedScore ? 4 : 0; // Dot only for the selected student's score
          },
          pointHoverRadius: 4,
          pointBackgroundColor: 'rgba(255, 99, 132, 1)',
          pointBorderColor: '#fff',
          showLine: false, // Disable the line for this dataset
        }
      ]
    },
    options: {
      responsive: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => `Score: ${tooltipItem.raw}`,
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Research Score',
          },
          ticks: {
            display: true, // Show score labels on the x-axis
            beginAtZero: false, // Don't start at zero if it’s not relevant
          },
          min: 0, // Ensure the X-axis starts from 0
        },
        y: {
          title: {
            display: false,
            text: 'Probability Density',
          },
          ticks: {
            display: false, // Show score labels on the x-axis
           
          },
          beginAtZero: true, // Ensure the Y-axis starts from zero
        },
      },
    },
  });
}


createChart(item.name,item.id); // Highlight John Doe's score


  // function createChart(selectedStudentName) {
  //   // Create the chart
  //   new Chart(ctx, {
  //   type: 'line',
  //   data: {
  //     labels: result.map(student => student.name),
  //     datasets: [
  //       {
  //         label: 'Research Scores',
  //         data: result.map(student => student.researchScore),
  //         backgroundColor: 'rgba(75, 192, 192, 0.2)',
  //         borderColor: 'rgba(75, 192, 192, 1)',
  //         borderWidth: 2,
  //         fill: true,
  //         tension: 0.4, // Smooth curve
  //       },
  //       {
  //         label: selectedStudentName,
  //         data: result.map(student => student.name === selectedStudentName ? student.researchScore : null),
  //         backgroundColor: 'rgba(255, 99, 132, 0.6)',
  //         borderColor: 'rgba(255, 99, 132, 1)',
  //         borderWidth: 2,
  //         pointStyle: 'circle',
  //         pointRadius: 8,
  //         pointHoverRadius: 12,
  //         pointBackgroundColor: 'rgba(255, 99, 132, 1)',
  //         pointBorderColor: '#fff',
  //         tension: 0, // No curve for the highlighted point
  //       }
  //     ]
  //   },
  //   options: {
  //     responsive: false,
  //     plugins: {
  //       legend: { position: 'top' },
  //       tooltip: {
  //         callbacks: {
  //           label: (tooltipItem) => `Value: ${tooltipItem.raw}`,
  //         },
  //       },
  //     },
  //     scales: {
  //       x: {
  //         title: {
  //           display: true,
  //           text: 'Students',
  //         },
  //         ticks: {
  //           display: false, // Hide the student names on the x-axis
  //         },
  //       },
  //       y: {
  //         title: {
  //           display: true,
  //           text: 'Research Score',
  //         },
  //       },
  //     },
  //   },
  // });

  // }



  // createChart("jhon doe"); // This will highlight John Doe's score


  // Function to generate and open PDF
  const generateAndOpenPDF = () => {


    // Title of the Report
    doc.setFontSize(22);
    doc.setFont("Times", "bold");
    // doc.setFont("Helvetica", "bold");
    doc.text("Basic Information", 10, 15);

    // Name
    doc.setFontSize(12);
    doc.setFont("Times", "bold");
    doc.text(`Name: ${item.name}`, 10, 30);

    // Picture
    const imgUrl = item.pic;
    const img = new Image();
    img.src = imgUrl;
    img.onload = function () {
        doc.addImage(img, 'JPEG', 140, 5, 50, 40);

        // Date of Birth
        doc.text(`Date of Birth: ${item.dob}`, 10, 40);

        // Medical School
        doc.text(`Medical School: ${item.medSchool}`, 10, 50);
        
        doc.setFont("Times", "bold");
        doc.setFontSize(22)
        doc.text(`Research Productivity Summary`, 10, 70);
        doc.setFont("Times", "normal");
        // Research Score

        doc.setFontSize(12)
        doc.text(`Productivity Score: ${item.researchScore} (Mean = ${(result.reduce((acc,curr)=>acc+curr.researchScore,0)/result.length).toFixed(2)})`, 10, 80);
        doc.text(`Rank Position: ${index+1}/${result.length}`, 10, 90);

        // Wait for chart rendering
        setTimeout(() => {
            const imgData = canvas.toDataURL('image/png'); 
            doc.addImage(imgData, 'PNG', 130, 60, 50, 50);

            // SOP Score
            doc.setFontSize(22)
            doc.setFont("Times", "bold");
            doc.text("Characteristics Identified in Personal Statement", 10, 115);
            doc.setFontSize(12)
            doc.setFont("Times", "normal");
            let sopYy = 125;
            item.sopScore.characteristicsInSOP.forEach((char, index) => {
                doc.text(`${index + 1}. ${char}`, 20, sopYy);
                sopYy += 5;
            });

            doc.setFont("Times","bold")
            doc.text(`Number matching your program’s valued characteristics: ${item.sopScore.matchedCharacteristics} (Mean = ${(result.reduce((acc,curr)=>acc+Number(curr.sopScore.matchedCharacteristics[0]),0)/result.length).toFixed(1)})`, 20, sopYy +5);
            
            doc.setFontSize(22)
            doc.setFont("Times", "bold");
            doc.text("Characteristics Identified in Letters of Recommendation", 10, sopYy + 20);
            doc.setFontSize(12)
            doc.setFont("Times", "normal");
            
            sopYy = sopYy + 30;
            item.lorScore.characteristicsInLOR.forEach((char, index) => {
                doc.text(`${index + 1}. ${char}`, 20, sopYy);
                sopYy += 5;
            });

            doc.setFont("Times","bold")
            doc.text(`Number matching your program’s valued characteristics: ${item.lorScore.matchedCharacteristics} (Mean = ${(result.reduce((acc,curr)=>acc+Number(curr.lorScore.matchedCharacteristics[0]),0)/result.length).toFixed(1)})`, 20, sopYy + 5);
            
            doc.addPage();
            doc.setFontSize(22);
            doc.setFont("Times", "bold");
            doc.text("Research Productivity", 10, 20);

            // Name
            doc.setFontSize(12);
            // doc.setFont("Times", "normal");
            doc.text(`Overall Score: ${item.researchScore} (Mean = ${(result.reduce((acc,curr)=>acc+curr.researchScore,0)/result.length).toFixed(1)})`, 15, 40);

            doc.setFont("Times", "normal");
            doc.text(`Total Number of Research Products: ${item.researchProductsCount} (Mean = ${(result.reduce((acc,curr)=>acc+curr.researchProductsCount,0)/result.length).toFixed(1)})`, 15, 60);
            doc.text(`Number of Research Products Related to Specialty: ${item.specialtyCount} (Mean = ${(result.reduce((acc,curr)=>acc+curr.specialtyCount,0)/result.length).toFixed(1)})`, 15, 70);
            doc.text(`Number of First Author Research Products: ${item.fNameCount} (Mean = ${(result.reduce((acc,curr)=>acc+curr.fNameCount,0)/result.length).toFixed(1)})`, 15, 80);
            doc.text(`Number of Peer-Reviewed Journal Articles: ${item.peerReviewedCount} (Mean = ${(result.reduce((acc,curr)=>acc+curr.peerReviewedCount,0)/result.length).toFixed(1)})`, 15, 90);
            doc.text(`Number of Abstracts or Presentations: ${item.abstractResearchCount} (Mean = ${(result.reduce((acc,curr)=>acc+curr.abstractResearchCount,0)/result.length).toFixed(1)})`, 15, 100);
            doc.text(`Number of Published Research Products: ${item.publishedCount} (Mean = ${(result.reduce((acc,curr)=>acc+curr.publishedCount,0)/result.length).toFixed(1)})`, 15, 110);


            doc.setFontSize(18);
            doc.setFont("Times", "bold");
            doc.text('Overall Score Distribution', (doc.internal.pageSize.width - doc.getTextWidth('Overall Score Distribution')) / 2, 140);

            // doc.text(`Overall Score Distribution`, 15, 140);
            doc.setFontSize(12);
            doc.setFont("Times", "normal");


            doc.addImage(canvas.toDataURL('image/png'), 'PNG', (doc.internal.pageSize.width - 90) / 2, 160, 90, 90);


            doc.addPage();
            
            // Add space before listing LORs
            let currentY = 15;
            const pageHeight = 280; // Adjust for bottom margin

            // Ensure proper spacing before adding LORs
            doc.setFontSize(22)
            doc.setFont("Times", "bold");
            doc.text("Letters of Recommendation:", 10, currentY);
            currentY += 20;
            doc.setFont("Times", "normal");

            // Display LORs
            item.lor.forEach((lor, index) => {
                if (currentY >= pageHeight) {
                    doc.addPage();
                    currentY = 20;
                    doc.setFont("Times", "bold");
                    doc.text("Letters of Recommendation:", 10, currentY);
                    currentY += 10;
                    doc.setFont("Times", "normal");
                }
                // Split LOR text into multiple lines if necessary
                doc.setFontSize(12);
                doc.setFont("Times", "bold");
                doc.text(`Letter # ${index+1}`, 10, currentY-10);
                doc.setFontSize(10);
                doc.setFont("Times", "normal");

                const lorLines = doc.splitTextToSize(lor, 190);
                lorLines.forEach((line) => {
                    if (currentY >= pageHeight) {
                        doc.addPage();
                        currentY = 20;
                    }
                    doc.text(line, 10, currentY);
                    currentY += 6;
                });
                // Add some space between LORs
                currentY += 10;
            });
            
            // Add a new page for LOR Characteristics
            doc.addPage();

            doc.setFontSize(22);

            // Personal Statement (SOP)
            doc.setFont("Times", "bold");
            doc.text("Personal Statement:", 10, 20);
            doc.setFont("Times", "normal");
            doc.setFontSize(10);
            let sopY = 30;
            const sopText = doc.splitTextToSize(item.sop, 190);

            sopText.forEach((textLine) => {
                if (sopY >= pageHeight) {
                    doc.addPage();
                    sopY = 20;
                }
                doc.text(textLine, 10, sopY);
                sopY += 6;
            });

            doc.setFontSize(12);
            sopY += 10;
            if (sopY >= pageHeight) {
                doc.addPage();
                sopY = 20;
            }

            // Characteristics in SOP (Top 3 bolded)
            doc.setFont("Times", "bold");
            sopY -= 20;
            if (sopY >= pageHeight) {
                doc.addPage();
                sopY = 20;
            }
            
            doc.text("Top characteristics identified in this letter: ", 10, sopY);
            doc.setFont("Times", "normal");
            doc.setFontSize(10);
            sopY += 10;
            item.sopScore.characteristicsInSOP.forEach((char, index) => {
                if (index < 3) {
                    doc.setFont("Times", "normal");
                } else {
                    doc.setFont("Times", "normal");
                }
                if (sopY >= pageHeight) {
                    doc.addPage();
                    sopY = 10;
                }
                doc.text(`${index + 1}. ${char}`, 20, sopY);
                sopY += 5;
            });
            
            // Generate the PDF and open it in a new tab
            const pdfBlob = doc.output('blob');
            const url = URL.createObjectURL(pdfBlob);
            window.open(url, '_blank');
             // Generate the PDF and get its Blob
   
      
        }, 1000); // Adjust timeout as needed for chart rendering
    };
  };
  generateAndOpenPDF()
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



  // useEffect(()=>{
  //   calculations()
  
  // },[])
  useEffect(()=>{
    setLoading(false)
      setResult([
    {
        "name": "Sami Billo",
        "id":"1",
        "researchScore": 41.3,
        "sopScore": {
            "characteristicsInSOP": [
                "problem-solving abilities",
                "organizational skills",
                "punctuality",
                "motivation",
                "cultural sensitivity"
            ],
            "matchedCharacteristics": "5/5"
        },
        "lorScore": {
            "characteristicsInLOR": [
                "problem-solver",
                "organized",
                "punctual",
                "motivated",
                "culturally sensitive"
            ],
            "matchedCharacteristics": "5/5"
        },
        "pic": "https://t4.ftcdn.net/jpg/02/14/74/61/360_F_214746128_31JkeaP6rU0NzzzdFC4khGkmqc8noe6h.jpg",
        "dob": "2024-08-01",
        "medSchool": "Sam Bill High School and College",
        "lor": [
            "August 21, 2024\nAdmissions Committee\nJohns Hopkins University\nMaster of Public Health Program\n550 North Broadway\nBaltimore, MD 21205\nDear Members of the Admissions Committee,\nI am writing to enthusiastically recommend Dr. Michael Anderson for admission to the Master of Public Health (MPH) program at Johns Hopkins University. As Dr. Anderson’s supervisor at Greenwood Medical Center, I have had the pleasure of working closely with him for the past three years. During this time, Dr. Anderson has consistently demonstrated exceptional qualities that I believe make him an outstanding candidate for your program.\nDr. Anderson has shown remarkable problem-solving abilities throughout his tenure with us. His aptitude for diagnosing complex medical conditions and developing effective treatment plans is unparalleled. On numerous occasions, he has tackled intricate cases with a combination of analytical skill and creative thinking, resulting in improved patient outcomes and enhanced team performance. His problem-solving approach reflects both his deep understanding of medical science and his commitment to finding innovative solutions in challenging situations.\nIn addition to his problem-solving skills, Dr. Anderson is extraordinarily organized. His ability to manage multiple tasks efficiently, from patient care to administrative responsibilities, is a testament to his exceptional organizational skills. He maintains meticulous records, coordinates seamlessly with multidisciplinary teams, and ensures that all aspects of his work are completed with precision and attention to detail. This organizational prowess has been instrumental in streamlining processes and enhancing the overall efficiency of our department.\nPunctuality is another area where Dr. Anderson excels. His reliability in adhering to schedules and meeting deadlines is commendable. Whether in clinical settings or during team meetings, Dr. Anderson consistently arrives on time and is prepared to contribute meaningfully. This punctuality not only reflects his respect for others’ time but also underscores his commitment to maintaining high standards of professionalism.\nDr. Anderson’s motivation is a driving force behind his professional achievements. His dedication to advancing his knowledge, improving patient care, and contributing to public health is evident in his proactive approach to learning and development. He is always eager to take on new challenges, seek out additional training, and engage in research opportunities. His intrinsic motivation to excel and make a positive impact in the field of public health is truly inspiring.\nFurthermore, Dr. Anderson’s cultural sensitivity has significantly enhanced his effectiveness as a healthcare provider. He approaches patients from diverse backgrounds with respect and understanding, ensuring that care is delivered in a manner that is both inclusive and culturally appropriate. His ability to connect with individuals from various cultural contexts has fostered a supportive and compassionate environment for both patients and colleagues.\nIn summary, Dr. Michael Anderson possesses a unique blend of problem-solving skills, organizational acumen, punctuality, motivation, and cultural sensitivity that make him an exceptional candidate for the MPH program at Johns Hopkins University. I am confident that he will bring these strengths to your program and contribute positively to your academic community.\nThank you for considering this recommendation. Please feel free to contact me at (555) 123-4567 or s.roberts@greenwoodmed.com if you require any further information.\nSincerely,\nDr. Susan Roberts\nChief Medical Officer\nGreenwood Medical Center\n123 Healthway Avenue\nBaltimore, MD 21201\n(555) 123-4567\ns.roberts@greenwoodmed.com\n",
            
        ],
        "sop": "Statement of Purpose:\nTo the Admissions Committee,\nI am excited to apply for the Master of Public Health (MPH) program at Johns Hopkins University. With a solid foundation in medicine and a passion for addressing public health challenges, I am eager to enhance my expertise and contribute to impactful solutions. My career has been distinguished by my problem-solving abilities, organizational skills, punctuality, motivation, and cultural sensitivity—qualities that I believe align well with the values of your esteemed program.\nMy journey as a physician has honed my problem-solving skills, allowing me to effectively address conThank you for considering my application. I look forward to discussing how my experiences and goals align with the mission of Johns Hopkins University.\nSincerely, Dr. Michael Anderson\nAugust 21, 2024\n\n",
        "researchProductsCount": 15,
        "specialtyCount": 0,
        "fNameCount": 1,
        "peerReviewedCount": 2,
        "abstractResearchCount": 0,
        "publishedCount": 1
    },
      {
        "name": "Samidawng Billo",
        "id":"3",
        "researchScore": 35.3,
        "sopScore": {
            "characteristicsInSOP": [
                "problem-solving abilities",
                "organizational skills",
                "punctuality",
                "motivation",
                "cultural sensitivity"
            ],
            "matchedCharacteristics": "5/5"
        },
        "lorScore": {
            "characteristicsInLOR": [
                "problem-solver",
                "organized",
                "punctual",
                "motivated",
                "culturally sensitive"
            ],
            "matchedCharacteristics": "5/5"
        },
        "pic": "https://t4.ftcdn.net/jpg/02/14/74/61/360_F_214746128_31JkeaP6rU0NzzzdFC4khGkmqc8noe6h.jpg",
        "dob": "2024-08-01",
        "medSchool": "Sam Bill High School and College",
        "lor": [
            "August 21, 2024\nAdmissions Committee\nJohns Hopkins University\nMaster of Public Health Program\n550 North Broadway\nBaltimore, MD 21205\nDear Members of the Admissions Committee,\nI am writing to enthusiastically recommend Dr. Michael Anderson for admission to the Master of Public Health (MPH) program at Johns Hopkins University. As Dr. Anderson’s supervisor at Greenwood Medical Center, I have had the pleasure of working closely with him for the past three years. During this time, Dr. Anderson has consistently demonstrated exceptional qualities that I believe make him an outstanding candidate for your program.\nDr. Anderson has shown remarkable problem-solving abilities throughout his tenure with us. His aptitude for diagnosing complex medical conditions and developing effective treatment plans is unparalleled. On numerous occasions, he has tackled intricate cases with a combination of analytical skill and creative thinking, resulting in improved patient outcomes and enhanced team performance. His problem-solving approach reflects both his deep understanding of medical science and his commitment to finding innovative solutions in challenging situations.\nIn addition to his problem-solving skills, Dr. Anderson is extraordinarily organized. His ability to manage multiple tasks efficiently, from patient care to administrative responsibilities, is a testament to his exceptional organizational skills. He maintains meticulous records, coordinates seamlessly with multidisciplinary teams, and ensures that all aspects of his work are completed with precision and attention to detail. This organizational prowess has been instrumental in streamlining processes and enhancing the overall efficiency of our department.\nPunctuality is another area where Dr. Anderson excels. His reliability in adhering to schedules and meeting deadlines is commendable. Whether in clinical settings or during team meetings, Dr. Anderson consistently arrives on time and is prepared to contribute meaningfully. This punctuality not only reflects his respect for others’ time but also underscores his commitment to maintaining high standards of professionalism.\nDr. Anderson’s motivation is a driving force behind his professional achievements. His dedication to advancing his knowledge, improving patient care, and contributing to public health is evident in his proactive approach to learning and development. He is always eager to take on new challenges, seek out additional training, and engage in research opportunities. His intrinsic motivation to excel and make a positive impact in the field of public health is truly inspiring.\nFurthermore, Dr. Anderson’s cultural sensitivity has significantly enhanced his effectiveness as a healthcare provider. He approaches patients from diverse backgrounds with respect and understanding, ensuring that care is delivered in a manner that is both inclusive and culturally appropriate. His ability to connect with individuals from various cultural contexts has fostered a supportive and compassionate environment for both patients and colleagues.\nIn summary, Dr. Michael Anderson possesses a unique blend of problem-solving skills, organizational acumen, punctuality, motivation, and cultural sensitivity that make him an exceptional candidate for the MPH program at Johns Hopkins University. I am confident that he will bring these strengths to your program and contribute positively to your academic community.\nThank you for considering this recommendation. Please feel free to contact me at (555) 123-4567 or s.roberts@greenwoodmed.com if you require any further information.\nSincerely,\nDr. Susan Roberts\nChief Medical Officer\nGreenwood Medical Center\n123 Healthway Avenue\nBaltimore, MD 21201\n(555) 123-4567\ns.roberts@greenwoodmed.com\n",
            
        ],
        "sop": "Statement of Purpose:\nTo the Admissions Committee,\nI am excited to apply for the Master of Public Health (MPH) program at Johns Hopkins University. With a solid foundation in medicine and a passion for addressing public health challenges, I am eager to enhance my expertise and contribute to impactful solutions. My career has been distinguished by my problem-solving abilities, organizational skills, punctuality, motivation, and cultural sensitivity—qualities that I believe align well with the values of your esteemed program.\nMy journey as a physician has honed my problem-solving skills, allowing me to effectively address conThank you for considering my application. I look forward to discussing how my experiences and goals align with the mission of Johns Hopkins University.\nSincerely, Dr. Michael Anderson\nAugust 21, 2024\n\n",
        "researchProductsCount": 15,
        "specialtyCount": 0,
        "fNameCount": 1,
        "peerReviewedCount": 2,
        "abstractResearchCount": 0,
        "publishedCount": 1
    },
    {
        "name": "Sami Bill",
        "id":"2",
        "researchScore": 25.3,
        "sopScore": {
            "characteristicsInSOP": [
                "problem-solving abilities",
                "organizational skills",
                "punctuality",
                "motivation",
                "cultural sensitivity"
            ],
            "matchedCharacteristics": "5/5"
        },
        "lorScore": {
            "characteristicsInLOR": [
                "problem-solver",
                "organized",
                "punctual",
                "motivated",
                "culturally sensitive"
            ],
            "matchedCharacteristics": "3/5"
        },
        "pic": "https://t4.ftcdn.net/jpg/02/14/74/61/360_F_214746128_31JkeaP6rU0NzzzdFC4khGkmqc8noe6h.jpg",
        "dob": "2024-08-01",
        "medSchool": "Sam Bill High School and College",
        "lor": [
            "August 21, 2024\nAdmissions Committee\nJohns Hopkins University\nMaster of Public Health Program\n550 North Broadway\nBaltimore, MD 21205\nDear Members of the Admissions Committee,\nI am writing to enthusiastically recommend Dr. Michael Anderson for admission to the Master of Public Health (MPH) program at Johns Hopkins University. As Dr. Anderson’s supervisor at Greenwood Medical Center, I have had the pleasure of working closely with him for the past three years. During this time, Dr. Anderson has consistently demonstrated exceptional qualities that I believe make him an outstanding candidate for your program.\nDr. Anderson has shown remarkable problem-solving abilities throughout his tenure with us. His aptitude for diagnosing complex medical conditions and developing effective treatment plans is unparalleled. On numerous occasions, he has tackled intricate cases with a combination of analytical skill and creative thinking, resulting in improved patient outcomes and enhanced team performance. His problem-solving approach reflects both his deep understanding of medical science and his commitment to finding innovative solutions in challenging situations.\nIn addition to his problem-solving skills, Dr. Anderson is extraordinarily organized. His ability to manage multiple tasks efficiently, from patient care to administrative responsibilities, is a testament to his exceptional organizational skills. He maintains meticulous records, coordinates seamlessly with multidisciplinary teams, and ensures that all aspects of his work are completed with precision and attention to detail. This organizational prowess has been instrumental in streamlining processes and enhancing the overall efficiency of our department.\nPunctuality is another area where Dr. Anderson excels. His reliability in adhering to schedules and meeting deadlines is commendable. Whether in clinical settings or during team meetings, Dr. Anderson consistently arrives on time and is prepared to contribute meaningfully. This punctuality not only reflects his respect for others’ time but also underscores his commitment to maintaining high standards of professionalism.\nDr. Anderson’s motivation is a driving force behind his professional achievements. His dedication to advancing his knowledge, improving patient care, and contributing to public health is evident in his proactive approach to learning and development. He is always eager to take on new challenges, seek out additional training, and engage in research opportunities. His intrinsic motivation to excel and make a positive impact in the field of public health is truly inspiring.\nFurthermore, Dr. Anderson’s cultural sensitivity has significantly enhanced his effectiveness as a healthcare provider. He approaches patients from diverse backgrounds with respect and understanding, ensuring that care is delivered in a manner that is both inclusive and culturally appropriate. His ability to connect with individuals from various cultural contexts has fostered a supportive and compassionate environment for both patients and colleagues.\nIn summary, Dr. Michael Anderson possesses a unique blend of problem-solving skills, organizational acumen, punctuality, motivation, and cultural sensitivity that make him an exceptional candidate for the MPH program at Johns Hopkins University. I am confident that he will bring these strengths to your program and contribute positively to your academic community.\nThank you for considering this recommendation. Please feel free to contact me at (555) 123-4567 or s.roberts@greenwoodmed.com if you require any further information.\nSincerely,\nDr. Susan Roberts\nChief Medical Officer\nGreenwood Medical Center\n123 Healthway Avenue\nBaltimore, MD 21201\n(555) 123-4567\ns.roberts@greenwoodmed.com\n",
            "August 21, 2024\nAdmissions Committee\nJohns Hopkins University\nMaster of Public Health Program\n550 North Broadway\nBaltimore, MD 21205\nDear Members of the Admissions Committee,\nI am honored to write this letter of recommendation for Dr. Michael Anderson, who is applying for the Master of Public Health (MPH) program at Johns Hopkins University. As Dr. Anderson’s mentor and supervisor at Apex Health Clinic, I have had the privilege of observing his professional growth and dedication over the past four years. Dr. Anderson embodies the qualities of a problem-solver, organized individual, punctual professional, motivated learner, and culturally sensitive practitioner, making him an exemplary candidate for your program.\nDr. Anderson excels in problem-solving, a critical skill in the medical field. His ability to analyze complex clinical scenarios and devise effective treatment strategies has consistently impressed both colleagues and patients. For instance, he successfully managed a series of challenging cases involving rare conditions, demonstrating not only his analytical prowess but also his capacity for creative problem-solving under pressure. His methodical approach and innovative solutions have greatly contributed to our clinic’s reputation for excellence.\nOrganization is another area where Dr. Anderson stands out. His proficiency in managing a high volume of patient information, coordinating with various healthcare professionals, and ensuring that all tasks are completed efficiently reflects his exceptional organizational skills. Dr. Anderson’s well-maintained records and systematic approach to patient care have streamlined our processes and improved overall clinic efficiency, enhancing our ability to deliver top-notch healthcare.\nPunctuality is a cornerstone of Dr. Anderson’s professional demeanor. He consistently demonstrates reliability by adhering to scheduled appointments, meeting deadlines, and maintaining a high standard of punctuality in all his duties. His dedication to being timely and prepared underscores his commitment to his role and his respect for his colleagues and patients.\nDr. Anderson’s motivation is evident in his unwavering commitment to advancing his skills and knowledge. His proactive attitude towards professional development, including his participation in various workshops and research projects, reflects his strong drive and determination. Dr. Anderson’s enthusiasm for learning and his desire to contribute meaningfully to the field of public health highlight his potential as a valuable asset to your program.\nCultural sensitivity is a hallmark of Dr. Anderson’s practice. His ability to understand and respect the diverse backgrounds of his patients has fostered an inclusive environment within our clinic. Dr. Anderson’s empathetic approach and his efforts to provide culturally competent care have enhanced patient trust and satisfaction, further demonstrating his dedication to equitable healthcare.\nIn conclusion, Dr. Michael Anderson’s exceptional problem-solving skills, organizational expertise, punctuality, motivation, and cultural sensitivity make him an outstanding candidate for the MPH program at Johns Hopkins University. I am confident that he will contribute significantly to your program and continue to excel in his career in public health.\nThank you for considering this recommendation. Should you require any additional information, please feel free to contact me at (555) 987-6543 or l.martinez@apexhealth.org.\nSincerely,\nDr. Laura Martinez\nDirector of Clinical Services\nApex Health Clinic\n456 Wellness Drive\nBaltimore, MD 21202\n(555) 987-6543\nl.martinez@apexhealth.org\n"
        ],
        "sop": "Statement of Purpose:\nTo the Admissions Committee,\nI am excited to apply for the Master of Public Health (MPH) program at Johns Hopkins University. With a solid foundation in medicine and a passion for addressing public health challenges, I am eager to enhance my expertise and contribute to impactful solutions. My career has been distinguished by my problem-solving abilities, organizational skills, punctuality, motivation, and cultural sensitivity—qualities that I believe align well with the values of your esteemed program.\nMy journey as a physician has honed my problem-solving skills, allowing me to effectively address complex medical issues and develop innovative solutions for diverse patient needs. Whether diagnosing intricate conditions or managing unexpected complications, I approach each challenge with a strategic mindset and a commitment to finding the best possible outcomes. This problem-solving aptitude is a critical asset I bring to the MPH program, where addressing public health issues requires both analytical and creative thinking.\nBeing organized has been a fundamental aspect of my professional practice. Managing patient care, coordinating with interdisciplinary teams, and handling administrative tasks require a structured approach to ensure efficiency and accuracy. My organizational skills have enabled me to maintain detailed records, prioritize tasks effectively, and streamline processes, all of which are essential for success in a rigorous academic environment.\nPunctuality is a principle I uphold with the utmost seriousness. In the medical field, being on time is crucial for providing timely patient care and ensuring smooth operations. My commitment to punctuality extends beyond clinical settings to all professional and personal commitments, reflecting my respect for others’ time and my dedication to fulfilling responsibilities reliably.\nMotivation drives my pursuit of excellence and continuous improvement. My dedication to advancing my knowledge and skills is reflected in my proactive approach to learning and professional development. I am deeply motivated to contribute to public health advancements, and I am eager to leverage the resources and opportunities at Johns Hopkins to further this mission.\nCultural sensitivity has been a cornerstone of my practice, enabling me to connect with patients from diverse backgrounds and provide care that is respectful and inclusive. Understanding and appreciating cultural differences is essential for effective communication and care, and I am committed to bringing this sensitivity to my work in public health, ensuring that interventions are both equitable and effective.\nJohns Hopkins University’s MPH program is an ideal setting for me to build upon these strengths and address global health challenges. The program’s focus on innovative research and practical solutions aligns perfectly with my goals. I am confident that my background and attributes will allow me to contribute meaningfully to your program and grow as a public health professional.\nThank you for considering my application. I look forward to discussing how my experiences and goals align with the mission of Johns Hopkins University.\nSincerely, Dr. Michael Anderson\nAugust 21, 2024\n\n",
        "researchProductsCount": 2,
        "specialtyCount": 0,
        "fNameCount": 1,
        "peerReviewedCount": 2,
        "abstractResearchCount": 0,
        "publishedCount": 1
    },
      {
        "name": "Samiain Billo",
        "id":"4",
        "researchScore": 35.3,
        "sopScore": {
            "characteristicsInSOP": [
                "problem-solving abilities",
                "organizational skills",
                "punctuality",
                "motivation",
                "cultural sensitivity"
            ],
            "matchedCharacteristics": "5/5"
        },
        "lorScore": {
            "characteristicsInLOR": [
                "problem-solver",
                "organized",
                "punctual",
                "motivated",
                "culturally sensitive"
            ],
            "matchedCharacteristics": "5/5"
        },
        "pic": "https://t4.ftcdn.net/jpg/02/14/74/61/360_F_214746128_31JkeaP6rU0NzzzdFC4khGkmqc8noe6h.jpg",
        "dob": "2024-08-01",
        "medSchool": "Sam Bill High School and College",
        "lor": [
            "August 21, 2024\nAdmissions Committee\nJohns Hopkins University\nMaster of Public Health Program\n550 North Broadway\nBaltimore, MD 21205\nDear Members of the Admissions Committee,\nI am writing to enthusiastically recommend Dr. Michael Anderson for admission to the Master of Public Health (MPH) program at Johns Hopkins University. As Dr. Anderson’s supervisor at Greenwood Medical Center, I have had the pleasure of working closely with him for the past three years. During this time, Dr. Anderson has consistently demonstrated exceptional qualities that I believe make him an outstanding candidate for your program.\nDr. Anderson has shown remarkable problem-solving abilities throughout his tenure with us. His aptitude for diagnosing complex medical conditions and developing effective treatment plans is unparalleled. On numerous occasions, he has tackled intricate cases with a combination of analytical skill and creative thinking, resulting in improved patient outcomes and enhanced team performance. His problem-solving approach reflects both his deep understanding of medical science and his commitment to finding innovative solutions in challenging situations.\nIn addition to his problem-solving skills, Dr. Anderson is extraordinarily organized. His ability to manage multiple tasks efficiently, from patient care to administrative responsibilities, is a testament to his exceptional organizational skills. He maintains meticulous records, coordinates seamlessly with multidisciplinary teams, and ensures that all aspects of his work are completed with precision and attention to detail. This organizational prowess has been instrumental in streamlining processes and enhancing the overall efficiency of our department.\nPunctuality is another area where Dr. Anderson excels. His reliability in adhering to schedules and meeting deadlines is commendable. Whether in clinical settings or during team meetings, Dr. Anderson consistently arrives on time and is prepared to contribute meaningfully. This punctuality not only reflects his respect for others’ time but also underscores his commitment to maintaining high standards of professionalism.\nDr. Anderson’s motivation is a driving force behind his professional achievements. His dedication to advancing his knowledge, improving patient care, and contributing to public health is evident in his proactive approach to learning and development. He is always eager to take on new challenges, seek out additional training, and engage in research opportunities. His intrinsic motivation to excel and make a positive impact in the field of public health is truly inspiring.\nFurthermore, Dr. Anderson’s cultural sensitivity has significantly enhanced his effectiveness as a healthcare provider. He approaches patients from diverse backgrounds with respect and understanding, ensuring that care is delivered in a manner that is both inclusive and culturally appropriate. His ability to connect with individuals from various cultural contexts has fostered a supportive and compassionate environment for both patients and colleagues.\nIn summary, Dr. Michael Anderson possesses a unique blend of problem-solving skills, organizational acumen, punctuality, motivation, and cultural sensitivity that make him an exceptional candidate for the MPH program at Johns Hopkins University. I am confident that he will bring these strengths to your program and contribute positively to your academic community.\nThank you for considering this recommendation. Please feel free to contact me at (555) 123-4567 or s.roberts@greenwoodmed.com if you require any further information.\nSincerely,\nDr. Susan Roberts\nChief Medical Officer\nGreenwood Medical Center\n123 Healthway Avenue\nBaltimore, MD 21201\n(555) 123-4567\ns.roberts@greenwoodmed.com\n",
            
        ],
        "sop": "Statement of Purpose:\nTo the Admissions Committee,\nI am excited to apply for the Master of Public Health (MPH) program at Johns Hopkins University. With a solid foundation in medicine and a passion for addressing public health challenges, I am eager to enhance my expertise and contribute to impactful solutions. My career has been distinguished by my problem-solving abilities, organizational skills, punctuality, motivation, and cultural sensitivity—qualities that I believe align well with the values of your esteemed program.\nMy journey as a physician has honed my problem-solving skills, allowing me to effectively address conThank you for considering my application. I look forward to discussing how my experiences and goals align with the mission of Johns Hopkins University.\nSincerely, Dr. Michael Anderson\nAugust 21, 2024\n\n",
        "researchProductsCount": 15,
        "specialtyCount": 0,
        "fNameCount": 1,
        "peerReviewedCount": 2,
        "abstractResearchCount": 0,
        "publishedCount": 1
    },
      {
        "name": "Samina Billyo",
        "id":"5",
        "researchScore": 53.3,
        "sopScore": {
            "characteristicsInSOP": [
                "problem-solving abilities",
                "organizational skills",
                "punctuality",
                "motivation",
                "cultural sensitivity"
            ],
            "matchedCharacteristics": "5/5"
        },
        "lorScore": {
            "characteristicsInLOR": [
                "problem-solver",
                "organized",
                "punctual",
                "motivated",
                "culturally sensitive"
            ],
            "matchedCharacteristics": "5/5"
        },
        "pic": "https://t4.ftcdn.net/jpg/02/14/74/61/360_F_214746128_31JkeaP6rU0NzzzdFC4khGkmqc8noe6h.jpg",
        "dob": "2024-08-01",
        "medSchool": "Sam Bill High School and College",
        "lor": [
            "August 21, 2024\nAdmissions Committee\nJohns Hopkins University\nMaster of Public Health Program\n550 North Broadway\nBaltimore, MD 21205\nDear Members of the Admissions Committee,\nI am writing to enthusiastically recommend Dr. Michael Anderson for admission to the Master of Public Health (MPH) program at Johns Hopkins University. As Dr. Anderson’s supervisor at Greenwood Medical Center, I have had the pleasure of working closely with him for the past three years. During this time, Dr. Anderson has consistently demonstrated exceptional qualities that I believe make him an outstanding candidate for your program.\nDr. Anderson has shown remarkable problem-solving abilities throughout his tenure with us. His aptitude for diagnosing complex medical conditions and developing effective treatment plans is unparalleled. On numerous occasions, he has tackled intricate cases with a combination of analytical skill and creative thinking, resulting in improved patient outcomes and enhanced team performance. His problem-solving approach reflects both his deep understanding of medical science and his commitment to finding innovative solutions in challenging situations.\nIn addition to his problem-solving skills, Dr. Anderson is extraordinarily organized. His ability to manage multiple tasks efficiently, from patient care to administrative responsibilities, is a testament to his exceptional organizational skills. He maintains meticulous records, coordinates seamlessly with multidisciplinary teams, and ensures that all aspects of his work are completed with precision and attention to detail. This organizational prowess has been instrumental in streamlining processes and enhancing the overall efficiency of our department.\nPunctuality is another area where Dr. Anderson excels. His reliability in adhering to schedules and meeting deadlines is commendable. Whether in clinical settings or during team meetings, Dr. Anderson consistently arrives on time and is prepared to contribute meaningfully. This punctuality not only reflects his respect for others’ time but also underscores his commitment to maintaining high standards of professionalism.\nDr. Anderson’s motivation is a driving force behind his professional achievements. His dedication to advancing his knowledge, improving patient care, and contributing to public health is evident in his proactive approach to learning and development. He is always eager to take on new challenges, seek out additional training, and engage in research opportunities. His intrinsic motivation to excel and make a positive impact in the field of public health is truly inspiring.\nFurthermore, Dr. Anderson’s cultural sensitivity has significantly enhanced his effectiveness as a healthcare provider. He approaches patients from diverse backgrounds with respect and understanding, ensuring that care is delivered in a manner that is both inclusive and culturally appropriate. His ability to connect with individuals from various cultural contexts has fostered a supportive and compassionate environment for both patients and colleagues.\nIn summary, Dr. Michael Anderson possesses a unique blend of problem-solving skills, organizational acumen, punctuality, motivation, and cultural sensitivity that make him an exceptional candidate for the MPH program at Johns Hopkins University. I am confident that he will bring these strengths to your program and contribute positively to your academic community.\nThank you for considering this recommendation. Please feel free to contact me at (555) 123-4567 or s.roberts@greenwoodmed.com if you require any further information.\nSincerely,\nDr. Susan Roberts\nChief Medical Officer\nGreenwood Medical Center\n123 Healthway Avenue\nBaltimore, MD 21201\n(555) 123-4567\ns.roberts@greenwoodmed.com\n",
            
        ],
        "sop": "Statement of Purpose:\nTo the Admissions Committee,\nI am excited to apply for the Master of Public Health (MPH) program at Johns Hopkins University. With a solid foundation in medicine and a passion for addressing public health challenges, I am eager to enhance my expertise and contribute to impactful solutions. My career has been distinguished by my problem-solving abilities, organizational skills, punctuality, motivation, and cultural sensitivity—qualities that I believe align well with the values of your esteemed program.\nMy journey as a physician has honed my problem-solving skills, allowing me to effectively address conThank you for considering my application. I look forward to discussing how my experiences and goals align with the mission of Johns Hopkins University.\nSincerely, Dr. Michael Anderson\nAugust 21, 2024\n\n",
        "researchProductsCount": 15,
        "specialtyCount": 0,
        "fNameCount": 1,
        "peerReviewedCount": 2,
        "abstractResearchCount": 0,
        "publishedCount": 1
    },
      {
        "name": "Saminaplk Billo",
        "id":"6",
        "researchScore": 43.3,
        "sopScore": {
            "characteristicsInSOP": [
                "problem-solving abilities",
                "organizational skills",
                "punctuality",
                "motivation",
                "cultural sensitivity"
            ],
            "matchedCharacteristics": "5/5"
        },
        "lorScore": {
            "characteristicsInLOR": [
                "problem-solver",
                "organized",
                "punctual",
                "motivated",
                "culturally sensitive"
            ],
            "matchedCharacteristics": "5/5"
        },
        "pic": "https://t4.ftcdn.net/jpg/02/14/74/61/360_F_214746128_31JkeaP6rU0NzzzdFC4khGkmqc8noe6h.jpg",
        "dob": "2024-08-01",
        "medSchool": "Sam Bill High School and College",
        "lor": [
            "August 21, 2024\nAdmissions Committee\nJohns Hopkins University\nMaster of Public Health Program\n550 North Broadway\nBaltimore, MD 21205\nDear Members of the Admissions Committee,\nI am writing to enthusiastically recommend Dr. Michael Anderson for admission to the Master of Public Health (MPH) program at Johns Hopkins University. As Dr. Anderson’s supervisor at Greenwood Medical Center, I have had the pleasure of working closely with him for the past three years. During this time, Dr. Anderson has consistently demonstrated exceptional qualities that I believe make him an outstanding candidate for your program.\nDr. Anderson has shown remarkable problem-solving abilities throughout his tenure with us. His aptitude for diagnosing complex medical conditions and developing effective treatment plans is unparalleled. On numerous occasions, he has tackled intricate cases with a combination of analytical skill and creative thinking, resulting in improved patient outcomes and enhanced team performance. His problem-solving approach reflects both his deep understanding of medical science and his commitment to finding innovative solutions in challenging situations.\nIn addition to his problem-solving skills, Dr. Anderson is extraordinarily organized. His ability to manage multiple tasks efficiently, from patient care to administrative responsibilities, is a testament to his exceptional organizational skills. He maintains meticulous records, coordinates seamlessly with multidisciplinary teams, and ensures that all aspects of his work are completed with precision and attention to detail. This organizational prowess has been instrumental in streamlining processes and enhancing the overall efficiency of our department.\nPunctuality is another area where Dr. Anderson excels. His reliability in adhering to schedules and meeting deadlines is commendable. Whether in clinical settings or during team meetings, Dr. Anderson consistently arrives on time and is prepared to contribute meaningfully. This punctuality not only reflects his respect for others’ time but also underscores his commitment to maintaining high standards of professionalism.\nDr. Anderson’s motivation is a driving force behind his professional achievements. His dedication to advancing his knowledge, improving patient care, and contributing to public health is evident in his proactive approach to learning and development. He is always eager to take on new challenges, seek out additional training, and engage in research opportunities. His intrinsic motivation to excel and make a positive impact in the field of public health is truly inspiring.\nFurthermore, Dr. Anderson’s cultural sensitivity has significantly enhanced his effectiveness as a healthcare provider. He approaches patients from diverse backgrounds with respect and understanding, ensuring that care is delivered in a manner that is both inclusive and culturally appropriate. His ability to connect with individuals from various cultural contexts has fostered a supportive and compassionate environment for both patients and colleagues.\nIn summary, Dr. Michael Anderson possesses a unique blend of problem-solving skills, organizational acumen, punctuality, motivation, and cultural sensitivity that make him an exceptional candidate for the MPH program at Johns Hopkins University. I am confident that he will bring these strengths to your program and contribute positively to your academic community.\nThank you for considering this recommendation. Please feel free to contact me at (555) 123-4567 or s.roberts@greenwoodmed.com if you require any further information.\nSincerely,\nDr. Susan Roberts\nChief Medical Officer\nGreenwood Medical Center\n123 Healthway Avenue\nBaltimore, MD 21201\n(555) 123-4567\ns.roberts@greenwoodmed.com\n",
            
        ],
        "sop": "Statement of Purpose:\nTo the Admissions Committee,\nI am excited to apply for the Master of Public Health (MPH) program at Johns Hopkins University. With a solid foundation in medicine and a passion for addressing public health challenges, I am eager to enhance my expertise and contribute to impactful solutions. My career has been distinguished by my problem-solving abilities, organizational skills, punctuality, motivation, and cultural sensitivity—qualities that I believe align well with the values of your esteemed program.\nMy journey as a physician has honed my problem-solving skills, allowing me to effectively address conThank you for considering my application. I look forward to discussing how my experiences and goals align with the mission of Johns Hopkins University.\nSincerely, Dr. Michael Anderson\nAugust 21, 2024\n\n",
        "researchProductsCount": 15,
        "specialtyCount": 0,
        "fNameCount": 1,
        "peerReviewedCount": 2,
        "abstractResearchCount": 0,
        "publishedCount": 1
    },
      {
        "name": "Saminaopk Billo",
        "id":"7",
        "researchScore": 23.3,
        "sopScore": {
            "characteristicsInSOP": [
                "problem-solving abilities",
                "organizational skills",
                "punctuality",
                "motivation",
                "cultural sensitivity"
            ],
            "matchedCharacteristics": "5/5"
        },
        "lorScore": {
            "characteristicsInLOR": [
                "problem-solver",
                "organized",
                "punctual",
                "motivated",
                "culturally sensitive"
            ],
            "matchedCharacteristics": "5/5"
        },
        "pic": "https://t4.ftcdn.net/jpg/02/14/74/61/360_F_214746128_31JkeaP6rU0NzzzdFC4khGkmqc8noe6h.jpg",
        "dob": "2024-08-01",
        "medSchool": "Sam Bill High School and College",
        "lor": [
            "August 21, 2024\nAdmissions Committee\nJohns Hopkins University\nMaster of Public Health Program\n550 North Broadway\nBaltimore, MD 21205\nDear Members of the Admissions Committee,\nI am writing to enthusiastically recommend Dr. Michael Anderson for admission to the Master of Public Health (MPH) program at Johns Hopkins University. As Dr. Anderson’s supervisor at Greenwood Medical Center, I have had the pleasure of working closely with him for the past three years. During this time, Dr. Anderson has consistently demonstrated exceptional qualities that I believe make him an outstanding candidate for your program.\nDr. Anderson has shown remarkable problem-solving abilities throughout his tenure with us. His aptitude for diagnosing complex medical conditions and developing effective treatment plans is unparalleled. On numerous occasions, he has tackled intricate cases with a combination of analytical skill and creative thinking, resulting in improved patient outcomes and enhanced team performance. His problem-solving approach reflects both his deep understanding of medical science and his commitment to finding innovative solutions in challenging situations.\nIn addition to his problem-solving skills, Dr. Anderson is extraordinarily organized. His ability to manage multiple tasks efficiently, from patient care to administrative responsibilities, is a testament to his exceptional organizational skills. He maintains meticulous records, coordinates seamlessly with multidisciplinary teams, and ensures that all aspects of his work are completed with precision and attention to detail. This organizational prowess has been instrumental in streamlining processes and enhancing the overall efficiency of our department.\nPunctuality is another area where Dr. Anderson excels. His reliability in adhering to schedules and meeting deadlines is commendable. Whether in clinical settings or during team meetings, Dr. Anderson consistently arrives on time and is prepared to contribute meaningfully. This punctuality not only reflects his respect for others’ time but also underscores his commitment to maintaining high standards of professionalism.\nDr. Anderson’s motivation is a driving force behind his professional achievements. His dedication to advancing his knowledge, improving patient care, and contributing to public health is evident in his proactive approach to learning and development. He is always eager to take on new challenges, seek out additional training, and engage in research opportunities. His intrinsic motivation to excel and make a positive impact in the field of public health is truly inspiring.\nFurthermore, Dr. Anderson’s cultural sensitivity has significantly enhanced his effectiveness as a healthcare provider. He approaches patients from diverse backgrounds with respect and understanding, ensuring that care is delivered in a manner that is both inclusive and culturally appropriate. His ability to connect with individuals from various cultural contexts has fostered a supportive and compassionate environment for both patients and colleagues.\nIn summary, Dr. Michael Anderson possesses a unique blend of problem-solving skills, organizational acumen, punctuality, motivation, and cultural sensitivity that make him an exceptional candidate for the MPH program at Johns Hopkins University. I am confident that he will bring these strengths to your program and contribute positively to your academic community.\nThank you for considering this recommendation. Please feel free to contact me at (555) 123-4567 or s.roberts@greenwoodmed.com if you require any further information.\nSincerely,\nDr. Susan Roberts\nChief Medical Officer\nGreenwood Medical Center\n123 Healthway Avenue\nBaltimore, MD 21201\n(555) 123-4567\ns.roberts@greenwoodmed.com\n",
            
        ],
        "sop": "Statement of Purpose:\nTo the Admissions Committee,\nI am excited to apply for the Master of Public Health (MPH) program at Johns Hopkins University. With a solid foundation in medicine and a passion for addressing public health challenges, I am eager to enhance my expertise and contribute to impactful solutions. My career has been distinguished by my problem-solving abilities, organizational skills, punctuality, motivation, and cultural sensitivity—qualities that I believe align well with the values of your esteemed program.\nMy journey as a physician has honed my problem-solving skills, allowing me to effectively address conThank you for considering my application. I look forward to discussing how my experiences and goals align with the mission of Johns Hopkins University.\nSincerely, Dr. Michael Anderson\nAugust 21, 2024\n\n",
        "researchProductsCount": 15,
        "specialtyCount": 0,
        "fNameCount": 1,
        "peerReviewedCount": 2,
        "abstractResearchCount": 0,
        "publishedCount": 1
    },
      {
        "name": "Saminolka Billo",
        "id":"8",
        "researchScore": 53.3,
        "sopScore": {
            "characteristicsInSOP": [
                "problem-solving abilities",
                "organizational skills",
                "punctuality",
                "motivation",
                "cultural sensitivity"
            ],
            "matchedCharacteristics": "5/5"
        },
        "lorScore": {
            "characteristicsInLOR": [
                "problem-solver",
                "organized",
                "punctual",
                "motivated",
                "culturally sensitive"
            ],
            "matchedCharacteristics": "5/5"
        },
        "pic": "https://t4.ftcdn.net/jpg/02/14/74/61/360_F_214746128_31JkeaP6rU0NzzzdFC4khGkmqc8noe6h.jpg",
        "dob": "2024-08-01",
        "medSchool": "Sam Bill High School and College",
        "lor": [
            "August 21, 2024\nAdmissions Committee\nJohns Hopkins University\nMaster of Public Health Program\n550 North Broadway\nBaltimore, MD 21205\nDear Members of the Admissions Committee,\nI am writing to enthusiastically recommend Dr. Michael Anderson for admission to the Master of Public Health (MPH) program at Johns Hopkins University. As Dr. Anderson’s supervisor at Greenwood Medical Center, I have had the pleasure of working closely with him for the past three years. During this time, Dr. Anderson has consistently demonstrated exceptional qualities that I believe make him an outstanding candidate for your program.\nDr. Anderson has shown remarkable problem-solving abilities throughout his tenure with us. His aptitude for diagnosing complex medical conditions and developing effective treatment plans is unparalleled. On numerous occasions, he has tackled intricate cases with a combination of analytical skill and creative thinking, resulting in improved patient outcomes and enhanced team performance. His problem-solving approach reflects both his deep understanding of medical science and his commitment to finding innovative solutions in challenging situations.\nIn addition to his problem-solving skills, Dr. Anderson is extraordinarily organized. His ability to manage multiple tasks efficiently, from patient care to administrative responsibilities, is a testament to his exceptional organizational skills. He maintains meticulous records, coordinates seamlessly with multidisciplinary teams, and ensures that all aspects of his work are completed with precision and attention to detail. This organizational prowess has been instrumental in streamlining processes and enhancing the overall efficiency of our department.\nPunctuality is another area where Dr. Anderson excels. His reliability in adhering to schedules and meeting deadlines is commendable. Whether in clinical settings or during team meetings, Dr. Anderson consistently arrives on time and is prepared to contribute meaningfully. This punctuality not only reflects his respect for others’ time but also underscores his commitment to maintaining high standards of professionalism.\nDr. Anderson’s motivation is a driving force behind his professional achievements. His dedication to advancing his knowledge, improving patient care, and contributing to public health is evident in his proactive approach to learning and development. He is always eager to take on new challenges, seek out additional training, and engage in research opportunities. His intrinsic motivation to excel and make a positive impact in the field of public health is truly inspiring.\nFurthermore, Dr. Anderson’s cultural sensitivity has significantly enhanced his effectiveness as a healthcare provider. He approaches patients from diverse backgrounds with respect and understanding, ensuring that care is delivered in a manner that is both inclusive and culturally appropriate. His ability to connect with individuals from various cultural contexts has fostered a supportive and compassionate environment for both patients and colleagues.\nIn summary, Dr. Michael Anderson possesses a unique blend of problem-solving skills, organizational acumen, punctuality, motivation, and cultural sensitivity that make him an exceptional candidate for the MPH program at Johns Hopkins University. I am confident that he will bring these strengths to your program and contribute positively to your academic community.\nThank you for considering this recommendation. Please feel free to contact me at (555) 123-4567 or s.roberts@greenwoodmed.com if you require any further information.\nSincerely,\nDr. Susan Roberts\nChief Medical Officer\nGreenwood Medical Center\n123 Healthway Avenue\nBaltimore, MD 21201\n(555) 123-4567\ns.roberts@greenwoodmed.com\n",
            
        ],
        "sop": "Statement of Purpose:\nTo the Admissions Committee,\nI am excited to apply for the Master of Public Health (MPH) program at Johns Hopkins University. With a solid foundation in medicine and a passion for addressing public health challenges, I am eager to enhance my expertise and contribute to impactful solutions. My career has been distinguished by my problem-solving abilities, organizational skills, punctuality, motivation, and cultural sensitivity—qualities that I believe align well with the values of your esteemed program.\nMy journey as a physician has honed my problem-solving skills, allowing me to effectively address conThank you for considering my application. I look forward to discussing how my experiences and goals align with the mission of Johns Hopkins University.\nSincerely, Dr. Michael Anderson\nAugust 21, 2024\n\n",
        "researchProductsCount": 15,
        "specialtyCount": 0,
        "fNameCount": 1,
        "peerReviewedCount": 2,
        "abstractResearchCount": 0,
        "publishedCount": 1
    },
      {
        "name": "Samhgfina Billo",
        "id":"9",
        "researchScore": 37.3,
        "sopScore": {
            "characteristicsInSOP": [
                "problem-solving abilities",
                "organizational skills",
                "punctuality",
                "motivation",
                "cultural sensitivity"
            ],
            "matchedCharacteristics": "5/5"
        },
        "lorScore": {
            "characteristicsInLOR": [
                "problem-solver",
                "organized",
                "punctual",
                "motivated",
                "culturally sensitive"
            ],
            "matchedCharacteristics": "5/5"
        },
        "pic": "https://t4.ftcdn.net/jpg/02/14/74/61/360_F_214746128_31JkeaP6rU0NzzzdFC4khGkmqc8noe6h.jpg",
        "dob": "2024-08-01",
        "medSchool": "Sam Bill High School and College",
        "lor": [
            "August 21, 2024\nAdmissions Committee\nJohns Hopkins University\nMaster of Public Health Program\n550 North Broadway\nBaltimore, MD 21205\nDear Members of the Admissions Committee,\nI am writing to enthusiastically recommend Dr. Michael Anderson for admission to the Master of Public Health (MPH) program at Johns Hopkins University. As Dr. Anderson’s supervisor at Greenwood Medical Center, I have had the pleasure of working closely with him for the past three years. During this time, Dr. Anderson has consistently demonstrated exceptional qualities that I believe make him an outstanding candidate for your program.\nDr. Anderson has shown remarkable problem-solving abilities throughout his tenure with us. His aptitude for diagnosing complex medical conditions and developing effective treatment plans is unparalleled. On numerous occasions, he has tackled intricate cases with a combination of analytical skill and creative thinking, resulting in improved patient outcomes and enhanced team performance. His problem-solving approach reflects both his deep understanding of medical science and his commitment to finding innovative solutions in challenging situations.\nIn addition to his problem-solving skills, Dr. Anderson is extraordinarily organized. His ability to manage multiple tasks efficiently, from patient care to administrative responsibilities, is a testament to his exceptional organizational skills. He maintains meticulous records, coordinates seamlessly with multidisciplinary teams, and ensures that all aspects of his work are completed with precision and attention to detail. This organizational prowess has been instrumental in streamlining processes and enhancing the overall efficiency of our department.\nPunctuality is another area where Dr. Anderson excels. His reliability in adhering to schedules and meeting deadlines is commendable. Whether in clinical settings or during team meetings, Dr. Anderson consistently arrives on time and is prepared to contribute meaningfully. This punctuality not only reflects his respect for others’ time but also underscores his commitment to maintaining high standards of professionalism.\nDr. Anderson’s motivation is a driving force behind his professional achievements. His dedication to advancing his knowledge, improving patient care, and contributing to public health is evident in his proactive approach to learning and development. He is always eager to take on new challenges, seek out additional training, and engage in research opportunities. His intrinsic motivation to excel and make a positive impact in the field of public health is truly inspiring.\nFurthermore, Dr. Anderson’s cultural sensitivity has significantly enhanced his effectiveness as a healthcare provider. He approaches patients from diverse backgrounds with respect and understanding, ensuring that care is delivered in a manner that is both inclusive and culturally appropriate. His ability to connect with individuals from various cultural contexts has fostered a supportive and compassionate environment for both patients and colleagues.\nIn summary, Dr. Michael Anderson possesses a unique blend of problem-solving skills, organizational acumen, punctuality, motivation, and cultural sensitivity that make him an exceptional candidate for the MPH program at Johns Hopkins University. I am confident that he will bring these strengths to your program and contribute positively to your academic community.\nThank you for considering this recommendation. Please feel free to contact me at (555) 123-4567 or s.roberts@greenwoodmed.com if you require any further information.\nSincerely,\nDr. Susan Roberts\nChief Medical Officer\nGreenwood Medical Center\n123 Healthway Avenue\nBaltimore, MD 21201\n(555) 123-4567\ns.roberts@greenwoodmed.com\n",
            
        ],
        "sop": "Statement of Purpose:\nTo the Admissions Committee,\nI am excited to apply for the Master of Public Health (MPH) program at Johns Hopkins University. With a solid foundation in medicine and a passion for addressing public health challenges, I am eager to enhance my expertise and contribute to impactful solutions. My career has been distinguished by my problem-solving abilities, organizational skills, punctuality, motivation, and cultural sensitivity—qualities that I believe align well with the values of your esteemed program.\nMy journey as a physician has honed my problem-solving skills, allowing me to effectively address conThank you for considering my application. I look forward to discussing how my experiences and goals align with the mission of Johns Hopkins University.\nSincerely, Dr. Michael Anderson\nAugust 21, 2024\n\n",
        "researchProductsCount": 15,
        "specialtyCount": 0,
        "fNameCount": 1,
        "peerReviewedCount": 2,
        "abstractResearchCount": 0,
        "publishedCount": 1
    },
      {
        "name": "Samina Billo",
        "id":"11",
        "researchScore": 43.3,
        "sopScore": {
            "characteristicsInSOP": [
                "problem-solving abilities",
                "organizational skills",
                "punctuality",
                "motivation",
                "cultural sensitivity"
            ],
            "matchedCharacteristics": "5/5"
        },
        "lorScore": {
            "characteristicsInLOR": [
                "problem-solver",
                "organized",
                "punctual",
                "motivated",
                "culturally sensitive"
            ],
            "matchedCharacteristics": "5/5"
        },
        "pic": "https://t4.ftcdn.net/jpg/02/14/74/61/360_F_214746128_31JkeaP6rU0NzzzdFC4khGkmqc8noe6h.jpg",
        "dob": "2024-08-01",
        "medSchool": "Sam Bill High School and College",
        "lor": [
            "August 21, 2024\nAdmissions Committee\nJohns Hopkins University\nMaster of Public Health Program\n550 North Broadway\nBaltimore, MD 21205\nDear Members of the Admissions Committee,\nI am writing to enthusiastically recommend Dr. Michael Anderson for admission to the Master of Public Health (MPH) program at Johns Hopkins University. As Dr. Anderson’s supervisor at Greenwood Medical Center, I have had the pleasure of working closely with him for the past three years. During this time, Dr. Anderson has consistently demonstrated exceptional qualities that I believe make him an outstanding candidate for your program.\nDr. Anderson has shown remarkable problem-solving abilities throughout his tenure with us. His aptitude for diagnosing complex medical conditions and developing effective treatment plans is unparalleled. On numerous occasions, he has tackled intricate cases with a combination of analytical skill and creative thinking, resulting in improved patient outcomes and enhanced team performance. His problem-solving approach reflects both his deep understanding of medical science and his commitment to finding innovative solutions in challenging situations.\nIn addition to his problem-solving skills, Dr. Anderson is extraordinarily organized. His ability to manage multiple tasks efficiently, from patient care to administrative responsibilities, is a testament to his exceptional organizational skills. He maintains meticulous records, coordinates seamlessly with multidisciplinary teams, and ensures that all aspects of his work are completed with precision and attention to detail. This organizational prowess has been instrumental in streamlining processes and enhancing the overall efficiency of our department.\nPunctuality is another area where Dr. Anderson excels. His reliability in adhering to schedules and meeting deadlines is commendable. Whether in clinical settings or during team meetings, Dr. Anderson consistently arrives on time and is prepared to contribute meaningfully. This punctuality not only reflects his respect for others’ time but also underscores his commitment to maintaining high standards of professionalism.\nDr. Anderson’s motivation is a driving force behind his professional achievements. His dedication to advancing his knowledge, improving patient care, and contributing to public health is evident in his proactive approach to learning and development. He is always eager to take on new challenges, seek out additional training, and engage in research opportunities. His intrinsic motivation to excel and make a positive impact in the field of public health is truly inspiring.\nFurthermore, Dr. Anderson’s cultural sensitivity has significantly enhanced his effectiveness as a healthcare provider. He approaches patients from diverse backgrounds with respect and understanding, ensuring that care is delivered in a manner that is both inclusive and culturally appropriate. His ability to connect with individuals from various cultural contexts has fostered a supportive and compassionate environment for both patients and colleagues.\nIn summary, Dr. Michael Anderson possesses a unique blend of problem-solving skills, organizational acumen, punctuality, motivation, and cultural sensitivity that make him an exceptional candidate for the MPH program at Johns Hopkins University. I am confident that he will bring these strengths to your program and contribute positively to your academic community.\nThank you for considering this recommendation. Please feel free to contact me at (555) 123-4567 or s.roberts@greenwoodmed.com if you require any further information.\nSincerely,\nDr. Susan Roberts\nChief Medical Officer\nGreenwood Medical Center\n123 Healthway Avenue\nBaltimore, MD 21201\n(555) 123-4567\ns.roberts@greenwoodmed.com\n",
            
        ],
        "sop": "Statement of Purpose:\nTo the Admissions Committee,\nI am excited to apply for the Master of Public Health (MPH) program at Johns Hopkins University. With a solid foundation in medicine and a passion for addressing public health challenges, I am eager to enhance my expertise and contribute to impactful solutions. My career has been distinguished by my problem-solving abilities, organizational skills, punctuality, motivation, and cultural sensitivity—qualities that I believe align well with the values of your esteemed program.\nMy journey as a physician has honed my problem-solving skills, allowing me to effectively address conThank you for considering my application. I look forward to discussing how my experiences and goals align with the mission of Johns Hopkins University.\nSincerely, Dr. Michael Anderson\nAugust 21, 2024\n\n",
        "researchProductsCount": 15,
        "specialtyCount": 0,
        "fNameCount": 1,
        "peerReviewedCount": 2,
        "abstractResearchCount": 0,
        "publishedCount": 1
    },
      {
        "name": "Samixna Billo",
        "id":"12",
        "researchScore": 70.3,
        "sopScore": {
            "characteristicsInSOP": [
                "problem-solving abilities",
                "organizational skills",
                "punctuality",
                "motivation",
                "cultural sensitivity"
            ],
            "matchedCharacteristics": "5/5"
        },
        "lorScore": {
            "characteristicsInLOR": [
                "problem-solver",
                "organized",
                "punctual",
                "motivated",
                "culturally sensitive"
            ],
            "matchedCharacteristics": "5/5"
        },
        "pic": "https://t4.ftcdn.net/jpg/02/14/74/61/360_F_214746128_31JkeaP6rU0NzzzdFC4khGkmqc8noe6h.jpg",
        "dob": "2024-08-01",
        "medSchool": "Sam Bill High School and College",
        "lor": [
            "August 21, 2024\nAdmissions Committee\nJohns Hopkins University\nMaster of Public Health Program\n550 North Broadway\nBaltimore, MD 21205\nDear Members of the Admissions Committee,\nI am writing to enthusiastically recommend Dr. Michael Anderson for admission to the Master of Public Health (MPH) program at Johns Hopkins University. As Dr. Anderson’s supervisor at Greenwood Medical Center, I have had the pleasure of working closely with him for the past three years. During this time, Dr. Anderson has consistently demonstrated exceptional qualities that I believe make him an outstanding candidate for your program.\nDr. Anderson has shown remarkable problem-solving abilities throughout his tenure with us. His aptitude for diagnosing complex medical conditions and developing effective treatment plans is unparalleled. On numerous occasions, he has tackled intricate cases with a combination of analytical skill and creative thinking, resulting in improved patient outcomes and enhanced team performance. His problem-solving approach reflects both his deep understanding of medical science and his commitment to finding innovative solutions in challenging situations.\nIn addition to his problem-solving skills, Dr. Anderson is extraordinarily organized. His ability to manage multiple tasks efficiently, from patient care to administrative responsibilities, is a testament to his exceptional organizational skills. He maintains meticulous records, coordinates seamlessly with multidisciplinary teams, and ensures that all aspects of his work are completed with precision and attention to detail. This organizational prowess has been instrumental in streamlining processes and enhancing the overall efficiency of our department.\nPunctuality is another area where Dr. Anderson excels. His reliability in adhering to schedules and meeting deadlines is commendable. Whether in clinical settings or during team meetings, Dr. Anderson consistently arrives on time and is prepared to contribute meaningfully. This punctuality not only reflects his respect for others’ time but also underscores his commitment to maintaining high standards of professionalism.\nDr. Anderson’s motivation is a driving force behind his professional achievements. His dedication to advancing his knowledge, improving patient care, and contributing to public health is evident in his proactive approach to learning and development. He is always eager to take on new challenges, seek out additional training, and engage in research opportunities. His intrinsic motivation to excel and make a positive impact in the field of public health is truly inspiring.\nFurthermore, Dr. Anderson’s cultural sensitivity has significantly enhanced his effectiveness as a healthcare provider. He approaches patients from diverse backgrounds with respect and understanding, ensuring that care is delivered in a manner that is both inclusive and culturally appropriate. His ability to connect with individuals from various cultural contexts has fostered a supportive and compassionate environment for both patients and colleagues.\nIn summary, Dr. Michael Anderson possesses a unique blend of problem-solving skills, organizational acumen, punctuality, motivation, and cultural sensitivity that make him an exceptional candidate for the MPH program at Johns Hopkins University. I am confident that he will bring these strengths to your program and contribute positively to your academic community.\nThank you for considering this recommendation. Please feel free to contact me at (555) 123-4567 or s.roberts@greenwoodmed.com if you require any further information.\nSincerely,\nDr. Susan Roberts\nChief Medical Officer\nGreenwood Medical Center\n123 Healthway Avenue\nBaltimore, MD 21201\n(555) 123-4567\ns.roberts@greenwoodmed.com\n",
            
        ],
        "sop": "Statement of Purpose:\nTo the Admissions Committee,\nI am excited to apply for the Master of Public Health (MPH) program at Johns Hopkins University. With a solid foundation in medicine and a passion for addressing public health challenges, I am eager to enhance my expertise and contribute to impactful solutions. My career has been distinguished by my problem-solving abilities, organizational skills, punctuality, motivation, and cultural sensitivity—qualities that I believe align well with the values of your esteemed program.\nMy journey as a physician has honed my problem-solving skills, allowing me to effectively address conThank you for considering my application. I look forward to discussing how my experiences and goals align with the mission of Johns Hopkins University.\nSincerely, Dr. Michael Anderson\nAugust 21, 2024\n\n",
        "researchProductsCount": 15,
        "specialtyCount": 0,
        "fNameCount": 1,
        "peerReviewedCount": 2,
        "abstractResearchCount": 0,
        "publishedCount": 1
    },
    
])
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
              <td className={styles.mainHeader7}> <a href="#" onClick={()=>openPDFInNewTab(item,index,result)}>Report</a></td>
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
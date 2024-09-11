import OpenAI from "openai";
import { sleep } from "openai/core";
import { impactData } from "../data/ImpactFactor";
  

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_KEY,
    dangerouslyAllowBrowser: true
  });

  export const  countFirstName1 = (fName,lName,products)=>{
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

  export const terminalStates = ["cancelled", "failed", "completed", "expired"];
  export const statusCheckLoop = async (threadID, runId) => {
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

  export const  countSpecialty = async(specialty,products) =>{
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

  export const  countFirstName = async (fName,lName,products) =>{
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

  export const countPeerReviewedArticles = (products)=>{
    let count = 0;
      for(let i = 0; i<products.length ;i++){
        if(products[i].researchType==="Peer-reviewed publication"){
          count++;
        }
    }

    console.log(`for 4: : ${count}`);
    return count;
  }
  
  export const countAbstractResearch = (products)=>{
    let count = 0;
    
    for(let i = 0; i<products.length ;i++){
      if(products[i].researchType==="Abstract" || products[i].researchType==="Presentation" ){
          count++;
      }
    }

    console.log(`for 5: : ${count}`);

    return count;
  }

  export const countPublished = (products)=>{
    let count = 0;
      for(let i = 0; i<products.length ;i++){
        if(products[i].publicationStatus==="Published"){
          count++;
        }
    }

    console.log(`for 6: : ${count}`);

    return count;
  }  

  export const searchImpact = (journalName) => {
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
    
  export const countImpact = (products) => {
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

  export const  sopInfo = async (programValues,sop) =>{
    
    
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
    let user_message = `Program Values: ${programValues} \n

    Statement of Purpose: \n
    ${sop}

    Instructions:
    1. Extract top three characteristics mentioned in the Statment of Purpose.
    2. Compare these characteristics with the program values.
    3. Provide the response in the following JSON format:

    {{
      "characteristicsInSOP": [list of all three characteristics],
      "matchedCharacteristics": "number of matched characteristics/total number of program values"
    }}
    `

    
    const message = await openai.beta.threads.messages.create(
      import.meta.env.VITE_THREAD_ID_3,
      {
        role: "user",
        content: user_message
        // content: `Valued characteristics: ${programValues}\n
        //           Statement of Purpose: \n${sop} `
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

  export const  lorInfo = async (programValues,lor) =>{
    
    
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

    let user_message = `Program Values: ${programValues}

Letters of Recommendation:
${refinedLors}

Instructions:
1. Extract top five characteristics mentioned in the Letters of Recommendations.
2. Compare these characteristics with the program values.
3. Provide the response in the following JSON format:

{{
  "characteristicsInLOR": [list of top five characteristics],
  "matchedCharacteristics": "number of matched characteristics/total number of program values"
}}
`


    
    const message = await openai.beta.threads.messages.create(
      import.meta.env.VITE_THREAD_ID_4,
    {
      role: "user",
      // content: `Valued characteristics: ${programValues}\n
      //             Letter of Recommendations: \n${refinedLors} `
      content:user_message
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
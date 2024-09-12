import OpenAI from "openai";
import { sleep } from "openai/core";
import { impactData } from "../data/ImpactFactor";
import  {charList}  from "../data/charateristicsList";
  

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

    Instructions for Processing Statement of Purpose (SOP):

    I am providing you with a Statement of Purpose for a student. Please perform the following tasks:

    1. Extract Characteristics:
      - Read the Statement of Purpose in full.
      - Identify the top three characteristics described in the Statement of purpose. Match these characteristics to the provided list of 100 characteristics, ensuring that only terms from this list are used. If the Statement of purpose describes a characteristic not on the list but has a synonym on the list, use the synonym from the list.

      List of Characteristics:
      1. Compassionate
      2. Empathetic
      3. Patient
      4. Detail-oriented
      5. Dependable
      6. Adaptable
      7. Strong work ethic
      8. Team player
      9. Good communicator
      10. Resilient
      11. Critical thinker
      12. Problem-solver
      13. Organized
      14. Punctual
      15. Motivated
      16. Culturally sensitive
      17. Good listener
      18. Open-minded
      19. Professional
      20. Honest
      21. Respectful
      22. Calm under pressure
      23. Dedicated
      24. Willing to learn
      25. Self-aware
      26. Self-directed
      27. Ethical
      28. Caring
      29. Confident
      30. Strong clinical skills
      31. Good bedside manner
      32. Able to multitask
      33. Reliable
      34. Good judgment
      35. Resourceful
      36. Emotionally intelligent
      37. Physically resilient
      38. Emotionally resilient
      39. Strong interpersonal skills
      40. Adaptable to technology
      41. Knowledgeable
      42. Energetic
      43. Enthusiastic
      44. Approachable
      45. Humility
      46. Curious
      47. Efficient
      48. Proactive
      49. Good time management
      50. Flexible
      51. Positive attitude
      52. Focused
      53. Attention to detail
      54. Strong leadership skills
      55. Collaborative
      56. Good writing skills
      57. Diplomatic
      58. Good sense of humor
      59. Courageous
      60. Strong decision-maker
      61. Practical
      62. Innovative
      63. Good problem prioritization
      64. Supportive
      65. Good teaching skills
      66. Analytical
      67. Good self-care practices
      68. Self-reflective
      69. Respects patient autonomy
      70. Good at delegation
      71. Ethically-minded
      72. Understands patient confidentiality
      73. Handles criticism well
      74. Persistent
      75. Loyal
      76. Mentor-oriented
      77. Good public speaking skills
      78. Compassion for coworkers
      79. Strong commitment to patient care
      80. Values teamwork
      81. Knowledgeable about latest research
      82. Nonjudgmental
      83. Works well under supervision
      84. Adheres to protocols
      85. Good self-discipline
      86. Clear communicator
      87. Good at building rapport
      88. Intellectually curious
      89. Accountable
      90. Takes initiative
      91. Handles conflict well
      92. Good organizational skills
      93. Detail-focused in documentation
      94. Proficient in medical procedures
      95. Good hand-eye coordination
      96. Emotionally stable
      97. Good at managing stress
      98. Good at prioritizing tasks
      99. Values continuous improvement
      100. Committed to lifelong learning

    2. Match Characteristics:
      - Compare the extracted characteristics with the list of program values provided.
      - Count how many of the extracted characteristics match the program values.

    Response Format:
    Please provide your response in the following JSON format:
    {
      "characteristicsInSOP": [
        // List the top three characteristics identified in the Statement of Purpose that match the list
      ],
      "matchedCharacteristics": "number of characteristics matched/total number of program values",
      "matchedCharacteristicsProof": {
        "The matched Characteristic": "The characteristic in program value which is used to match"
      }
    }

    Example:
    If the program values are "motivated, hardworking, collaborative" and the Statement of Purpose mentions "motivated, hardworking, and creative", but "creative" is not on the list, use the synonym "innovative" from the list instead:

    {
      "characteristicsInSOP": ["motivated", "hardworking", "innovative"],
      "matchedCharacteristics": "2/3",
      "matchedCharacteristicsProof": {
        "motivated": "motivated",
        "hardworking": "hardworking"
      }
    }

    `

    const thread = await openai.beta.threads.create();

    
    const message = await openai.beta.threads.messages.create(
      // import.meta.env.VITE_THREAD_ID_3,
      thread.id,
      {
        role: "user",
        content: user_message
        // content: `Program Valued characteristics: ${programValues}\n
        //           Statement of Purpose: \n${sop} `
    })

    const run = await openai.beta.threads.runs.create(
      // import.meta.env.VITE_THREAD_ID_3,
      thread.id,
    { 
      assistant_id:import.meta.env.VITE_ASST_ID_3
    }
    );

    // const status = await statusCheckLoop(import.meta.env.VITE_THREAD_ID_3, run.id);
    const status = await statusCheckLoop(thread.id, run.id);

    const messages = await openai.beta.threads.messages.list(
      // import.meta.env.VITE_THREAD_ID_3,
      thread.id,
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

    Instructions for Processing Letter of Recommendation (LOR):

    I am providing you with a Letters of Recommendation for a student. Please perform the following tasks:

    1. Extract Characteristics:
      - Read the Letters of Recommendation in full.
      - Identify the top five characteristics described in the letters. Match these characteristics to the provided list of 100 characteristics, ensuring that only terms from this list are used. If the letter describes a characteristic not on the list but has a synonym on the list, use the synonym from the list.
      
      List of Characteristics:
      1. Compassionate
      2. Empathetic
      3. Patient
      4. Detail-oriented
      5. Dependable
      6. Adaptable
      7. Strong work ethic
      8. Team player
      9. Good communicator
      10. Resilient
      11. Critical thinker
      12. Problem-solver
      13. Organized
      14. Punctual
      15. Motivated
      16. Culturally sensitive
      17. Good listener
      18. Open-minded
      19. Professional
      20. Honest
      21. Respectful
      22. Calm under pressure
      23. Dedicated
      24. Willing to learn
      25. Self-aware
      26. Self-directed
      27. Ethical
      28. Caring
      29. Confident
      30. Strong clinical skills
      31. Good bedside manner
      32. Able to multitask
      33. Reliable
      34. Good judgment
      35. Resourceful
      36. Emotionally intelligent
      37. Physically resilient
      38. Emotionally resilient
      39. Strong interpersonal skills
      40. Adaptable to technology
      41. Knowledgeable
      42. Energetic
      43. Enthusiastic
      44. Approachable
      45. Humility
      46. Curious
      47. Efficient
      48. Proactive
      49. Good time management
      50. Flexible
      51. Positive attitude
      52. Focused
      53. Attention to detail
      54. Strong leadership skills
      55. Collaborative
      56. Good writing skills
      57. Diplomatic
      58. Good sense of humor
      59. Courageous
      60. Strong decision-maker
      61. Practical
      62. Innovative
      63. Good problem prioritization
      64. Supportive
      65. Good teaching skills
      66. Analytical
      67. Good self-care practices
      68. Self-reflective
      69. Respects patient autonomy
      70. Good at delegation
      71. Ethically-minded
      72. Understands patient confidentiality
      73. Handles criticism well
      74. Persistent
      75. Loyal
      76. Mentor-oriented
      77. Good public speaking skills
      78. Compassion for coworkers
      79. Strong commitment to patient care
      80. Values teamwork
      81. Knowledgeable about latest research
      82. Nonjudgmental
      83. Works well under supervision
      84. Adheres to protocols
      85. Good self-discipline
      86. Clear communicator
      87. Good at building rapport
      88. Intellectually curious
      89. Accountable
      90. Takes initiative
      91. Handles conflict well
      92. Good organizational skills
      93. Detail-focused in documentation
      94. Proficient in medical procedures
      95. Good hand-eye coordination
      96. Emotionally stable
      97. Good at managing stress
      98. Good at prioritizing tasks
      99. Values continuous improvement
      100. Committed to lifelong learning

    2. Match Characteristics:
      - Compare the extracted characteristics with the list of program values provided.
      - Count how many of the extracted characteristics match the program values.

    Response Format:
    Please provide your response in the following JSON format:
    {
      "characteristicsInLOR": [
        // List the top five characteristics identified in the Letter of Recommendation that match the list
      ],
      "matchedCharacteristics": "number of characteristics matched/total number of program values",
      "matchedCharacteristicsProof": {
        "The matched Characteristic": "The characteristic in program value which is used to match"
      }
    }


    Example:
    If the program values are "motivated, hardworking, collaborative" and the Letter of Recommendation mentions "motivated, hardworking,  creative, Efficient, Physically resilient", but "creative" is not on the list, use the synonym "innovative" from the list instead:

    {
      "characteristicsInLOR": ["motivated", "hardworking", "innovative,Efficient,Physically resilient"],
      "matchedCharacteristics": "2/3",
      "matchedCharacteristicsProof": {
        "motivated": "motivated",
        "hardworking": "hardworking"
      }
    }

    `
    const thread = await openai.beta.threads.create();


    
    const message = await openai.beta.threads.messages.create(
      // import.meta.env.VITE_THREAD_ID_4,
      thread.id,
    {
      role: "user",
      // content: `Valued characteristics: ${programValues}\n
      //             Letter of Recommendations: \n${refinedLors} `
      content:user_message
    })

    const run = await openai.beta.threads.runs.create(
      // import.meta.env.VITE_THREAD_ID_4,
      thread.id,
    { 
      assistant_id:import.meta.env.VITE_ASST_ID_4
    }
    );

    // const status = await statusCheckLoop(import.meta.env.VITE_THREAD_ID_4, run.id);
    const status = await statusCheckLoop(thread.id, run.id);

    const messages = await openai.beta.threads.messages.list(
      // import.meta.env.VITE_THREAD_ID_4,
      thread.id,
    );
    let response = messages.data[0].content[0].text.value;

    return JSON.parse(response);
  }
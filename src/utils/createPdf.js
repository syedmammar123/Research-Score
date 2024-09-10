
import jsPDF from 'jspdf';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);


export const createPdf = (item, index, result) => {
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

  let a=0


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
    const step = 0.1; // Step size for generating values
    // const range = Array.from({ length: (maxScore - minScore) / step + 1 }, (_, i) => (minScore + i * step));
    const range = Array.from({ length: (maxScore - minScore) / step + 1 }, (_, i) => 
    parseFloat((minScore + i * step).toFixed(1))
  );
  


    const bellCurveData = range.map(score => normalDistribution(score, mean, stdDev));

    // Find the selected student's score
    const selectedStudent = result.find(student => student.id === id);
    const selectedScore = selectedStudent ? selectedStudent.researchScore : null;

    // Create the chart
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: range.map((item)=>item.toFixed(1)), // Use the extended range for labels (x-axis)
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
            data: range.map(score => score === Number(selectedScore.toFixed(1)) ? normalDistribution(score, mean, stdDev) : null),
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: function(context) {
              const { dataIndex } = context;
              console.log(range[dataIndex],selectedScore)
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
    const generateAndOpenPDF = async () => {


      // Title of the Report
      doc.setFontSize(22);
      doc.setFont("Times", "bold");
      // doc.setFont("Helvetica", "bold");
      doc.text("Basic Information", 10, 15);

      // Name
      doc.setFontSize(12);
      doc.setFont("Times", "bold");
      doc.text(`Name: ${item.name}`, 10, 30);

      // Helper function to convert image to base64
      function toBase64Image(url) {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'Anonymous';  // Ensure CORS is handled
          img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/png');
            resolve(dataURL);
          };
          img.onerror = reject;
          img.src = url;
        });
      }
    try {

      // // Picture
      const imgUrl = item.pic;
      // const img = new Image();
      // img.src = imgUrl;
      // img.onload = function () {
          const base64Img = await toBase64Image(imgUrl);

          doc.addImage(base64Img, 'PNG', 140, 5, 40, 40);
          // doc.addImage(img, 'JPEG', 140, 5, 50, 40);

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
              let fallBacksopYy = 125;
              let fallBacksopYy2 = 125;
              item.sopScore.characteristicsInSOP.forEach((char, index) => {
                if(index+1<=12){
                  doc.text(`${index + 1}. ${char}`, 20, sopYy);
                  sopYy += 5;
                }else if(index+1<=24){
                    doc.text(`${index + 1}. ${char}`, 80, fallBacksopYy);
                    fallBacksopYy+=5
                }else{
                    doc.text(`${index + 1}. ${char}`, 130, fallBacksopYy2);
                    fallBacksopYy2+=5
                }               
              });

              doc.setFont("Times","bold")
              doc.text(`Number matching your program’s valued characteristics: ${item.sopScore.matchedCharacteristics} (Mean = ${(result.reduce((acc,curr)=>acc+Number(curr.sopScore.matchedCharacteristics[0]),0)/result.length).toFixed(1)})`, 20, sopYy +5);
              
              doc.setFontSize(22)
              doc.setFont("Times", "bold");
              doc.text("Characteristics Identified in Letters of Recommendation", 10, sopYy + 20);
              doc.setFontSize(12)
              doc.setFont("Times", "normal");
              
              sopYy = sopYy + 30;
              fallBacksopYy = sopYy
              fallBacksopYy2 = fallBacksopYy
              item.lorScore.characteristicsInLOR.forEach((char, index) => {
                if(index+1<=12){
                  doc.text(`${index + 1}. ${char}`, 20, sopYy);
                  sopYy += 5;
                }else if(index+1<=24){
                    doc.text(`${index + 1}. ${char}`, 80, fallBacksopYy);
                    fallBacksopYy+=5
                }else{
                    doc.text(`${index + 1}. ${char}`, 130, fallBacksopYy2);
                    fallBacksopYy2+=5
                }
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
              
              // doc.text("Top characteristics identified in this letter: ", 10, sopY);
              // doc.setFont("Times", "normal");
              // doc.setFontSize(10);
              // sopY += 10;
              // item.sopScore.characteristicsInSOP.forEach((char, index) => {
              //     if (index < 3) {
              //         doc.setFont("Times", "normal");
              //     } else {
              //         doc.setFont("Times", "normal");
              //     }
              //     if (sopY >= pageHeight) {
              //         doc.addPage();
              //         sopY = 10;
              //     }
              //     doc.text(`${index + 1}. ${char}`, 20, sopY);
              //     sopY += 5;
              // });
              // doc.save(`${item.name} Report.pdf`);
              
              // Generate the PDF and open it in a new tab
               const pdfBlob = doc.output('blob'); 
                const url = URL.createObjectURL(pdfBlob); // Create blob URL

                // Create a new anchor element programmatically
                const link = document.createElement('a');
                link.href = url;
                link.target = '_blank';  // Open in a new tab

                // iOS specific hack: Append the link to the DOM for iOS Safari compatibility
                document.body.appendChild(link);

                link.click();  // Simulate a user click to trigger window.open or download

                // Clean up by removing the anchor element after triggering the download/view
                document.body.removeChild(link);
              // const pdfBlob = doc.output('blob');
              // const url = URL.createObjectURL(pdfBlob);
              // window.open(url, '_blank');   
        
          }, 1000); 
        }catch(error){
              console.error("Error loading image:", error);
        }
          // Adjust timeout as needed for chart rendering
      // };

    };


    generateAndOpenPDF()
  }
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import Result from "../Result/Result";
import styles from './ResearchProduct.module.css';
import {auth, db} from '../../firebase'
import {  doc, setDoc, updateDoc,arrayUnion,getDoc,collection, query, where,getDocs, arrayRemove, FieldValue  } from "firebase/firestore";
import { Tooltip } from 'react-tooltip'





const ProductInfo = ({userData,ratings}) => {

    const [fName, setFName] = useState("");
    const [lName, setLName] = useState("");
    const [title, setTitle] = useState("");
    const [authorList, setAuthorList] = useState("");
    const [researchType, setResearchType] = useState("");
    const [publicationStatus, setPublicationStatus] = useState("");
    const [publicationName, setPublicationName] = useState("");
    const [prod, setProd] = useState([]);
    const [prodNo, setProdNo] = useState(1);
    const [dataa, setDataa] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showForm,setShowForm] = useState(true)
    const [previousData, setPreviousData] = useState([]);
    const [viewData, setViewData] = useState(false);
    const [dataToView, setDataToView] = useState([]);      

    const getPreviousData = async (email) => {
            try {
                const q = query(collection(db, 'researchProducts'),where('__name__', '==', email));
                
                const querySnapshot = await getDocs(q);
                
                const data = [];
                querySnapshot.forEach((doc) => {
                    data.push({  ...doc.data().savedData });
                });
                return data;
            } catch (error) {
                console.error('Error getting data by email: ', error);
                return [];
            }
    };

    const fetchData = async () => {
            const newData = await getPreviousData(auth.currentUser?.email);
            // const newData = await getPreviousData('a@e.com');
            setPreviousData(newData)
    };

    useEffect(()=>{
        fetchData();
    },[])

    const handleModal = ()=>{
        setShowModal(!showModal)
    }

    const handleHistory = ()=>{
        // fetchData()
        setShowHistoryModal(!showHistoryModal)
    }

    const handleReuse = (item)=>{
        setDataa(prevData => [...prevData, ...item]);
        setShowHistoryModal(!showHistoryModal)

    }

    const handleView = (item)=>{
        setDataToView(item)
        setViewData(!viewData)

    }

    const handleDelete = async (itemIndex) => {
        try {
            const documentRef = doc(db, 'researchProducts',auth.currentUser?.email);
            const snapshot = await getDoc(documentRef);
            const documentData = snapshot.data();


            // Construct a new array without the item to remove
            const newData = documentData.savedData.filter((item, index) => index !== itemIndex);

            // Update the document with the new array
            await updateDoc(documentRef, {
                savedData: newData
            });

            fetchData();
        
        } catch (error) {
            console.error('Error deleting item from savedData array: ', error);
        }
    };

    const resetProductFields = () => {
        setTitle("");
        setAuthorList("");
        setResearchType("");
        setPublicationStatus("");
        setPublicationName("");
    };

    const addResearchProduct =  () => {
        if (!fName || !lName || !title || !authorList || !researchType || !publicationName ) {
            alert("You must fill all fields.");
            return 0;
        }

        if (researchType =="Peer-reviewed publication" && !publicationStatus ) {
            alert("Please enter publication status.");
            return 0;
        }

        const authorRegex = /^[A-Za-z.]+(?:\s+[A-Za-z.]+)*(?:\s*;\s*[A-Za-z.]+(?:\s+[A-Za-z.]+)*)*(?:\s*;)?$/;


        if (!authorRegex.test(authorList.trim())) {
            alert("Input format should be author1; author2; ...");
            return; 
        }

        // Proceed with parsing the valid authors
        // const authors = authorList.split(';').map(author => {
        //     const [firstName, lastName] = author.trim().split(',');
        //     return { firstName, lastName };
        // }).filter(author => author.firstName !== '');

        const authors = authorList.split(';').map(author => {
            return author.trim(); 
        }).filter(author => author !== '')        

        const finalPublicationStatus = publicationStatus || '-';

        setProd(prevProd => [...prevProd, { title, authors, researchType, publicationStatus:finalPublicationStatus, publicationName }]);
        setProdNo(prevProdNo => prevProdNo + 1);
        resetProductFields();
    };

    const addStudent =   () => {
        if (!fName || !lName) {
            alert("Enter first and last name for the student.");
            return;
        }

        if (prod.length === 0 ) {
            alert("Please add at least one research product for the student.");
            return;
        }

        if(title || authorList  || publicationName){
            alert("Please submit product details or clear product info fields before adding a new student.")
            return
        }

        if(publicationStatus || researchType){
            setPublicationStatus("")
            setResearchType("")
        }

        setDataa(prevDataa => [
            ...prevDataa,
            { fName, lName, researchProducts: [...prod] }
        ]);


     
        const item = { fName, lName, researchProducts: [...prod] }

        handleSaveData(item)

        setProdNo(1);
        setProd([]);
        setFName("");
        setLName("");
        resetProductFields();

    };

    const handleSaveData = async(item) => {
        
        const currentDate = new Date();

        const researchData = {
            dataa:[item],
            timestamp:currentDate
        };


        try {
             
        // Reference to the document for the current user
        const userDocRef = doc(db, 'researchProducts', auth.currentUser?.email);

      
        // Check if the document exists
        const docSnap = await getDoc(userDocRef);

        if(docSnap.exists()){
            await updateDoc(userDocRef,{
                savedData: arrayUnion(researchData)
            })
        }else {
            // If the document doesn't exist, create it and set the form data
            await setDoc(userDocRef, { savedData: [researchData] });
        }
        
        // setShowForm(false);

    } catch (error) {
        console.error('Error saving form data: ', error);
    }
    };

    const handleSaveDataSession = async() => {
        
        const currentDate = new Date();

        const researchData = {
            dataa,
            timestamp:currentDate
        };


        try {
             
        // Reference to the document for the current user
        const userDocRef = doc(db, 'researchProducts', auth.currentUser?.email);

      
        // Check if the document exists
        const docSnap = await getDoc(userDocRef);

        if(docSnap.exists()){
            await updateDoc(userDocRef,{
                savedData: arrayUnion(researchData)
            })
        }else {
            // If the document doesn't exist, create it and set the form data
            await setDoc(userDocRef, { savedData: [researchData] });
        }
        
        setShowForm(false);

    } catch (error) {
        console.error('Error saving form data: ', error);
    }
    };

    const calculateScore =  () => {
        if (dataa.length === 0) {
            alert("You must add at least one student's data to calculate the score.");
            return;
        }

        if(fName || lName || title || authorList || publicationName){
            alert("Please submit the details or clear the fields before trying to calculate result.")
            return
        }

        // handleSaveDataSession()

        setShowForm(false) //this should be commented if storing a session.
    };

    const handleFileUpload = (e) => {
        //this function will be implemented later!
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const fileData = XLSX.utils.sheet_to_json(ws, { header: 1 });

            const formattedData = [];

            for (let i = 1; i < fileData.length; i++) {
                const row = fileData[i];
                const studentData = {
                    fName: row[0],
                    lName: row[1],
                    researchProducts: []
                };

                for (let j = 2; j < row.length; j += 6) {
                    const product = {
                        title: row[j],
                        authors: [{ lastName: row[j + 1], initials: "" }],
                        researchType: row[j + 2],
                        publicationStatus: row[j + 3] || "Accepted",
                        publicationName: row[j + 4]
                    };
                    studentData.researchProducts.push(product);
                }

                formattedData.push(studentData);
            }

            setDataa(formattedData);
        };

        reader.readAsBinaryString(file);
    };

    return (
        <>
        {showForm?(
            <>
            <div className={styles.container}>
                 <div className={styles.headerButtons}>
                    <button disabled onClick={() => document.getElementById('fileInput').click()}>Upload File</button>
                    <input id="fileInput" style={{display: 'none'}} type="file" accept=".xlsx" onChange={handleFileUpload} />
                    <div className={styles.historyBtnDiv}>
                    {/* <button onClick={handleModal}>View Data</button> */}
                    <button onClick={handleModal} className={styles.historyBtn}
                    data-tooltip-id="viewToolTip" data-tooltip-content="View Data"
                    >
                         <img src="./viewIcon.svg" alt="" />
                    </button>
                    <button onClick={handleHistory} className={styles.historyBtn}
                    data-tooltip-id="historyToolTip" data-tooltip-content="View History"

                    >
                        <img src="./historyIcon.svg" alt="" />
                    </button>
                    <Tooltip id="viewToolTip" />
                    <Tooltip id="historyToolTip" />

                    </div>
                </div>
               
                <div className={styles.inputContainer}>
                    <span>Student <b>{dataa.length + 1}</b> :</span>
                    <div className={styles.flName}>
                        <input type="text" placeholder='First Name'
                        value={fName}
                        onChange={(e) => setFName(e.target.value)} />
                        <input type="text" placeholder='Last Name'
                        value={lName}
                        onChange={(e) => setLName(e.target.value)} />

                    </div>
                    
                    <div className={styles.prodNoDiv}>
                        <span>Research Product <b>{prodNo}</b> :</span>
                        <button className={styles.addButton} onClick={addResearchProduct}>Add  Product</button>
                    </div>
                    
                    <div >
                        <div className={styles.inputDiv}>
                        <input type="text" placeholder='Title'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)} />
                        <input type="text" placeholder='Author List (First Author; Second Author; ... ;)'
                            value={authorList}
                            onChange={(e) => setAuthorList(e.target.value)} />
                        </div>

                        <label htmlFor="Type of Research"></label>
                        <div className={styles.inputDiv}>
                        <select  id="Type of Research" value={researchType} onChange={(e) => setResearchType(e.target.value)}>
                            <option value="">Type of Research:</option>
                            <option value="Peer-reviewed publication">Peer-reviewed publication</option>
                            <option value="Non-peer reviewed publication">Non-peer reviewed publication</option>
                            <option value="Abstract">Abstract</option>
                            <option value="Presentation">Presentation</option>
                        </select>

                        </div>

                        <label htmlFor="publicationStatus"></label>
                        <div className={styles.inputDiv}>
                        <select id="publicationStatus" value={publicationStatus} onChange={(e) => setPublicationStatus(e.target.value)}>
                            <option value="">Publication Status:</option>
                            <option value="Published">Published</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Submitted">Submitted</option>
                        </select>
                        </div>

                        <div className={styles.inputDiv}>
                        <input type="text"
                        placeholder='Journal/Publication/Event Name' value={publicationName}
                        onChange={(e) => setPublicationName(e.target.value)} />
                        </div>
                    </div>
                </div>
               
                <div className={styles.buttonsContainer}>
                    <button className={styles.addButton} onClick={addStudent}>Add Student</button> 
                </div>
                
                <div className={styles.calBtn}>
                    <button className={styles.button} onClick={calculateScore} >Calculate Score</button>
                </div>
            </div>

            {/* Modal for view data */}
            <div className={styles.modal} style={{display:  `${showModal? "block":"none"}`}}>
                <div className={styles.modalBody}>
                    <div>
                        <span onClick={handleModal} className={styles.close}>&times;</span>
                    </div>
                    {dataa.length>0 ?(
                    <div>
                    {dataa.map((user, index) => (
                        <div key={index}>
                        <h2>{index+1}. {`${user.fName} ${user.lName}`}</h2>
                        <div>
                            {user.researchProducts.map((product, productIndex) => (
                            <div key={productIndex}>
                                <h3>{product.title}</h3>
                                <p><strong>Research Type:</strong> {product.researchType}</p>
                                <p><strong>Publication Status:</strong> {product.publicationStatus}</p>
                                <p><strong>Publication Name:</strong> {product.publicationName}</p>
                                <p><strong>Authors:</strong> {product.authors.map((author, authorIndex) => (
                                <span key={authorIndex}>
                                    {author}
                                    {authorIndex !== product.authors.length - 1 && ", "}

                                </span>
                                ))}</p>
                            </div>
                            ))}
                        </div>
                        </div>
                    ))}
                    </div>)
                    :(
                    <div style={{textAlign:"center"}}>
                        <h3>No Data to display!</h3>
                    </div>
                    )}

                </div>
            </div>

            {/* Modal for history */}
            <div className={styles.modal} style={{display:  `${showHistoryModal? "block":"none"}`}}>
                <div className={styles.modalBody}>
                    <div>
                        <span onClick={handleHistory} className={styles.close}>&times;</span>
                    </div>
                    {previousData.length>0 ?(
                    <>
                    {!viewData?(
                        <div>
                            <div>
                                <div>
                                    <h3 >Previous Student's Data </h3>
                                </div>

                                <hr style={{color:"#754B9C"}} />
                            <div>
                                <table className={styles.table}>
                                <thead>
                                    <tr>
                                    <th >No.</th>
                                    <th >Student Names </th>
                                    <th >Date</th>
                                    <th >Actions</th>
                                    <th ></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previousData.map((studentSet, index)=>(
                                        Object.values(studentSet).map((student, idx)=>(
                                             <tr key={idx}>
                                                <td>{idx + 1}</td>
                                                <td>
                                                    <div className={styles.studentNames}>
                                                        {student.dataa.length<2?(
                                                        <>
                                                        {student.dataa[0].fName} {student.dataa[0].lName}
                                                        
                                                        </>):(
                                                        <select>
                                                            {student.dataa.map((std1,indx)=>(
                                                                <option key={indx}
                                                                 >{std1.fName} {std1.lName}</option>
                                                            ))}
                                                        </select>
                                                        )}
                                                      
                                                    </div>
                                                </td>
                                                <td>{new Date(student.timestamp.seconds * 1000).toLocaleString()}</td>
                                                 <td>
                                                    <div className={styles.actionBtns}>
                                                        <span style={{ backgroundColor: "#00cf61" }}
                                                        onClick={()=>handleReuse(student.dataa)}
                                                        >Reuse</span>
                                                        <span style={{ backgroundColor: "#250096", color: "white" }}
                                                        onClick={()=>handleView(student.dataa)}
                                                        >View</span>
                                                        <span onClick={() => handleDelete(idx)}>Delete</span>
                                                    </div>
                                                </td>
                                             </tr>
                                        ))
                                    ))
                                    }
                                </tbody>
                                </table>
                            </div>
                            </div>
                        </div>
                    ):(
                        <>
                         <div>
                            <button onClick={()=>setViewData(false)} style={{backgroundColor:'transparent',border:"none",cursor:"pointer"}}>
                                <img src="./backIcon.svg" alt="" />
                            </button>
                        </div>
                            <hr style={{color:"#754B9C"}} />
                            {dataToView.map((user, index) => (
                            <div key={index}>
                            <h2>{index+1}. {`${user.fName} ${user.lName}`}</h2>
                            <div>
                                {user.researchProducts.map((product, productIndex) => (
                                <div key={productIndex}>
                                    <h3>{product.title}</h3>
                                    <p><strong>Research Type:</strong> {product.researchType}</p>
                                    <p><strong>Publication Status:</strong> {product.publicationStatus}</p>
                                    <p><strong>Publication Name:</strong> {product.publicationName}</p>
                                    <p><strong>Authors:</strong> {product.authors.map((author, authorIndex) => (
                                    <span key={authorIndex}>
                                        {author}
                                        {authorIndex !== product.authors.length - 1 && ", "}
                                    </span>
                                    ))}</p>
                                </div>
                                ))}
                            </div>
                            </div>
                        
                        ))}
                        </>
                        
                    )}
                      
                    
                    </>)
                    :(
                    <div style={{textAlign:"center"}}>
                        <h3>No history found!</h3>
                        
                    </div>
                    )}

                </div>
            </div>

            </>
            ):
            <>
                <Result userData={userData} rating={ratings} stdData={dataa} />
            </>}
        </>
    );
};

export default ProductInfo;



// {
//     "dataa": [
//         {
//             "lName": "Morgan",
//             "fName": "Taylor",
//             "researchProducts": [
//                 {
//                     "publicationName": "Journal of Neurosurgical Techniques",
//                     "publicationStatus": "Published",
//                     "title": "Innovations in Minimally Invasive Techniques for Brain Tumor Removal",
//                     "researchType": "Peer-reviewed publication",
//                     "authors": [
//                         {
//                             "initials": "T",
//                             "lastName": "Morgan"
//                         },
//                         {
//                             "initials": "E",
//                             "lastName": "Zhang"
//                         },
//                         {
//                             "initials": "M",
//                             "lastName": "Antonius"
//                         }
//                     ]
//                 },
//                 {
//                     "authors": [
//                         {
//                             "initials": "A",
//                             "lastName": "Turing"
//                         },
//                         {
//                             "initials": "T",
//                             "lastName": "Morgan"
//                         }
//                     ],
//                     "publicationStatus": "Published",
//                     "title": "Neuroprotective Strategies in Acute Ischemic Stroke: A Comprehensive Review",
//                     "researchType": "Peer-reviewed publication",
//                     "publicationName": "Stroke Research and Therapy"
//                 },
//                 {
//                     "publicationName": "Innovations in Spinal Surgery and Rehabilitation",
//                     "authors": [
//                         {
//                             "initials": "T",
//                             "lastName": "Morgan"
//                         },
//                         {
//                             "lastName": "Connor",
//                             "initials": "S"
//                         }
//                     ],
//                     "publicationStatus": "Accepted",
//                     "title": "The Role of AI in Predicting Outcomes After Spinal Cord Injury",
//                     "researchType": "Non-peer reviewed publication"
//                 },
//                 {
//                     "title": "3D Printing of Customized Cranial Implants: Future Directions",
//                     "authors": [
//                         {
//                             "initials": "T",
//                             "lastName": "Morgan"
//                         },
//                         {
//                             "initials": "L",
//                             "lastName": "Da Vinci"
//                         },
//                         {
//                             "lastName": "Smith",
//                             "initials": "J"
//                         }
//                     ],
//                     "publicationName": "International Symposium on Biomedical Engineering",
//                     "researchType": "Presentation",
//                     "publicationStatus": "Accepted"
//                 },
//                 {
//                     "title": "Efficacy of Virtual Reality Training for Neurosurgical Residents",
//                     "authors": [
//                         {
//                             "lastName": "Tesla",
//                             "initials": "N"
//                         },
//                         {
//                             "initials": "T",
//                             "lastName": "Morgan"
//                         }
//                     ],
//                     "researchType": "Peer-reviewed publication",
//                     "publicationName": "Education in Neurosurgery",
//                     "publicationStatus": "Submitted"
//                 },
//                 {
//                     "authors": [
//                         {
//                             "initials": "T",
//                             "lastName": "Morgan"
//                         },
//                         {
//                             "lastName": "Curie",
//                             "initials": "M"
//                         },
//                         {
//                             "initials": "A",
//                             "lastName": "Einstein"
//                         }
//                     ],
//                     "researchType": "Abstract",
//                     "publicationName": "Neurotrauma Conference",
//                     "publicationStatus": "Submitted",
//                     "title": "Mechanisms of Neural Regeneration After Traumatic Brain Injury"
//                 },
//                 {
//                     "title": "Comparative Analysis of Endoscopic vs. Microscopic Transsphenoidal Pituitary Surgery",
//                     "authors": [
//                         {
//                             "initials": "T",
//                             "lastName": "Morgan"
//                         },
//                         {
//                             "lastName": "Newton",
//                             "initials": "I"
//                         }
//                     ],
//                     "publicationName": "Journal of Pituitary Research",
//                     "publicationStatus": "Accepted",
//                     "researchType": "Peer-reviewed publication"
//                 },
//                 {
//                     "researchType": "Peer-reviewed publication",
//                     "title": "The Impact of Socioeconomic Status on Outcomes in Pediatric Epilepsy Surgery",
//                     "authors": [
//                         {
//                             "lastName": "Morgan",
//                             "initials": "T"
//                         },
//                         {
//                             "initials": "C",
//                             "lastName": "Darwin"
//                         },
//                         {
//                             "lastName": "Mendel",
//                             "initials": "G"
//                         }
//                     ],
//                     "publicationName": "Pediatric Neurosurgery",
//                     "publicationStatus": "Published"
//                 },
//                 {
//                     "publicationStatus": "Published",
//                     "researchType": "Presentation",
//                     "title": "Development of a New Intracranial Pressure Monitoring Device",
//                     "publicationName": "World Congress on Neurotechnology",
//                     "authors": [
//                         {
//                             "initials": "T",
//                             "lastName": "Morgan"
//                         },
//                         {
//                             "lastName": "Bell",
//                             "initials": "A"
//                         },
//                         {
//                             "lastName": "Edison",
//                             "initials": "T"
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             "researchProducts": [
//                 {
//                     "title": "Evaluating the Accuracy of MRI in Diagnosing Early Stage Osteoarthritis",
//                     "publicationName": "Journal of Musculoskeletal Imaging",
//                     "researchType": "Peer-reviewed publication",
//                     "authors": [
//                         {
//                             "lastName": "Rivera",
//                             "initials": "J"
//                         },
//                         {
//                             "initials": "S",
//                             "lastName": "Choi"
//                         },
//                         {
//                             "lastName": "Patel",
//                             "initials": "A"
//                         }
//                     ],
//                     "publicationStatus": "Published"
//                 },
//                 {
//                     "researchType": "Peer-reviewed publication",
//                     "title": "Machine Learning Algorithms for Predicting Malignancy in Lung Nodule CT Scans",
//                     "authors": [
//                         {
//                             "lastName": "Ford",
//                             "initials": "H"
//                         },
//                         {
//                             "lastName": "Rivera",
//                             "initials": "J"
//                         }
//                     ],
//                     "publicationName": "Radiology and Artificial Intelligence",
//                     "publicationStatus": "Accepted"
//                 },
//                 {
//                     "publicationStatus": "Accepted",
//                     "publicationName": "International Thyroid Congress",
//                     "researchType": "Presentation",
//                     "authors": [
//                         {
//                             "lastName": "Rivera",
//                             "initials": "J"
//                         },
//                         {
//                             "initials": "E",
//                             "lastName": "Blackwell"
//                         }
//                     ],
//                     "title": "The Role of Ultrasound in Managing Thyroid Disorders"
//                 },
//                 {
//                     "publicationStatus": "Submitted",
//                     "publicationName": "Journal of Cardiovascular Medicine",
//                     "authors": [
//                         {
//                             "initials": "J",
//                             "lastName": "Rivera"
//                         },
//                         {
//                             "initials": "M",
//                             "lastName": "Phelps"
//                         },
//                         {
//                             "initials": "S",
//                             "lastName": "Williams"
//                         }
//                     ],
//                     "title": "Impact of Regular Exercise on Cardiovascular Health: A Systematic Review",
//                     "researchType": "Peer-reviewed publication"
//                 },
//                 {
//                     "title": "Advancements in PET Imaging for Early Detection of Alzheimer’s Disease",
//                     "publicationStatus": "Published",
//                     "publicationName": "Innovations in Neuroimaging",
//                     "researchType": "Non-peer reviewed publication",
//                     "authors": [
//                         {
//                             "lastName": "Alzheimer",
//                             "initials": "A"
//                         },
//                         {
//                             "lastName": "Rivera",
//                             "initials": "J"
//                         }
//                     ]
//                 },
//                 {
//                     "publicationName": "Annual Meeting of the Radiological Society",
//                     "authors": [
//                         {
//                             "initials": "J",
//                             "lastName": "Rivera"
//                         },
//                         {
//                             "initials": "M",
//                             "lastName": "Curie"
//                         },
//                         {
//                             "initials": "R",
//                             "lastName": "Franklin"
//                         }
//                     ],
//                     "researchType": "Abstract",
//                     "title": "A Comparative Study of Digital vs. Film Mammography in Breast Cancer Screening",
//                     "publicationStatus": "Submitted"
//                 }
//             ],
//             "fName": "Jamie",
//             "lName": "Rivera"
//         },
//         {
//             "researchProducts": [
//                 {
//                     "authors": [
//                         {
//                             "lastName": "Kim",
//                             "initials": "C"
//                         },
//                         {
//                             "initials": "L",
//                             "lastName": "Hernandez"
//                         },
//                         {
//                             "lastName": "Ali",
//                             "initials": "M"
//                         }
//                     ],
//                     "researchType": "Peer-reviewed publication",
//                     "title": "Vaccine Efficacy in Preventing Viral Infections in School-Aged Children: A Meta-Analysis",
//                     "publicationStatus": "Published",
//                     "publicationName": "Journal of Pediatric Infectious Diseases"
//                 },
//                 {
//                     "authors": [
//                         {
//                             "lastName": "Yu",
//                             "initials": "R"
//                         },
//                         {
//                             "lastName": "Kim",
//                             "initials": "C"
//                         }
//                     ],
//                     "researchType": "Peer-reviewed publication",
//                     "title": "Impact of Screen Time on Sleep Patterns in Adolescents",
//                     "publicationStatus": "Accepted",
//                     "publicationName": "Pediatric Sleep Medicine"
//                 },
//                 {
//                     "publicationStatus": "Accepted",
//                     "authors": [
//                         {
//                             "lastName": "Kim",
//                             "initials": "C"
//                         },
//                         {
//                             "initials": "A",
//                             "lastName": "Patel"
//                         }
//                     ],
//                     "title": "Nutritional Deficiencies and Developmental Delays in Early Childhood: A Systematic Review",
//                     "researchType": "Presentation",
//                     "publicationName": "International Conference on Child Nutrition and Development"
//                 },
//                 {
//                     "researchType": "Abstract",
//                     "publicationStatus": "Submitted",
//                     "authors": [
//                         {
//                             "initials": "C",
//                             "lastName": "Kim"
//                         },
//                         {
//                             "initials": "S",
//                             "lastName": "Lee"
//                         },
//                         {
//                             "lastName": "Kim",
//                             "initials": "J"
//                         }
//                     ],
//                     "publicationName": "World Congress on Pediatric Psychology",
//                     "title": "Exploring the Psychological Impact of Pediatric Chronic Illnesses on Families"
//                 }
//             ],
//             "fName": "Casey",
//             "lName": "Kim"
//         },
//         {
//             "researchProducts": [
//                 {
//                     "title": "The Efficacy of New Anticoagulants in the Management of Atrial Fibrillation",
//                     "researchType": "Peer-reviewed publication",
//                     "publicationStatus": "Published",
//                     "authors": [
//                         {
//                             "initials": "A",
//                             "lastName": "Parker"
//                         },
//                         {
//                             "lastName": "Singh",
//                             "initials": "H"
//                         },
//                         {
//                             "initials": "E",
//                             "lastName": "Rodriguez"
//                         }
//                     ],
//                     "publicationName": "Journal of Cardiovascular Pharmacology"
//                 },
//                 {
//                     "publicationName": "Internal Medicine Insights",
//                     "researchType": "Peer-reviewed publication",
//                     "title": "Assessing the Impact of Lifestyle Modifications on Hypertension Control: A Cohort Study",
//                     "authors": [
//                         {
//                             "initials": "M",
//                             "lastName": "Johnson"
//                         },
//                         {
//                             "initials": "A",
//                             "lastName": "Parker"
//                         }
//                     ],
//                     "publicationStatus": "Accepted"
//                 }
//             ],
//             "lName": "Parker",
//             "fName": "Alex"
//         }
//     ],
//     "timestamp": {
//         "seconds": 1709479782,
//         "nanoseconds": 702000000
//     }
// }
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
        
            console.log("done");
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



        // const authors = authorList.split(';').map(author => {
        //     const [lastName, ...initials] = author.trim().split(','); 
        //     const formattedInitials = initials.map(initial => initial.trim().toUpperCase()).join(', ');

        //     return { lastName: lastName.trim(), initials: formattedInitials };
        // });

         

        const authorRegex = /^[A-Za-z]+,[A-Za-z]+;([A-Za-z]+,[A-Za-z]+;)*$/;
        
        if (!authorRegex.test(authorList.trim())) {
            alert("Input format should be firstName,lastName;firstName,lastName;...");
            return; 
        }

        // Proceed with parsing the valid authors
        const authors = authorList.split(';').map(author => {
            const [firstName, lastName] = author.trim().split(',');
            return { firstName, lastName };
        }).filter(author => author.firstName !== '');
        
        

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

        setProdNo(1);
        setProd([]);
        setFName("");
        setLName("");
        resetProductFields();
        


    };

    const handleSaveData = async() => {
        
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

        handleSaveData()

        // setShowForm(false)
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
                        <input type="text" placeholder='Author List (First Name, Last Name;)'
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
                                <span key={authorIndex}>{author.lastName} {author.initials},</span>
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
                                                        <select>
                                                            {student.dataa.map((std1,indx)=>(
                                                                <option key={indx}
                                                                 >{std1.fName} {std1.lName}</option>
                                                            ))}
                                                        </select>
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
                                    <span key={authorIndex}>{author.lastName} {author.initials},</span>
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
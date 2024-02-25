import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Result from "../Result/Result";
import styles from './ResearchProduct.module.css';

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
    const [showForm,setShowForm] = useState(true)

    const handleModal = ()=>{
        setShowModal(!showModal)
    }

    const resetProductFields = () => {
        setTitle("");
        setAuthorList("");
        setResearchType("");
        setPublicationStatus("");
        setPublicationName("");
    };

    const addResearchProduct =  () => {
        if (!fName || !lName || !title || !authorList || !researchType || !publicationName || !publicationStatus) {
            alert("You must fill all fields.");
            return 0;
        }

        const authors = authorList.split(';').map(author => {
            const [lastName, ...initials] = author.trim().split(','); 
            const formattedInitials = initials.map(initial => initial.trim().toUpperCase()).join(', ');

            return { lastName: lastName.trim(), initials: formattedInitials };
        });

        setProd(prevProd => [...prevProd, { title, authors, researchType, publicationStatus, publicationName }]);
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

    const calculateScore = () => {
        if (dataa.length === 0) {
            alert("You must add at least one student's data to calculate the score.");
            return;
        }

        if(fName || lName || title || authorList || publicationName){
            alert("Please submit the details or clear the fields before trying to calculate result.")
            return
        }

        setShowForm(false)
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
                    <button onClick={handleModal}>View Data</button>
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
                        <input type="text" placeholder='Author List (Last Name, First Initial, Middle Initial);'
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

            <div className={styles.modal} style={{display:  `${showModal? "block":"none"}`}}>
                <div className={styles.modalBody}>
                    <div>
                        <span onClick={handleModal} className={styles.close}>&times;</span>
                    </div>
                    {dataa.length>0 ?(
                    <div>
                    {dataa.map((user, index) => (
                        <div key={index}>
                        <h2>{`${user.fName} ${user.lName}`}</h2>
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

            </>
            ):
            <>
                <Result userData={userData} rating={ratings} stdData={dataa} />
            </>}
        </>
    );
};

export default ProductInfo;

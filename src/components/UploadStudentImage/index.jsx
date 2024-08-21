import {  useState } from 'react';
import styles from './index.module.css';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {v4 } from "uuid";



const UploadStudentImage = ({onImageUpload}) => {

    const [image , setImage] = useState('')
    const [imageUrl , setImageUrl] = useState(null)

    const storage = getStorage();

   const handleUploadImage = () => {
    const imageRef = ref(storage, `StudentImages/${image.name + v4()}`);

    uploadBytes(imageRef, image).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
            setImageUrl(url); 
            onImageUpload(url) 
        });
    }).catch((error) => {
        console.error("Error uploading image: ", error);
    });
    };

    return (
        <div>
            <div style={{ marginTop: "20px" }}>
                <label htmlFor="uploadPicture" style={{ display: "block", marginBottom: "10px" }}>Upload Picture:</label>
                <input 
                    type="file" 
                    id="uploadPicture" 
                    accept="image/*" 
                    className={styles.fileInput}
                    onChange={(e)=>setImage(e.target.files[0])} 
                />
                <button className={styles.uploadButton} 
                    onClick={handleUploadImage}
                    disabled = {image===''}>Upload
                </button>
                <br />
                {imageUrl && <img src={imageUrl} width="200px" height="200px" style={{borderRadius:"10px"}} alt="" />
}
            </div>
        </div>
    )
}

export default UploadStudentImage
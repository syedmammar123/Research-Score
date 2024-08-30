import { useState } from 'react';
import styles from './index.module.css';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

const UploadStudentImage = ({ onImageUpload,key }) => {
    const [imageUrl, setImageUrl] = useState(null);

    const storage = getStorage();

    const handleUploadImage = (e) => {
        let img = e.target.files[0];
        if (img === "") {
            return;
        }

        const imageRef = ref(storage, `StudentImages/${img.name + v4()}`);

        uploadBytes(imageRef, img).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setImageUrl(url);
                onImageUpload(url);
            });
        }).catch((error) => {
            console.error("Error uploading image: ", error);
            alert("There was an error uploading the image. Please try again.");
        });
    };

    return (
        <div style={{ display: 'flex', justifyContent: "center", width: "100%" }}>
            <div style={{ marginTop: "10px" }}>
                <label htmlFor="uploadPicture" style={{ display: "block", marginBottom: "0px", fontSize: "14px", paddingLeft: "0px" }}>
                    Upload Picture:
                </label>
                <input 
                    type="file" 
                    id="uploadPicture" 
                    accept="image/*" 
                    className={styles.fileInput}
                    onChange={handleUploadImage} 
                />
                <br />
                {imageUrl && 
                <div style={{ textAlign: "center" }}>
                     <img src={imageUrl} width="100px" height="100px" style={{ borderRadius: "10px" }} alt="Uploaded student" />
                </div>}
            </div>
        </div>
    );
}

export default UploadStudentImage;

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// thay config thành config của bạn
const firebaseConfig = {
    apiKey: "AIzaSyB_AARpq4JC8whGk51oWfCLLgTOfKjBdjo",
    authDomain: "md5lancome-53ee0.firebaseapp.com",
    projectId: "md5lancome-53ee0",
    storageBucket: "md5lancome-53ee0.appspot.com",
    messagingSenderId: "634280478032",
    appId: "1:634280478032:web:fc48e9153c33207b8b1855",
    measurementId: "G-Y2FEJ9KYMF"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadFileToStorage(file: any, folderName: any, bufferData: any = undefined) {
    // nếu file là null thì không làm gì hết
    if (!file) {
        return false
    }

    let fileRef;
    let metadata;
    if (!bufferData) {
        // tên file trên file base
        fileRef = ref(storage, `${folderName}/` + file.originalname);
    } else {
        // tên file trên file base
        fileRef = ref(storage, `${folderName}/` + file.originalname);
        metadata = {
            contentType: (file as any).mimetype,
        };
    }
    let url;
    if (bufferData) {
        // upload file lên fire storage
        url = await uploadBytes(fileRef, bufferData, metadata).then(async res => {
            // khi up thành công thì tìm URL
            return await getDownloadURL(res.ref)
                .then(url => url)
                .catch(er => false)
        })
    } else {
        // upload file lên fire storage
        url = await uploadBytes(fileRef, file).then(async res => {
            // khi up thành công thì tìm URL
            return await getDownloadURL(res.ref)
                .then(url => url)
                .catch(er => false)
        })
    }


    return url
}
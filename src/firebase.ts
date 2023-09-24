import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// thay config thành config của bạn
const firebaseConfig = {
    apiKey: "AIzaSyD5fTYk0UZhKaq3I-u7ZC_vu9vEbeZDu6k",
    authDomain: "md5lancome.firebaseapp.com",
    projectId: "md5lancome",
    storageBucket: "md5lancome.appspot.com",
    messagingSenderId: "29404745073",
    appId: "1:29404745073:web:fa5a346df9c8e27d91bad0",
    measurementId: "G-QGDNG7YDCS"
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
        fileRef = ref(storage, `${folderName}/` + file.name);
    } else {
        // tên file trên file base
        fileRef = ref(storage, `${folderName}/` + (file as any).filename);
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
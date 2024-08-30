import axios from "axios";
// console.log(import.meta.env)



export const UploadImage=async(img)=>{
    let imgUrl=null;
    console.log(import.meta.env.VITE_SERVER_DOMAIN)
    await axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/get-upload-url")
    .then(async({data:{uploadURL}})=>{

        await axios({
            method:'PUT',
            url:uploadURL,
            headers:{"Content-Type":'multipart/form-data'},
            data:img
        })
        .then(()=>{
            console.log(uploadURL)
            imgUrl=uploadURL.split('?')[0]
        })
    })
    .catch(err=>{
        console.log("run wen na ballo")
    })
    return imgUrl;
}


import React, { useContext, useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import logo from '../imgs/logo.png';
import Page_Animation from '../Common/Page_Animation';
import defaultBanner from "../imgs/blog_banner.png"//it is a image
import { UploadImage } from '../Common/AWS';
import { EditorContext } from '../Pages/Editor';
import {Toaster,toast} from 'react-hot-toast';
import EditorJs from "@editorjs/editorjs"
import { Tools } from './Tools';
import axios from 'axios';
import { UserContext } from '../App';



function BlogEditor() {

    //let blogBannerRef=useRef();

    let {blog,blog:{title,banner,content,tags,des},setBlog,textEditor,setTextEditor,setEditorState}=useContext(EditorContext);
    let {userAuth:{access_token}}=useContext(UserContext);

    let {blog_id}=useParams();

    let navigate=useNavigate();

    //console.log(blog);

    
    //useEffect
    useEffect(()=>{

        if(!textEditor.isReady){
            setTextEditor(new  EditorJs({//npm i @editorjs/editorjs
                holderId:'textEditor',
                data:Array.isArray(content) ? content[0]:content,
                tools:Tools,
                placeholder:"Let s write an awesome story",
                
                //textEditor.isKey change to true
            }) ) 
        }
    
       

    },[])




   
    const handleBanner=(e)=>{
        //   console.log(e) // e=>target=>files[0]---->image details

          let img=e.target.files[0];
        //   console.log("Img==>"+img);

          if(img){


            let loadingToast=toast.loading("Üploading...")

            UploadImage(img).then((url)=>{
            // console.log(url)
                if(url){
                    toast.dismiss(loadingToast);
                    toast.success("Uploaded 👍")
                    // blogBannerRef.current.src=url

                    setBlog({...blog,banner:url})
                }
            })
          }

          
    }

    const handleTitleKeyDown=(e)=>{
       // console.log(e)

        if(e.keyCode==13){
            e.preventDefault();
        }
    }

    const handleTitleChange=(e)=>{
       // console.log(e)              //get the console value
        let input=e.target;

        ///console.log(input.scrollHeight)//you can see height

        input.style.height='auto';
        input.style.height=input.scrollHeight+"px"  //change titile hegith accoeding to the scrolling


        setBlog({...blog,title:input.value})
    }

    const handleError=(e)=>{

        let img=e.target;//console akedi load wenakot e.target.img ekat url eka assigned wen na correctly .eka nisa eka fixed karnn oni
        img.src=defaultBanner

    }


    const handlePublishEvent=()=>{

        if(!banner.length){
             return toast.error("Uplaod a blog banner to publish it")
        }

        if(!title.length){
            return toast.error("write blog title to publish it")
        }
        if(textEditor.isReady){
            textEditor.save().then(data=>{
                console.log(data)  //data.blocks[]
               if(data.blocks.length){
                  setBlog({...blog,content:data});
                  setEditorState("publish");
               }else{
                  return toast.error("Write somthing in your blog to publish it")
               }

            })
            .catch((err)=>{
                console.log(err)
            })
        }

    }

    const handleSaveDraftEvent=(e)=>{
        
        if(e.target.className.includes('disable')){
            return;
           }
      
           if(!title.length){     
               return toast.error("write blog  title before saving it as draft");
           }
          
      
           let loadingToast=toast.loading("Saving Draft.....");
      
      
           e.target.classList.add('disable');
      
           let blogObj={
                 title,banner,des,content,tags,draft:true
           }
           
           axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/create-blog',{...blogObj,id:blog_id},{
                  headers:{
                    "Authorization":`Bearer ${access_token}`
                  }
           })
           .then(()=>{
              
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast)
            toast.success("Saved 👍")
      
            setTimeout(()=>{
                navigate('/')//got Home page
            },500);
      
           })
           .catch(({response })=>{
               e.target.classList.remove('disable');
               toast.dismiss(loadingToast);
      
               return toast.error(response.data.error);
           })
      
      
       }
      
    



  return (
    <>
        <nav className='navbar'>
           <Link to='/' className='flex-none w-10 '>
               <img src={logo} alt=""   />
           </Link>
        <p className='max-md:hidden text-black line-clamp-1 w-full'>
            {title.length?title:"New Blog"}
        </p>
            <div className='flex gap-4 ml-auto'>
               <button className='btn-dark py-2'
                       onClick={handlePublishEvent}
               >
                   Publish
               </button>
               <button 
                       className='btn-light py-2'
                       onClick={handleSaveDraftEvent}
                       
                       >
                   Save Draft
               </button>
            </div>
       </nav>

        <Toaster/>
        <Page_Animation>
           <section>


                 <div className='max-auto max-w-[900px] w-full'>

                    <div className='relative aspect-video hover:opacity-80 bg-white border-4 border-grey'>
                        <label htmlFor='uploadBanner'>
                            <img 
                           // ref={blogBannerRef}//useRef
                           // src={defaultBanner} 
                           src={banner}
                            alt=""
                            className='z-20'
                            onError={handleError}
                             />

                            <input
                                id='uploadBanner'
                                type='file'
                                accept='.png,.jpg,.jpeg'
                                hidden
                                onChange={handleBanner}
                            />
                        </label>

                    </div>

                    <textarea
                       defaultValue={title}
                       placeholder='Blog Title'
                       className='text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40'
                       onKeyDown={handleTitleKeyDown}
                       onChange={handleTitleChange}
                    >

                    </textarea>

                    <hr className='w-full opacity-10 my-5'></hr>

                    <div id='textEditor' className='font-gelasio '></div>




                 </div>

           </section>
        </Page_Animation>
    </>
  );
}


export default BlogEditor
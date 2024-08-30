import React, { useContext, useRef } from "react";
import InputBox from "../Components/InputBox";
import googleIcon from "../imgs/google.png";
import { Link, Navigate } from "react-router-dom";
import Page_Animation from "../Common/Page_Animation";
import {Toaster,toast} from 'react-hot-toast'
import axios from 'axios'//to connect to the server
import { StoreInSession } from "../Common/Session";
import { UserContext } from "../App";


import { auth,provider } from "../Common/FireBase";
import {signInWithPopup} from 'firebase/auth'







function UserAuthForm({ type }) {

  let {userAuth:{access_token},setUserAuth}=useContext(UserContext);
  console.log(access_token);


  //  const authForm=useRef(null);//get the reference of the form

   const userAuthThroughServer = (serverRoute, formData) => {
    // console.log(import.meta.env.VITE_SERVER_DOMAIN)
    // console.log(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData);
    
    axios.post("http://localhost:3000" + serverRoute, formData)
      .then(({ data }) => {
          StoreInSession("user",JSON.stringify(data));
          setUserAuth(data)
      })
      .catch(({ response }) => {
        if (response && response.data && response.data.error) {
          toast.error(response.data.error);
        } else {
          toast.error('An unexpected error occurred.');
        }
      });
  };



  const handleSubmit=(e)=>{

     e.preventDefault();

     let serverRoute= type=="sign-in"? "/signin":"/signup";

     //fromdata
     let form =new FormData(formElement)
     let formData={};

     for(let[key,value] of form.entries()){
      formData[key]=value;
     }
     

    //form validation
     let {fullname,email,password}=formData;

     let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
     let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password


    if ( type!=='sign-in' && (!fullname || fullname.length <3)) {
         return toast.error( "Full name must be at least 3 letters long" );
    }
    if(!email.length){
        return toast.error("Enter email")
    }
    if(!emailRegex.test(email)){
        return toast.error("Email is invalid")
   }
   if(!passwordRegex.test(password)){
       return toast.error("password should be 6 to 20 charchters long with a numeric ,1 lowercase and 1 upercase letterss")
   }
   userAuthThroughServer(serverRoute,formData);

  }

  const handleGoogleAuth=(e)=>{
       
     e.preventDefault();

    // authWithGoogle().then(user=>{
    //   console.log(user)

    //   // let route="/google-auth";
    //   // let formData={
    //   //   access_token :user.accessToken
    //   // }
    //   // userAuthThroughServer(route,formData)
    // })
    // .catch(err=>{
    //     toast.error("throuble login through google");
    //     return console.log(err)
    // })
       
       signInWithPopup(auth,provider).then(user=>{
        console.log(user)
        let formData={
            access_token :user.accessToken
        }
          

       })










   
  }

  

  return (
    access_token ?
         <Navigate to="/" />
    :
    <Page_Animation keyValue={type}>
      <section className="h-cover flex items-center justify-center">
         <Toaster/>
        <form className="w-[80%] max-w-[400px]" id="formElement">
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type == "sign-in" ? "Welcome Back" : "Join Us Today"}
          </h1>

          {type !== "sign-in" ? (
            <InputBox
              name="fullname"//these effect to the FormData since should bee use  same name for the FormData 
              type="text"
              placeholder="Full name"
              icon="fi-rr-user"
            />
          ) : (
            ""
          )}

          <InputBox
            name="email"
            type="email"
            placeholder="email"
            icon="fi-rr-at"
          />
          <InputBox
            name="password"
            type="password"
            placeholder="password"
            icon="fi-rr-key"
          />
          <button className="btn-dark center mt-14"
          type='submit'
          onClick={handleSubmit}
          >
            {type.replace("-", " ")}
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 uppercase opacity-10 text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
          onClick={handleGoogleAuth}
          >
            <img src={googleIcon} alt="" className="w-5" />
            Continue With Google
          </button>

          {type === "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Dont't have an account?
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Join us today
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member?
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign in here.
              </Link>   
            </p>
          )}
        </form>
      </section>
    </Page_Animation>
  );
}

export default UserAuthForm;

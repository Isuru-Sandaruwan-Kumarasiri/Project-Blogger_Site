import { useParams } from "react-router-dom";
import Page_Animation from "../Common/Page_Animation";
import InPageNavigation from "../Components/InPageNavigation";
import { useEffect, useState } from "react";
import Loader from "../Components/Loader";
import NoDataMessage from "../Components/NoDataMessage";
import LoadMoreDataBtn from "../Components/LoadMoreData";
import BlogPostCard from "../Components/BlogPostCard";
import axios from "axios";
import { FilterPaginationData } from "../Common/FilterPagination";
import UserCard from "../Components/UserCard";


const SearchPage=()=>{

    let {query}=useParams()//get the search cookies

    let [blogs,setBlog]=useState(null);

    let [users,setUsers]=useState(null);


    const searchBlogs=({page=1,create_new_arr=false})=>{
    
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs",{query,page})
        .then(async({data})=>{
            console.log(data.blogs)
            //setBlog(data.blogs)
           //  console.log(data)
           let formatedData=await FilterPaginationData({
             state:blogs,
             data:data.blogs,
             page,
             countRoute:"/search-blogs-count",
             data_to_send:{query},
             create_new_arr
           })
           console.log(formatedData);
           setBlog(formatedData);
     
         })
         .catch(err=>{
            console.log(err)
         })
    
    }

    const fetchUsers = (query) => { 
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", { query })
          .then(response => {
            const { data: { users } } = response; // Extract users from response
            setUsers(users); // Use the extracted users
          })
          .catch(error => {
            console.error("Error fetching users:", error); // Handle errors
          });
      };


    useEffect(()=>{
        resetState();
        searchBlogs({page:1 ,create_new_arr:true});
        fetchUsers();
    },[query])


    const resetState=()=>{
        setBlog(null);
        setUsers(null);
    }

    const UserCardWrapper=()=>{

        return(
            <>
               {
                   users==null ? <Loader/>:
                      users.length ?
                        users.map((user,i)=>{
                            return <Page_Animation key={i} transition={{duration:1 ,delay:i*0.08}}>
                                      
                                      <UserCard user={user}/>
                                
                                   </Page_Animation>
                        })
                      :<NoDataMessage message="No user found"/>

               }
            </>
        )
    }


    return(
       <section className="h-cover flex justify-center gap-10 ">
           <div className="w-full">
              <InPageNavigation routes={[`Search Result from "${query}"`,"Accounts Matched"]} defaultHidden={["Accounts Matched"]}>
                  
                  <>
                     {
                          blogs==null ?(
                            <Loader/> 
                            ) :(
                              blogs.results.length ?
                                blogs.results.map((blog,i)=>{
                                  return <Page_Animation transition={{duration:1,delay:i*1}} keyValue={i}>
                                            
                                            <BlogPostCard content={blog} author={blog.author.personal_info}/>

                                        </Page_Animation>
                                })
                                :<NoDataMessage message="No Blogs Published Yet"/>
                              )
                        }
                         <LoadMoreDataBtn state={blogs}  fetchDataFun={searchBlogs}/> 
                     
                  </>

                 <UserCardWrapper/>

              </InPageNavigation>
           </div>

           <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">
              
               <h1 className="font-medium text-xl mb-8">User related to search<i className="fi fi-rr-user"></i></h1>
               <UserCardWrapper/>

           </div>

       </section>
    )
}

export default SearchPage;
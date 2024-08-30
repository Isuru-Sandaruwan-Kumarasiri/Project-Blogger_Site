import React, { useEffect, useState } from 'react'
import Page_Animation from '../Common/Page_Animation'
import InPageNavigation, { activeTabRef } from '../Components/InPageNavigation'
import axios from 'axios';
import Loader from '../Components/Loader';
import BlogPostCard from '../Components/BlogPostCard';
import MinimalBlogPostCard from '../Components/MinimalBlogPostCard';
import NoDataMessage from '../Components/NoDataMessage';
import { FilterPaginationData } from '../Common/FilterPagination';
import LoadMoreDataBtn from '../Components/LoadMoreData';

function HomePage() {

  let [blogs,setBlog]=useState(null);
  let [trendingBlogs,setTrendingBlog]=useState(null);
  let [pageState,setPageState]=useState("home");

  let categories=["Java","Python","Javascript","React","Node Js","Next Js","tailwindcss"]


  const fetchlatestBlogs=({page=1})=>{

    axios.post(import.meta.env.VITE_SERVER_DOMAIN +"/latest-blogs",{page})
    .then(async({data})=>{
       console.log(data.blogs)
       //setBlog(data.blogs)
      //  console.log(data)
      let formatedData=await FilterPaginationData({
        state:blogs,
        data:data.blogs,
        page,
        countRoute:"/all-latest-blogs-count"
      })
      console.log(formatedData);
      setBlog(formatedData);

    })
    .catch(err=>{
       console.log(err)
    })
  }

  const fetchTrendingBlogs=()=>{

    axios.get(import.meta.env.VITE_SERVER_DOMAIN +"/trending-blogs")
    .then(({data})=>{
       //console.log(data.blogs)
       setTrendingBlog(data.blogs)

    })
    .catch(err=>{
       console.log(err)
    })
  }

  const fetchBlogsByCategory=({page=1})=>{

    axios.post(import.meta.env.VITE_SERVER_DOMAIN +"/search-blogs",{tag:pageState,page})
    .then(async({data})=>{

      let formatedData=await FilterPaginationData({
        state:blogs,
        data:data.blogs,
        page,
        countRoute:"/search-blogs-count",
        data_to_send:{tag:pageState}
      })
      //console.log(formatedData);
      setBlog(formatedData);

    })
    .catch(err=>{
       console.log(err)
    })

  }

  useEffect(()=>{
   

    activeTabRef.current.click();
    

    if(pageState=="home"){
      fetchlatestBlogs({page:1});
    }else{
       fetchBlogsByCategory({page:1});
    }

    if (!trendingBlogs){
      fetchTrendingBlogs();
    }
    

  },[pageState])

  const loadBlogBycategory=(e)=>{

    let category=e.target.innerText.toLowerCase();

    setBlog(null);

    if(pageState==category){
      setPageState("home");
      return
    }

    setPageState(category);

  }




  return (
    <Page_Animation>
        <section className='h-cover flex justify-center gap-10'>

            {/* Latest Blogs */}
             <div  className='w-full'>

                <InPageNavigation  routes={[pageState,"trending blogs"]} defaultHidden={["trending blogs"]} >
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
                            <LoadMoreDataBtn state={blogs}  fetchDataFun={(pageState=="home" ? fetchlatestBlogs : fetchBlogsByCategory)}/>
                          </>

                          {
                            trendingBlogs==null ?
                            <Loader/> 
                            :
                             (
                              trendingBlogs.length?
                                  trendingBlogs.map((blog,i)=>{
                                    return <Page_Animation transition={{duration:1,delay:i*1}} keyValue={i}>
                                              
                                              <MinimalBlogPostCard blog={blog} index={i} />

                                          </Page_Animation>
                                  })
                                :
                                <NoDataMessage message="No TrendingBlogs"/>
                              )
                          }
                </InPageNavigation>
                        

             </div>

            {/* Filter and Trending Blogs */}
            <div className='min-w-[40%] lg:min-w-[400px] max-w-min border-l-4 border-grey pl-8 pt-3 max-md:hidden ' >  

                <div className='flex flex-col gap-10'>
                      <div>
                          <h1 className='font-medium text-xl mb-8'>Storis from all interests</h1>

                          <div className='flex gap-3 flex-wrap'> 
                              {
                                categories.map((category,i)=>{
                                  return (
                                   <button onClick={loadBlogBycategory} className={`tag ${pageState === category ? 'bg-black text-white' : ''}`}  key={i}>
                                    {category}
                                  </button> 
                                  );                 
                                  
                                })
                              }
                          </div>
                      </div>
                

                      <div>
                          <h1 className='font-medium text-xl mb-8'>Trending<i className='fi fi-rr-arrow-trend-up'></i></h1>
                          {
                                    trendingBlogs==null ?<Loader/> :
                                    trendingBlogs.map((blog,i)=>{
                                      return <Page_Animation transition={{duration:1,delay:i*1}} keyValue={i}>
                                                  
                                                  <MinimalBlogPostCard blog={blog} index={i} />

                                              </Page_Animation>
                                    })
                            }
                      </div>
              </div>
            </div>
        </section>
    </Page_Animation>
  )
}

export default HomePage
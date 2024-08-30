import { useContext } from "react";
import { BlogContext } from "../Pages/BlogPage";
import CommentField from "./CommentField";
import axios from "axios";
import NoDataMessage from "./NoDataMessage";
import Page_Animation from "../Common/Page_Animation";
import CommentCard from "./CommentCard";


export const  fetchComments=async({skip=0,blog_id,setParentCommentCountFun,comment_array=null})=>{

     let res;

     await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog-comments",{blog_id,skip})
     .then(({data})=>{
        data.map(comment=>{
            comment.childrenLevel=0;
        })
        setParentCommentCountFun(preVal=>preVal+data.length)

        if(comment_array==null){
            res={results:data}
        }else{
            res={results:[...comment_array,...data]}
        }
        
        console.log(res)
     })

     return res;
          


}

const CommentsWrapper=()=>{

    let {blog,blog :{_id,title,comments:{results:commentArr},activity:{total_parent_comments}},commentsWrapper,setCommentWrapper,totalParentCommentsLoaded,setTotalParentCommentsLoaded,setBlog}=useContext(BlogContext);

    const LoadMorecomments=async()=>{

        let newCommentsArr=await fetchComments({skip:totalParentCommentsLoaded,blog_id:_id,setParentCommentCountFun:setTotalParentCommentsLoaded,comment_array:commentArr})

        setBlog({...blog,comments:newCommentsArr});
    }




    return(
        <div className={"max-sm:w-full fixed  "+(commentsWrapper ? "top-0 sm:right-0":"top-[100%] sm:right-[-100%]")+"  duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden"}>
             
             <div className="relative">
                <h1 className="text-xl font-medium">Comments</h1>
                <p className="text-lg mt-2 w-[70%] text-dark-grey line-clamp-1">{title}</p>

                <button 
                  onClick={()=>setCommentWrapper(preVal=>!preVal)}
                  className="absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey">
                    <i className="fi fi-br-cross"></i>    
                </button>
             </div>

             <hr className="border-grey my-8 w-[120%] -ml-10" />

             <CommentField action={"Comment"}/>

             {
                commentArr && commentArr.length ?
                commentArr.map((comment,i)=>{
                    return <Page_Animation key={i}>
                               <CommentCard index={i} leftVal={comment.childrenLevel*4} commentData={comment}/>
                           </Page_Animation>
                    // console.log(comment)
                }):<NoDataMessage message="No Comments"/>
             }
             {
                total_parent_comments >totalParentCommentsLoaded ?
                <button
                    onClick={LoadMorecomments}
                       className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
                >
                    Load more
                </button>
                :""
             }

        </div>
    )
}
export default CommentsWrapper;
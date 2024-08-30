const StoreInSession=(key,value)=>{
    return sessionStorage.setItem(key,value);
}
const LookInSession=(key)=>{
    return sessionStorage.getItem(key)
}
const RemoveFormSession =(key)=>{
    return sessionStorage.removeItem(key)
}
const LogOutUser=()=>{
   return sessionStorage.clear();

}

export {StoreInSession,LookInSession,RemoveFormSession,LogOutUser}
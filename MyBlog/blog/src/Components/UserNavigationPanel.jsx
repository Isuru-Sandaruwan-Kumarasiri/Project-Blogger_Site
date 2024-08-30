import React, { useContext } from "react";
import Page_Animation from "../Common/Page_Animation";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { LogOutUser, RemoveFormSession } from "../Common/Session";

function UserNavigationPanel() {
  const {userAuth: { username }, setUserAuth } = useContext(UserContext);

  const signOutUser = () => {
    console.log("Signing out user...");
    RemoveFormSession("user");
    console.log("Removed user from session.");
    setUserAuth({ access_token: null });      //mouse right click
    console.log("User auth state updated.");
    LogOutUser();
    console.log("Cleared session storage.");
  };

  return (
    <Page_Animation
      className="absolute right-0 z-50"
      transition={{ duration: 0.2 }}
    >
      <div className="bg-white absolute right-0 border-grey w-60  duration-200 shadow-2xl">
        <Link to="/editor" className="flex gap-2 md:hidden pl-8 py-4">
          <i className="fi fi-rr-file-edit"></i>
          <p>Write</p>
        </Link>

        <Link to={`/user/${username}`} className="link pl-8 py-4">
          Profile
        </Link>

        <Link to="/dashboard/blogs" className="link pl-8 py-4">
          Dashboard
        </Link>

        <Link to="/settings/edit-profile" className="link pl-8 py-4s">
          Settings
        </Link>

        <span className="absolute border-t border-grey  w-[100%] "></span>

        <button 
          onClick={signOutUser}
          className='text-left p-4 hover:bg-grey w-full pl-8 py-4' 
        >
          <h1 className='font-bold text-xl mg-1'>Sign Out</h1>
          <p className='text-dark-grey'>@{username}</p>
        </button>
      </div>
    </Page_Animation>
  );
}

export default UserNavigationPanel;

import React, { useState, useRef, useEffect } from "react";
export let activeTabLineRef;
export let activeTabRef;



function InPageNavigation({ routes, defaultHidden=[],defaultActiveIndex = 0 ,children}) {


  const [InPageNavIndex, setInpageNavIndex] = useState(defaultActiveIndex); // Initialize with defaultActiveIndex

  activeTabLineRef = useRef();
  activeTabRef = useRef();

  const changPageState = (btn, i) => {
    const { offsetWidth, offsetLeft } = btn; // Get the button properties
    activeTabLineRef.current.style.width = offsetWidth + "px";
    activeTabLineRef.current.style.left = offsetLeft + "px";
    setInpageNavIndex(i);
  };

  useEffect(() => {
    if (activeTabRef.current) {
      changPageState(activeTabRef.current, defaultActiveIndex);
    }
  }, [defaultActiveIndex]); // Add defaultActiveIndex as a dependency

  return (
    <>
      <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
        {
            routes.map((route, i) => (
                <button
                    ref={i === defaultActiveIndex ? activeTabRef : null} // Correctly set the ref
                    key={i}
                    className={"p-4 px-5 capitalize " + (InPageNavIndex === i ? "text-black" : "text-dark-grey ")+(defaultHidden.includes(route)?"md:hidden":" ")}
                    onClick={(e) => changPageState(e.target, i)}
                >
                    {route}
                </button>
            ))
        }
        <hr ref={activeTabLineRef} className="absolute bottom-0 duration-300" />
      </div>

       {Array.isArray(children)?children[InPageNavIndex]:children}
    </>
  );
}

export default InPageNavigation;

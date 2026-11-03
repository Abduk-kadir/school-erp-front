import React, { useState, useRef } from "react";

const TestingPage = () => {
  const [count, setCount] = useState(0);
 let countRef=useRef(0)
 let inputRef=useRef(null)

  console.log("rerendering");

  const incrementState = () => {
    setCount(count + 1);
   
  
    
  };

  

  const focusInput = () => {
   // if (!inputRef.current) return;
    inputRef.current.focus();
    inputRef.current.style.border = "2px solid red";
  };

  return (
    <div>
      <h1>State Count: {count}</h1>
      <h1>Ref Count: {countRef.current}</h1>
  
      <input ref={inputRef} className="form-control mb-2" placeholder="Type here" />
  
      <button  className="btn btn-primary me-2" onClick={incrementState}>+ State</button>
      <button  className="btn btn-secondary" onClick={focusInput}>Focus Input</button>
    </div>
  );
};

export default TestingPage;
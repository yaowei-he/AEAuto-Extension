import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
const Wel = () => {
    
const nav = useNavigate();
useEffect(()=>{
    const token = localStorage.getItem("token");
    const rou = token ? "/main" : "/log";
    setTimeout(() => {
        nav(rou);
    }, 1000);

},[]); 

    return (
    <div className=" h-screen flex items-center justify-center">

      <img src="/img/banner.png" alt="logo" className=" h-full" />
      {/* <div className=" w-full flex flex-col gap-y-3 justify-center items-center">
        
        <p className="text-2xl font-bold">Poster 背景</p>
        <p className="text-2xl text-red-500 font-bold">小严AI</p>
        <p className="text-2xl text-red-500  font-bold">创造无限可能</p>
      </div> */}
  </div>
  )
}

export default Wel;




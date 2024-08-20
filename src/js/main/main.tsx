import { useEffect, useState } from "react";

import SideBar from "./components/SideBar";
import { Link, useNavigate } from "react-router-dom";
import { getUserUsage } from "./api";

interface userFormat {
  is_admin: Boolean;
  level: string;
  max_usage: number;
  current_usage: number;
  username: string;
}

interface usage {usage:number, maxUsage:number}
const Main = () => {

  const menuList = [
    {
      item: "AE表达式",
      link: "/expressions",
      icon: "/img/ex.png",
      desc: "一键生成表达式,无需代码",
    },

    {
      item: "AE自动化",
      link: "/auto",
      icon: "/img/auto.png",
      desc: "一键实现自动化操作",
    },
    {
      item: "AE机器人",
      link: "/chat",
      icon: "/img/chat.png",
      desc: "对话学习AE的各种知识",
    },
  ];
  const nav = useNavigate();
  const [user,setUser] = useState<userFormat>(  );
  const [usageData, setUsageData] = useState(
    { currentUsage: 0, maxUsage: 100 }
  )

  // useEffect(()=> {

  // },[])

  function handleClear(){
    localStorage.clear();
    nav("/log")
  };

  return (
    <div className=" text-black h-screen flex">
        <SideBar />
          <div className="
          bg-cover bg-[url('/img/bg.png')] 
          flex-auto flex flex-col px-4 justify-center gap-y-3">
          <div className="flex justify-between bg-gray-50 border rounded-lg shadow-sm px-5 py-3">
              <div className="flex gap-x-2 justify-center items-center text-gray-500 dark:text-gray-400">
                <span className="text-base">剩余</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{usageData.currentUsage} of {usageData.maxUsage} used</span>
              </div>
              <button onClick={handleClear}>退出登录</button>
          </div>
          
          {menuList.map((m,i)=> (<div key={i} className="">
            <div className=" min-w-[350px]
            hover:scale-95 transition
            flex flex-row items-center border 
            bg-white border-gray-200 rounded-lg shadow">
            <img width={100} height={100} className="object-cover rounded-l-lg" src={m.icon} alt='s' />
            <Link to={m.link}>
            <div className="flex flex-col justify-between p-2 leading-normal cursor-pointer">
              <h5 className=" text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                {m.item}
              </h5>
              <p className=" font-normal text-gray-700 dark:text-gray-400">
              {m.desc}
              </p>
            </div>
            </Link> 

            </div>
          </div>))}

          </div>

        </div>
      
  );
};


export default Main;




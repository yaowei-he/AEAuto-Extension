import { useEffect, useState } from "react";
import { NavLink, useLocation, } from "react-router-dom";

const SideBar = () => {

  let location = useLocation().pathname; 
  const [username, setUsername] = useState(""); 

  useEffect(()=>{
    const user = localStorage.getItem('userInfor');
    if (user) {
      setUsername(JSON.parse(user).username);
    }
  },[])

  const sidebarList = [
    {
      item: "AE表达式",
      link: "/expressions",
      icon:"/img/ex.png"
    },

    {
      item: "AE自动化",
      link: "/auto",
      icon:"/img/auto.png"
    },
    {
      item: "AE机器人",
      link: "/chat",
      icon:"/img/chat.png"
    },
  ];

  return (
    <div className="border-r hidden sm:block 
    h-full w-[150px] px-1 py-4 
    overflow-y-auto bg-gray-50 dark:bg-gray-800">
      <div className="h-full flex flex-col justify-between">
        <div>
          <NavLink to="/main" 
          className=" flex justify-center mb-3">
            <img src="/img/logo.png" alt="logo" 
            className=' hover:scale-110 transition w-[100px]'/>
            
          </NavLink>
          <ul className="space-y-2 font-medium">
            {sidebarList.map((m,i) => (<li key={i}>
                <NavLink to={m.link} className={`${m.link===location && 'bg-blue-500'} flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-300`}>
                <img width={40} height={40} className="object-cover rounded-md" src={m.icon} alt='s' />
                  <span className="ms-2">{m.item}</span>
                </NavLink>
            </li>))}
          </ul>

        </div>

        <div className="flex items-center">
          <img src="/img/dog.png" alt="none" className="w-8 h-8 rounded-full mr-4" />
          <div className="text-sm">
            <p className="text-gray-900 leading-none">{username}</p>
          </div>
        </div>
      </div>
    </div>    
  )
}

export default SideBar;




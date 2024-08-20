import { useNavigate } from 'react-router-dom';
import { addUser, authUser } from '../api';
import { useState } from 'react';

const Log = () => {

  const nav = useNavigate();
  const [error, setError] = useState(false);
  const [isLog, setIsLog] = useState(false);

  async function createUser(e: { preventDefault: () => void; target: any; }){
    e.preventDefault();
    const target = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
    };
    const username = target.username.value.trim(); // typechecks!
    const password = target.password.value;

    try {
      if(username.length > 2 && password.length > 2) {
      // 判断是登录还是注册
      if(isLog){
        await authUser({username, password});
      } else {
        await addUser({username, password});
      }
      nav("/main");
      } else {
        console.log("出错!");
      }
    } catch (error) {
      console.log(error);
    }

  }  

  function handleSet(){
    localStorage.setItem("token", JSON.stringify("Bearer test"));
    nav("/main");
  }
  
  return (
  <div className='h-screen grid items-center'>

    <form className="px-10" onSubmit={createUser}>  
      <div className="mb-5 flex items-center gap-x-5">
        <label htmlFor="username" className="block text font-medium text-white">用户</label>
        <input type="text" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[80%] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="用户名不小于三个字符..." required />
      </div>
      <div className="mb-5 flex items-center gap-x-5">
        <label htmlFor="password" className="block text font-medium text-white">密码</label>
        <input type="text" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[80%] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='密码不小于六位数...' required />
      </div>
      <div className='px-10 flex gap-x-5'>
        {/* <button
          onClick={()=>setIsLog(!isLog)}
          className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full  text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            {isLog ? "切换到注册" : "切换到登录" }</button> */}
        <button type="submit" 
        className="mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          {isLog ? "登录" : "注册"}</button>
        <button 
        className="mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={handleSet}>开发者登录</button>
      </div>
    </form>
      {error && <h3 style={{color: "#ff5b3b"}}>用户名已被注册</h3>}
  </div>

  )
}

export default Log;




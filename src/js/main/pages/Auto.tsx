import {useEffect, useState }from 'react'
import { Link, useNavigate } from 'react-router-dom';
import SideBar from '../components/SideBar';
import EmptyList from '../components/EmptyList';
import ChatCard from '../components/ChatCard';
import { autoApi } from '../api';
import { evalES, evalTS } from '../../lib/utils/bolt';




interface msgFormat {
  content: string;
  role: string;
  time: string;
}

const Auto = () => {
  const nav = useNavigate();
  const [messages, setMessages] = useState<msgFormat[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');

  const recommands = [
    "透明度控制器",
    "自动化B的示例?"];

  // 获取历史记录
  useEffect(()=>{
    const chats = localStorage.getItem('auto');

    if(chats){
      setMessages(JSON.parse(chats));
      const user = localStorage.getItem('userInfor');
      if(user){
        setUsername(JSON.parse(user).username);
      }
    }
  },[]);  

  // 发送信息
  async function sendAuto (r:number=-1) {

    let i:string;
    if(r === -1){
      i = input.trim();
      setInput('');
    // 如果i不为空
      if(i){
        const d = new Date();
        const t = d.toLocaleDateString() + "-" + d.toLocaleTimeString();
    
        const roleMsg = [...messages,{
          role:username || "user",
          content: i,
          time: t
        }]
        // 存储在本地 
        setMessages(roleMsg);
        localStorage.setItem('auto',JSON.stringify(roleMsg));

        // 网络连接后
        const res = await autoApi({time:t, category:'auto', content:username+"_"+i});

        //将网络data转换为msg格式
        const ai_content = res.content.split("_")[1];
        const ai_code = res.code;


        const ai_msg = [...roleMsg,{
          role:res.content.split("_")[0],
          content: ai_content,
          time:res.time
        }]
        // 存储到本地
        setMessages(ai_msg)
        localStorage.setItem('auto',JSON.stringify(ai_msg));


        // 使用evalTS
        console.log(ai_code)
        evalTS("transfer",ai_code).then((res) => {
          console.log(res);
        });
      } else {
        console.log("请输入")
      }
    } else {
      i = recommands[r];

      // 本地返回结果

      const re_msg = [...messages,{
        role:username || "user",
        content: i,
        time: "now"
    }];

      // 本地存储
      setMessages(re_msg);
      localStorage.setItem('auto',JSON.stringify(re_msg));

      // 运行
      if(r === 0) {
        evalTS("auto").then((res) => {
          console.log(res);
        });
      } else if(r === 1){

      }
  }
    
  }

  // 删除指定消息
  function deleteMsg(){

  }

  // 删除所有缓存
  function clearMsgs(){
    setMessages([]);  
    localStorage.setItem('auto',JSON.stringify([]));
    // localStorage.clear();
  }

  // 推荐
  function handleRecommand(r:number){
    sendAuto(r);
  }
  return (
    <div className=" text-gray-900 h-screen bg-white flex items-center">
      <SideBar />
      <div className=' flex-auto h-full flex flex-col items-center gap-y-3'>
        <div className='border-b px-3 w-full bg-gray-50 flex justify-between'>
            <div className='flex gap-x-3 items-center'><Link to="/main" className='sm:hidden'>
              <img src="/img/logo.png" alt="logo" 
              className='hover:scale-105 transition w-[65px]'/>
            </Link>
            <p className='sm:py-3'>AE自动化</p>
            
            </div>
            <button onClick={clearMsgs} className='flex items-center gap-x-2'>
              <img src="/img/de.png" alt="删除" 
              className='w-[25px] hover:scale-95' />
              删除全部
            </button>
        </div>
        <div className='w-full h-full flex flex-col px-1 overflow-y-scroll'>
        {messages.length > 0 ? 
            messages.map((m,i)=>((<ChatCard key={i}
               content={m?.content} role={m?.role} time={m?.time} />)))
             : <EmptyList 
             title={"AE自动化"} 
             content={"写出你的需求和实现过程，一步即可实现所需效果"} />}
        </div>

        {messages.length < 1 && <div className='flex gap-x-3 justify-between'>
          <div
          onClick={()=>handleRecommand(0)}
          className=' 
          hover:-translate-y-1 transition
          cursor-pointer block p-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100'>
            <p className="font-normal text-gray-700 dark:text-gray-400">{recommands[0]}</p>
          </div>
          <div 
          onClick={()=>handleRecommand(1)}
          className='
          hover:-translate-y-1 transition
          cursor-pointer block p-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100'>
            <p className="font-normal text-gray-700 dark:text-gray-400">{recommands[1]}</p>
          </div>
        </div>}
        
        <div className='w-full bg-gray-200  p-3'>
          <div className="relative w-full">
            <input value={input} 
            placeholder='自动化...'
            type="text" 
            onChange={e => setInput(e.target.value)}
            onKeyDown={(e) => {
              if(e.key === 'Enter') {
                sendAuto()
              }
            }}
            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500  required" />
              <button onClick={()=>sendAuto()} className="absolute top-0 end-0 h-full p-2.5 text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300" >
                自动化生成
              </button>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Auto;




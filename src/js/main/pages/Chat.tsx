import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom';
import SideBar from '../components/SideBar';
import { fetchEventSource } from "@microsoft/fetch-event-source";
import ChatCard from '../components/ChatCard';
import EmptyList from '../components/EmptyList';
import { chatApi } from '../api';

interface msgFormat {
  content: string;
  role: string;
  time: string;
}

const Chat = () => {

  const [messages, setMessages] = useState<msgFormat[]>([]);
  const [input, setInput] = useState('');
  const [streamData,setStreamData] = useState('');
  const [username, setUsername] = useState('');
  const streamDataRef = useRef<string>('');
  
  const recommands = [
    "聊天A的示例如?",
    "聊天B的示例如?"];
  
  // 获取历史记录
  useEffect(()=>{
    const chats = localStorage.getItem('chat');
    if(chats){
      setMessages(JSON.parse(chats));
      const user = localStorage.getItem('userInfor');
      if(user){
        setUsername(JSON.parse(user).username);
      }
    }
  },[]);  

  // 流式信息交流
  async function sendMsgStream (r:number=-1) {

    // 本地传输
    let i:string;
    if(r === -1){
      i = input.trim();
      setInput('');

    } else {
      i = recommands[r];
    }

    // 判断是否有数据
    if(i){
      const d = new Date();
      const t = d.toLocaleDateString() + "-" + d.toLocaleTimeString();
      
      const roleMsg = [...messages,{
        role:username,
        content: i,
        time: t
      }]
      // 存储在本地 
      setMessages(roleMsg);
      localStorage.setItem('chat',JSON.stringify(roleMsg))
      
      // 发送数据
      await chatApi({time:t, category:'chat', content:username+"_"+i});
    
      // 接收stream
      streamDataRef.current = '';
      setStreamData('');
      const url = "http://127.0.0.1:8000/api/msgs/fake-stream/?cate=chat"
      const toks = localStorage.getItem("token");

      if(toks){
        await fetchEventSource(url,{
          //配置请求
          method: "GET",
          headers: {
            "Authorization":toks,
            'Content-Type': 'application/json'      
          },
          // 建立连接
          onopen(res){
            if (res.ok && res.status === 200) {
              console.log("已经建立连接 ");
            } else if (res.status >= 400 && res.status < 500 && res.status !== 429) {
              console.log("客户端出现错误 ");
            }
            return Promise.resolve();
          },

          onmessage(ev) {
            let data = ev.data;

            // 是否为结束标志
            if(data === "END"){
              const d = new Date();
              const ai_msg =  
              { 
                time: d.toLocaleDateString() + "-" + d.toLocaleTimeString(), 
                content: streamDataRef.current, 
                role: "AI" 
              }
             
              if(streamData){
                setMessages(p => {
                 const da = [...p, ai_msg]
                 return da;
                });
                localStorage.setItem("chat", JSON.stringify([...messages,ai_msg]));
              }

              streamDataRef.current = '';  
              setStreamData('');         
            } else {

              // 将流式数据合并
              streamDataRef.current += data;
              setStreamData(streamDataRef.current);
            
              setMessages(m=> {

                // 取倒数一个
                const lastMessage = m[m.length - 1];

                if(lastMessage && lastMessage.role === "AI" && lastMessage.time === "streaming" ){

                  lastMessage.content = streamDataRef.current;
                  return [...m];

                } else {
                  // 开始时
                  return [...m,
                    {
                      time: "streaming", 
                      content: streamDataRef.current, 
                      role: "AI" 
                    }]
                }
              });
            }
          },

          // 连接中断
          onclose() {
            console.log("服务器关闭连接");
          },
          onerror(err) {
            console.log("服务器出现错误", err);
          },
        });
      } else {
        console.log("token无效");
      }
    } else {
      console.log("请输入");
    }

  }


  // 删除所有缓存
  function clearMsgs(){
    setMessages([]);  
    localStorage.setItem('chat',JSON.stringify([]));
  }

  // 推荐
  function handleRecommand(r:number){
    sendMsgStream(r);
  }

  return (
    <div className=" text-gray-900 h-screen bg-white flex items-center">
     <SideBar />
      <div className='flex-auto h-full flex flex-col items-center gap-y-3'>
        <div className='border-b w-full px-3 bg-gray-50 flex justify-between'>
        <div className='flex gap-x-3 items-center'><Link to="/main" className='sm:hidden'>
          <img src="/img/logo.png" alt="logo" 
          className='hover:scale-105 transition w-[65px]'/>
        </Link>
        <p className='sm:py-3'>AE聊天室</p>
        
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
              title={"AE机器人"}
              content={"直接和AE对话，24h学习AE的各种知识原理，"} />}
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
          onClick={()=>handleRecommand(0)}
          className=' 
          hover:-translate-y-1 transition
          cursor-pointer block p-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100'>
            <p className="font-normal text-gray-700 dark:text-gray-400">{recommands[1]}</p>
          </div>
        </div>}
          

          <div className='w-full p-3 bg-gray-200 '>

            <div className="relative w-full">
              <input value={input} 
              placeholder='聊天...'
              type="text" 
              onChange={e => setInput(e.target.value)} 
              onKeyDown={(e) => {
                if(e.key === 'Enter') {
                  sendMsgStream()
                }
              }}
                className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500  required" />
              <button 
              onClick={()=>sendMsgStream()} 
              className="absolute top-0 end-0 h-full px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300" >
                  发送
              </button>
          </div>            
          </div>
      </div>
    </div>
  )
}

export default Chat;


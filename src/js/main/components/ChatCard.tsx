interface msgFormat {
  content: string;
  role: string;
  time: string;
}

const ChatCard = (props:msgFormat) => {

  const {role, time, content} = props;

  return (
    <div className="flex items-start gap-2.5 py-2 border-b">

    <img className="object-cover  w-8 h-8 rounded-full" src={role === "AI" ? "/img/logo.png" : "/img/dog.png"} alt="Jese image" />
      <div className="flex flex-col gap-1 w-full max-w-[320px]">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{role}</span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{time}</span>
          </div>
          <div className="flex leading-1.5 px-3 py-2 border-gray-200 bg-gray-100 rounded-xl rounded-es-xl dark:bg-gray-700">
            <p className="text-sm font-normal text-gray-900 dark:text-white">{content}</p>
          </div>
      </div>    
   </div>
  )
}

export default ChatCard;




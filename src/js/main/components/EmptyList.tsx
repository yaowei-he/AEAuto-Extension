
interface cardFormat {
  title: string;
  content: string;
}

const EmptyList = (props:cardFormat) => {

  const {title, content} = props;
  return (
    <div className='h-full flex flex-col items-center justify-between pt-6'>
      <div className='block p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100'>
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">{content}</p>
      </div>
    </div>
  )
}

export default EmptyList;



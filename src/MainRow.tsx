import { useState } from 'react';

function MainRow() {
  const [divCount, setDivCount] = useState(1);

  const handleButtonClick = () => {
    setDivCount(prevCount => prevCount + 1);
  };

  return (
    <div className={`w-full grid grid-cols-3 ${divCount > 6 ? 'overflow-auto h-screen' : ''}`}>
      {Array.from({ length: divCount }, (_, index) => (
        <div key={index} className="w-full border border-slate-500 flex items-center justify-center bg-white" style={{ height: '50vh' }}>
          {index === divCount - 1 ? (
            <button onClick={handleButtonClick} className='hover:bg-yellow-200 h-full w-full'>+</button>
          ) : (
            'Hello World'
          )}
        </div>
      ))}
    </div>
  );
}

export default MainRow;
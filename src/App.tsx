import AddDealer from "./AddDealer"
// import GamesList from "./GamesList"
import DealerPool from "./DealerPool"
import DealerInfo from "./DealerInfo"
import MainRow from "./MainRow";
import { useState } from 'react';
import { Dealer } from "./types";

function App() {
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);

  return (
      <div className="bg-slate-500 h-screen flex flex-row">
      
        <div className="w-fit h-screen flex flex-col min-w-fit">
          <AddDealer/>
          <DealerPool selectedDealer={selectedDealer} setSelectedDealer={setSelectedDealer}/>
        </div>

        <div className="relative flex-grow">
          {selectedDealer && 
            <div className="absolute bottom-0 w-fit h-fit right-40">
              <DealerInfo selectedDealer={selectedDealer} setSelectedDealer={setSelectedDealer}/>
            </div>
          }
        
          <div className="h-screen w-full">
            <MainRow/>
          </div>
        </div>

        {/* <div className="bg-stone-500 w-fit h-screen">
          <GamesList/>
        </div> */}

      </div>
  )
}

export default App
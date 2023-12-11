import AddDealer from "./AddDealer"
import GamesList from "./GamesList"
import DealerPool from "./DealerPool"
import DealerInfo from "./DealerInfo"
import { useState } from 'react';
import { Dealer } from "./types";

function App() {
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);

  return (
      <div className="bg-slate-500 h-screen flex flex-row place-content-between">
      
        <div className="w-fit h-screen flex flex-col">
          <AddDealer/>
          <DealerPool selectedDealer={selectedDealer} setSelectedDealer={setSelectedDealer}/>
        </div>

        {selectedDealer && 
        <div className="w-fit h-screen">
          <DealerInfo selectedDealer={selectedDealer} setSelectedDealer={setSelectedDealer}/>
        </div>
        }

        <div className="bg-stone-500 w-fit h-screen">
          <GamesList/>
        </div>

      </div>
  )
}

export default App
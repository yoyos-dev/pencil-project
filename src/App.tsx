import AddDealer from "./AddDealer"
import GamesList from "./GamesList"
import DealerPool from "./DealerPool"
import DealerInfo from "./DealerInfo"
import { useState } from 'react';
import { Dealer } from "./types";

function App() {
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);

  return (
      <div className="bg-slate-500 h-screen grid grid-flow-col">
      
        <div className="bg-stone-500 w-fit h-screen mx-auto">
          <AddDealer/>
          <DealerPool selectedDealer={selectedDealer} setSelectedDealer={setSelectedDealer}/>
        </div>

        {selectedDealer && 
        <div className="bg-stone-500 w-fit h-screen mx-auto">
          <DealerInfo selectedDealer={selectedDealer} setSelectedDealer={setSelectedDealer}/>
        </div>
        }

        <div className="bg-stone-500 w-fit h-screen mx-auto">
          <GamesList/>
        </div>

      </div>
  )
}

export default App
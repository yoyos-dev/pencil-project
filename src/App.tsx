import AddDealer from "./AddDealer"
import GamesList from "./GamesList"
import DealerPool from "./DealerPool"

function App() {
  return (
      <div className="bg-slate-500 h-screen grid grid-flow-col">
      
        <div className="bg-stone-500 w-fit h-screen mx-auto">
          <AddDealer/>
          <DealerPool/>
        </div>

        <div className="bg-stone-500 w-fit h-screen mx-auto">
          <GamesList/>
        </div>

      </div>
  )
}

export default App
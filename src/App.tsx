import AddDealer from "./AddDealer"
import GamesList from "./GamesList"

function App() {
  return (
      <div className="bg-slate-500 h-screen grid grid-flow-col">
      
        <div className="bg-stone-500 w-fit h-screen mx-auto">
          <AddDealer/>
        </div>

        <div className="bg-stone-500 w-fit h-screen mx-auto">
          <GamesList/>
        </div>

      </div>
  )
}

export default App
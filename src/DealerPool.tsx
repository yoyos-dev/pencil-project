import { useState, useEffect } from "react";
import { Dealer } from "./types";

type Dealers = {
    [key: string]: Dealer;
};

interface DealerPoolProps {
    selectedDealer: Dealer | null;
    setSelectedDealer: (dealer: Dealer | null) => void;
  }

  const DealerPool: React.FC<DealerPoolProps> = ({ setSelectedDealer }) => {
    const [dealers, setDealers] = useState<Dealers>({});

    useEffect(() => {
        const handleDealersList = (dealersList: Dealers) => {
            setDealers(dealersList);
        };
        const handleDealersUpdated = () => {
            window.api.request('readDealers');
          };

        window.api.request('readDealers');
        window.api.on('dealersList', handleDealersList);
        window.api.on('dealerAdded', handleDealersUpdated);

        return () => {
            window.api.remove('dealersList', handleDealersList);
            window.api.remove('dealerAdded', handleDealersUpdated);
        };
    }, []);

    return (
        <>
            <h1 className="text-white text-2xl bg-slate-700 text-center p-2">
                Dealer Pool
            </h1>
            <div className="grid grid-flow-row m-3 gap-3">
            {Object.entries(dealers)
                .sort((a, b) => a[1].firstName.localeCompare(b[1].firstName))
                .map(([_key, value], index) => (
                     <button 
                        key={index} 
                        onClick={() => setSelectedDealer(value)}
                        className='bg-slate-200 w-full rounded py-1 px-3 mx-auto focus:bg-yellow-300'>
                            {value.firstName + " " + value.lastName}
                    </button>
                ))}
            </div>
        </>
    )
}
export default DealerPool;
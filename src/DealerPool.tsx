import { useState, useEffect } from "react";
import { Dealer } from "./types";

type Dealers = {
    [key: string]: Dealer;
};

interface DealerPoolProps {
    selectedDealer: Dealer | null;
    setSelectedDealer: (dealer: Dealer | null) => void;
  }

  const DealerPool: React.FC<DealerPoolProps> = ({ selectedDealer, setSelectedDealer }) => {
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
        window.api.on('dealerDeleted', handleDealersUpdated);
        window.api.on('dealerUpdated', handleDealersUpdated);
        return () => {
            window.api.remove('dealersList', handleDealersList);
            window.api.remove('dealerAdded', handleDealersUpdated);
            window.api.remove('dealerDeleted', handleDealersUpdated);
            window.api.remove('dealerUpdated', handleDealersUpdated);
        };
    }, []);

    useEffect(() => {
        if (selectedDealer && dealers[selectedDealer.badgeNum]) {
            setSelectedDealer(dealers[selectedDealer.badgeNum]);
        }
    }, [dealers, selectedDealer, setSelectedDealer]);

    return (
        <>
            <h1 className="text-white text-2xl bg-slate-700 text-center p-2">
                Dealer Pool
            </h1>
            <div className="bg-stone-400 pt-1 pb-1 flex-grow overflow-auto">
                <div className="grid grid-flow-row m-3 gap-3">
                {Object.entries(dealers)
                    .sort((a, b) => a[1].firstName.localeCompare(b[1].firstName))
                    .map(([_key, value], index) => (
                        <button 
                            key={index} 
                            onClick={() => setSelectedDealer(value === selectedDealer ? null : value)}
                            className={`bg-slate-200 w-full rounded py-1 px-3 mx-auto ${value === selectedDealer ? 'bg-yellow-300' : ''}`}>
                                {value.firstName + " " + value.lastName + " " + value.badgeNum}
                        </button>
                    ))}
                </div>
            </div>
        </>
    )
}
export default DealerPool;
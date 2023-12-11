import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState, useEffect } from "react";

const schema = yup.object({
    firstName: yup.string().required("Please Input First Name"),
    lastName: yup.string().required("Please Input Last Name"),
    badgeNum: yup.string().required("Please Input Badge Number"),
    startTime: yup.string().optional(),
    endTime: yup.string().optional(),
    games: yup.lazy((value) => 
    yup.object().shape(
        Object.keys(value || {}).reduce((shape: Record<string, any>, key) => {
            shape[key] = yup.boolean();
            return shape;
        }, {})
    )),
});

interface DealerData {
    firstName: string;
    lastName: string;
    badgeNum: string;
    startTime?: string;
    endTime?: string;
    games: Record<string, boolean>
}

const AddDealer = () => {
    const [games, setGames] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const { register, handleSubmit, formState, reset} = useForm( {
        resolver: yupResolver(schema) });

    const { errors } = formState;

    useEffect(() => {
        const handleGamesList = (gamesList: string[]) => {
            setGames(gamesList);
        };

        const handleGamesSaved = (gamesList: string[]) => {
            setGames(gamesList);
        };
    
        window.api.request('readGames');
        window.api.on('gamesList', handleGamesList);
        window.api.on('gamesSaved', handleGamesSaved);
    
        return () => {
            window.api.remove('gamesList', handleGamesList);
            window.api.remove('gamesSaved', handleGamesSaved);
        };
    }, []);

    const handleSave = (dealerData: DealerData) => {
        window.api.send('writeDealer', dealerData);
        window.api.send('addDealer', dealerData);
        reset();
    };
    
    return(
        <>
            <h1 onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl bg-slate-700 text-center p-2">
                Add Dealers
            </h1>

            <form onSubmit={handleSubmit(handleSave)} className={`collapsible-content ${isOpen ? 'open' : 'closed'} bg-stone-400 p-4 rounded grid gap-y-4`}>
                <div>
                    <span>Name:</span>
                    <span className="text-red-700">*</span>
                    
                    <div className="flex flex-row gap-4">
                        <input className="w-full" {...register("firstName")} placeholder="First" />
                        <input className="w-full" {...register("lastName")} placeholder="Last" />
                    </div>

                    <div className="grid grid-flow-row grid-cols-2 gap-x-4">
                        <div className="text-red-700">{errors.firstName?.message}</div>
                        <div className="text-red-700">{errors.lastName?.message}</div>
                    </div>
                </div>

                <div>
                    <span>Badge Number:</span>
                    <span className="text-red-700">*</span>
                    
                    <div className="flex flex-row gap-4">
                        <input className="w-full" {...register("badgeNum")} placeholder="x######"/>
                    </div>
                </div>
                
                <div>
                    <div className="grid grid-flow-row grid-cols-2 gap-x-4">
                        <span>Start Time:</span>
                        <span>End Time:</span>
                    </div>
                    
                    <div className="flex flex-row gap-4">
                        <input className="w-full" type="time" {...register("startTime")}/>
                        <input className="w-full" type="time" {...register("endTime")}/>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {games.map((game, index) => (
                        <div key={index}>
                            <input {...register(`games.${game}`)} type="checkbox" id={`addDealer.${game}`} />
                            <label htmlFor={`addDealer.${game}`}>{game}</label>
                        </div>
                    ))}
                </div>

                <button className='bg-slate-200 w-fit rounded py-1 px-3 mx-auto' type="submit">Add Dealer</button>
            </form>
        </>
    )
}

export default AddDealer;
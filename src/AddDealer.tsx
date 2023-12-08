import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState, useEffect } from "react";

const schema = yup.object({
    firstName: yup.string().required("Please Input First Name"),
    lastName: yup.string().required("Please Input Last Name"),
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
    startTime?: string;
    endTime?: string;
    games: Record<string, boolean>
}

const AddDealer = () => {
    const [games, setGames] = useState<string[]>([]);

    const { register, handleSubmit, formState } = useForm( {
        resolver: yupResolver(schema) });

    const { errors } = formState;

    useEffect(() => {
        const handleGamesList = (gamesList: string[]) => {
            setGames(gamesList);
        };
    
        window.api.request('readGames');
        window.api.on('gamesList', handleGamesList);
    
        return () => {
            window.api.remove('gamesList', handleGamesList);
        };
    }, []);

    const handleSave = (dealerData: DealerData) => {
        window.api.send('writeDealer', dealerData);
    };
    
    return(
        <>
            <h1 className="text-white text-2xl bg-slate-700 text-center p-2">
                Add Dealers
            </h1>

            <form onSubmit={handleSubmit(handleSave)} className="bg-stone-400 p-4 rounded grid gap-y-4 max-w-screen-md">
                <div>
                    <span>Name:</span>
                    <span className="text-red-700">*</span>
                    
                    <div className="flex flex-row gap-4">
                        <input {...register("firstName")} placeholder="First" />
                        <input {...register("lastName")} placeholder="Last" />
                    </div>

                    <div className="grid grid-flow-row grid-cols-2 gap-x-4">
                        <div className="text-red-700">{errors.firstName?.message}</div>
                        <div className="text-red-700">{errors.lastName?.message}</div>
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

                {games.map((game, index) => (
                    <div key={index}>
                        <input {...register(`games.${game}`)} type="checkbox" id={game} />
                        <label htmlFor={game}>{game}</label>
                    </div>
                ))}

                <button className='bg-slate-200 w-fit rounded py-1 px-3 mx-auto' type="submit">Add Dealer</button>
            </form>
        </>
    )
}

export default AddDealer;
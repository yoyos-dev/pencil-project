import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState, useEffect } from "react";
import { Dealer } from "./types";

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

interface DealerInfoProps {
    selectedDealer: Dealer;
    setSelectedDealer: React.Dispatch<React.SetStateAction<Dealer | null>>;
}

const DealerInfo: React.FC<DealerInfoProps> = ({ selectedDealer }) => {
    const [games, setGames] = useState<string[]>([]);

    const { register, formState, reset } = useForm( {
        resolver: yupResolver(schema),
        defaultValues: {
            ...selectedDealer,
            games: selectedDealer.games ?? {}
        }
    });
    
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

    useEffect(() => {
        reset(selectedDealer);
        console.log(selectedDealer);
    }, [selectedDealer, reset]);

   return (
        <>
        <h1 className="text-white text-2xl bg-slate-700 text-center p-2">
            Dealer Info
        </h1>
        {selectedDealer && (
            <div className='p-3 bg-slate-300 grid gap-y-4 max-w-screen-md'>
                <div>
                    <span>Name:</span>
                    <span className="text-red-700">*</span>
                    
                    <div className="flex flex-row gap-4">
                        <input {...register("firstName")} placeholder="First" />
                        <input {...register("lastName")} placeholder="Last" />
                    </div>

                    <div className="grid grid-flow-row grid-cols-2 gap-x-4">
                        <div className="text-red-700">{String(errors.firstName?.message || '')}</div>
                        <div className="text-red-700">{String(errors.lastName?.message || '')}</div>
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
                        <input {...register(`games.${game}`)} type="checkbox" id={game}/>
                        <label htmlFor={game}>{game}</label>
                    </div>
                ))}
            </div>
        )}
        <div className='grid grid-flow-col justify-center gap-10 m-3'>
            <button className='bg-slate-200 w-fit rounded py-1 px-3 mx-auto'>Delete Dealer</button>
            <button className='bg-slate-200 w-fit rounded py-1 px-3 mx-auto'>Save Changes</button>
        </div>
        </>
   )
}

export default DealerInfo;
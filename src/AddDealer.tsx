import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
    firstName: yup.string().required("Please Input First Name"),
    lastName: yup.string().required("Please Input Last Name"),
    startTime: yup.string().optional(),
    endTime: yup.string().optional(),
    
});

interface DealerData {
    firstName: string;
    lastName: string;
    startTime?: string;
    endTime?: string;
}

const AddDealer = () => {
    const { register, handleSubmit, formState } = useForm( {
        resolver: yupResolver(schema) });

    const { errors } = formState;

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


                <button className='bg-slate-200 w-fit rounded py-1 px-3 mx-auto' type="submit">Add Dealer</button>
            </form>
        </>
    )
}

export default AddDealer;
import { useState, useEffect, useRef } from 'react'

const GamesList = () => {
    const [games, setGames] = useState<string[]>([]);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }

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

    useEffect(() => {
        adjustTextareaHeight();
    }, [games]);

    const handleGames = (text: React.ChangeEvent<HTMLTextAreaElement>) => {
        var gamesList = text.target.value.split("\n");
        setGames(gamesList);
    
        gamesList = gamesList.filter(Boolean);
        window.api.send('writeGames', gamesList);
        adjustTextareaHeight();
    }

    return (
        <>
            <h1 className="text-white text-2xl bg-slate-700 text-center p-2">
                Game List
            </h1>

            <div className='grid gap-y-4 max-w-screen-md'>
                <textarea ref={textareaRef} rows={4} onChange={handleGames} value={games.join("\n")} className="bg-white p-2 h-fit resize-none w-full" placeholder="Blackjack&#10;Poker&#10;Baccarat&#10;etc..."/>
                <button className='bg-slate-200 w-fit rounded py-1 px-3 mx-auto'>Save</button>
            </div>
       </>
    )
}

export default GamesList;
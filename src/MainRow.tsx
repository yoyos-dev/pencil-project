import { useState, useEffect} from 'react';

function MainRow() {
    const [tables, setTables] = useState<Record<string, Record<string, string>>>({});

    useEffect(() => {
        const handleTablesList = (tablesList: Record<string, Record<string, string>>) => {
            setTables(tablesList);
        };

        window.api.request('readTables');
        window.api.on('tablesList', handleTablesList);

        return () => {
            window.api.remove('tablesList', handleTablesList);
        };
    }, []);

    return (
        <div className={`w-full grid grid-cols-3 ${Object.keys(tables).length > 6 ? 'overflow-auto h-screen' : ''}`}>
            {Object.entries(tables).map(([pitName, tables], pitIndex) => (
                <div key={pitIndex} className="w-full flex flex-col items-center bg-white" style={{ height: '50vh' }}>
                    <div contentEditable className='w-full text-white text-2xl bg-slate-700 text-center p-2'>{pitName}</div>
                    <div className='border border-slate-200 w-full h-full'>
                      {Object.entries(tables).map(([tableName, dealer], tableIndex) => (
                          <div key={tableIndex} className='flex flex-row gap-2 w-full p-2'>
                              <div contentEditable className="bg-slate-200 min-w-fit py-1 px-3 mx-auto rounded p-1">{tableName}</div>
                              <button className='bg-slate-200 w-full rounded py-1 px-3 mx-auto p-1'>{dealer}</button>
                          </div>
                      ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MainRow;
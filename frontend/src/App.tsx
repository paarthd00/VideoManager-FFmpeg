import { useState } from 'react';
import './App.css';
import { GetPresignedUrl } from "../wailsjs/go/main/App";
import axios from 'axios';
import { Button } from '@mui/material';
import MiniDrawer from './components/drawer';
import { PlayArrow } from '@mui/icons-material';
function App() {
    const [file, setFile] = useState<File | undefined>();
    const updateName = (e: any) => {
        console.log(e.target.files)
        setFile(e.target.files[0]);
    }
    const updateResultText = async (result: string) => {
        await axios.put(result, file);
    }

    function uploadFile() {
        GetPresignedUrl({
            name: file?.name,
            size: file?.size,
            type: file?.type
        }).then(updateResultText);
    }

    return (
        <div
            className="flex flex-col items-center justify-center w-[100%] h-[100%] bg-gray-900"
            id="App">
            <MiniDrawer />
            <div className='flex w-[100%] justify-center flex-col items-center gap-2'>
                <input id="name" className="input py-[4] text-white" onChange={updateName} autoComplete="off" name="input" type="file" />
                <Button
                    className='flex items-center justify-center'
                    variant="contained" onClick={uploadFile}>
                    <span
                        className='m-0 p-0'
                    >Upload</span>
                    <PlayArrow />
                </Button>
            </div>
        </div>
    )
}

export default App

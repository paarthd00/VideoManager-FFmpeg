import { useState } from 'react';
import './App.css';
import { GetPresignedUrl } from "../wailsjs/go/main/App";
import axios from 'axios';
import { Button } from '@mui/material';
import MiniDrawer from './components/drawer';
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
        <div id="App">
            <MiniDrawer />
            <input id="name" className="input py-[4]" onChange={updateName} autoComplete="off" name="input" type="file" />
            <Button variant="contained" onClick={uploadFile}>Upload</Button>
        </div>
    )
}

export default App

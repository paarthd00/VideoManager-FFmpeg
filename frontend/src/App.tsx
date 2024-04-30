import { useState } from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';
import { Greet } from "../wailsjs/go/main/App";
import axios from 'axios';
import { Button } from '@mui/material';
function App() {
    const [file, setFile] = useState<File | undefined>();
    const updateName = (e: any) => {
        console.log(e.target.files)
        setFile(e.target.files[0]);
    }
    const updateResultText = async (result: string) => {
        await axios.put(result, file);
    }

    function greet() {
        Greet({
            name: file?.name,
            size: file?.size,
            type: file?.type
        }).then(updateResultText);
    }

    return (
        <div id="App">
            {/* <img src={logo} id="logo" alt="logo" /> */}
            <div id="input" className="input-box">
                <input id="name" className="input py-[4]" onChange={updateName} autoComplete="off" name="input" type="file" />
                <Button variant="contained" onClick={greet}>Greet</Button>
            </div>
        </div>
    )
}

export default App

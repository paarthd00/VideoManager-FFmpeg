import { useState } from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';
import { Greet } from "../wailsjs/go/main/App";
import axios from 'axios';
function App() {
    const [resultText, setResultText] = useState("Please enter your name below 👇");
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
            <img src={logo} id="logo" alt="logo" />
            <div id="result" className="result">{resultText}</div>
            <div id="input" className="input-box">
                <input id="name" className="input" onChange={updateName} autoComplete="off" name="input" type="file" />
                <button className="btn" onClick={greet}>Greet</button>
            </div>
        </div>
    )
}

export default App

import { useState } from 'react';
import './App.css';
import { GetPresignedUrl, GetAssets } from "../wailsjs/go/main/App";
import axios from 'axios';
import { Button } from '@mui/material';
import MiniDrawer from './components/drawer';
import { PlayArrow } from '@mui/icons-material';
import { useEffect } from 'react';

type Video = {
    Title: string;
    Source: string;
    Size: number;
    Type: string;
    Thumbnail: string;
}

function App() {
    const [file, setFile] = useState<File | undefined>();
    const [videos, setVideos] = useState<Video[] | undefined>();
    const updateName = (e: any) => {
        setFile(e.target.files[0]);
    }
    const updateResultText = async (result: string) => {
        await axios.put(result, file);
        GetAssets().then((res) => {
            setVideos(res)
        })
    }

    useEffect(() => {
        GetAssets().then((res) => {
            setVideos(res)
        })
    }, [])

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
            <div className='flex w-[100%] justify-center items-center gap-2'>
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
            <div className="flex flex-col items-center justify-center gap-2 py-4">

                {
                    videos?.map((video, index) => {
                        return (
                            <div key={index} className="flex items-center justify-center gap-2">
                                <video
                                    src={video.Source}
                                    controls
                                    width="150"
                                    height="150"
                                    className="rounded-lg"
                                ></video>
                                <div className='flex flex-col gap-2'>
                                    <p className="text-white">{video.Title}</p>
                                    <p className="text-white">{video.Size / 1000000}mb</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default App

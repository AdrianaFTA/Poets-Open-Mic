import React, {useState} from 'React';
import { createPoem } from '../services/poemService';

export default function Editor(){
    const[content, setContent] = useState("");
    const[title, setTitle] = useState("");
    const token = localStorage.getItem("token");//retrieved after login

    const handleSave = async () => {
        const result = await createPoem({title, content}, token);
        console.log(result);
    };
    return (
        <div className="p-4">
            <input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Poem Title"
            className="border p-2 w-full mb-2"
            />
            <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your poem here ..."
            className="border p-2 w-full h-40"
            />
            <button onClick={handleSave} className="big-blue-500 text-white p-2 mt-2"
            Save Poem 
            </button>
        </div>
    );
}
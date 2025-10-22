import React, {useState} from 'React;
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'ReactQuill';

export default function Editor(){
    const [content, setContent] = useState('');
    return (
        <div classname="p-4">
            <ReactQuill value={content} onChange={setContent} />
        </div>
    );
}
const startDictation =() => {
    const recognition = new.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-uk';
    recognition.onresult = (event) => {
        const text = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
    setContent(prev => prev +' '+ text);
    };
    recognition.startDictation();
};

<button onClick = {startDictation}>Start Dictation</button>


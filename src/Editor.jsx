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

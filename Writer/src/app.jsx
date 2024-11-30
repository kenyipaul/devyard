import Axios from "axios"
import Quill from "quill"
import "./sass/main.scss";
import "quill/dist/quill.snow.css";

import { useRef, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"

export default function App() {
    return (
        <>  
            <Router>
                <Routes>
                    <Route path="/" element={ <Outliner /> }  />
                    <Route path="/writer" element={<Writer />} />
                </Routes>
            </Router>
        </>
    )
}

function Outliner() {
    const fileRef = useRef();
    const topicRef = useRef();
    const descriptionRef = useRef();
    const [fileName, setFileName] = useState("Choose an image")

    const navigate = useNavigate();

    const saveOutline = () => {
        const topic = topicRef.current.value;
        const description = descriptionRef.current.value;
        const coverImage = fileRef.current.files[0];
        
        if (topic !== "" && coverImage !== undefined) {
            const reader = new FileReader();

            reader.onload = () => {
                let outline = {
                    topic,
                    description,
                    coverImage: reader.result
                }

                try {
                    sessionStorage.setItem("_blog", JSON.stringify(outline))
                    navigate("/writer")
                } catch({name, message}) {
                    if (name == "QuotaExceededError") {
                        alert("Preview image too large")
                    }
                }
            }
            reader.readAsDataURL(coverImage);
            
        } else {
            alert("Please fill in the form")
        }
    }

    return (
        <div className="form-wrapper">
            <form action="#">
                <h1>Blog Post Outline</h1>
                <p>Basic information about the blog and a cover image to be used for the blog.</p>
            
                <div className="input-area">
                    <label htmlFor="topic">Topic</label>
                    <input ref={topicRef} type="text" name="topic" id="topic" placeholder="e.g Getting started with web development" />
                </div>
                <div className="input-area">
                    <label htmlFor="description">Description</label>
                    <textarea ref={descriptionRef} name="description" id="description" placeholder="Brief introduction to the topic mentioned above"></textarea>
                </div>
                <div className="input-area">
                    <p className="label">Preview</p>
                    <label htmlFor="file">{fileName}</label>
                    <input ref={fileRef} type="file" onChange={(e) => setFileName(e.target.files[0].name)} id="file" accept="image/png,image/jpg,image/jpeg" />
                </div>
                <button type="button" onClick={saveOutline}>Next</button>
            </form>
        </div>
    )
}






function Writer() {
    const navigate = useNavigate();

    useEffect(() => {

        new Quill("#editor", {
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike', {'script': 'sub'}, {'script': 'super'}],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }, {'align': []}],
                    ['link', 'formula'],
                    ['blockquote', 'code-block'],
                    ['clean'],
                ]
            },
            // placeholder: 'Compose an epic...',
            placeholder: "",
            theme: 'snow' // or 'bubble'
        })

    }, [])

    const upload = () => {
        let outline = sessionStorage.getItem("_blog")

        if (outline == null) {
            navigate("/")
        } else {
            outline = JSON.parse(outline)

            let base64String = outline.coverImage;

            const byteString = atob(base64String.split(',')[1]);
            const arrayBuffer = new ArrayBuffer(byteString.length);
            const intArray = new Uint8Array(arrayBuffer);
            for (let   
            i = 0; i < byteString.length; i++) {
                intArray[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([intArray], { type: 'image/png'   
            });

            
            const formData = new FormData();
            // formData.append("title", outline.topic)
            // formData.append("description", outline.description)
            // formData.append("cover", blob, outline.coverImage)
            formData.append("title", "1")
            formData.append("description", "1")
            formData.append("cover", "1")
            formData.append("body", "1")
            
            Axios({
                method: 'POST',
                url: "https://murmasan.pythonanywhere.com/post/created/",
                headers: {
                    "Content-Type": "multipart/form-data",
                    // Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMyMTkxNjI1LCJpYXQiOjE3MzIxODk4MjUsImp0aSI6ImQyN2QyYzc0NGU2YTQyYTI4MGViNTRmYjdiY2EzYzc2IiwidXNlcl9pZCI6MX0.njSGWnMvFVNh_w_I_4J41fYHRdgOJ5Rzg7Beuefqx8Y",
                },
                data: formData,
            }).then((response) => {
                console.log(response.data)
            })
        }
    }

    return (
        <div className="writer-container">
            <div className="navbar">
                <button onClick={() => navigate("/")}><svg width="24" height="24" viewBox="0 0 1024 1024" className="icon" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M224 480h640a32 32 0 110 64H224a32 32 0 010-64z"/><path fill="#000000" d="M237.248 512l265.408 265.344a32 32 0 01-45.312 45.312l-288-288a32 32 0 010-45.312l288-288a32 32 0 1145.312 45.312L237.248 512z"/></svg>Back</button>
                <button onClick={upload}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>Publish</button>
            </div>
            <div id="editor"></div>
        </div>
    )
}
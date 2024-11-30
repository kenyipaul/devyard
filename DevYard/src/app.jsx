import "./sass/main.scss";
import Axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

export default function App() {

    const [response, setResponse] = useState([])

    useEffect(() => {
        Axios({
            method: 'GET',
            url: "https://murmasan.pythonanywhere.com/posts/",
            headers: {
                Authorization: "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMyMDI4Njg0LCJpYXQiOjE3MzIwMjY4ODQsImp0aSI6ImExMDZjNDFlZTZmZjRhOGI4NWQ5M2Y5N2ExYjgxMzk5IiwidXNlcl9pZCI6MX0.-NnYQ8Z-7VstLf5Ry5_5HXS4usSUGI4tcIZSevByGx0"
            }
        }).then((response) => {
            console.log(response.data)
            setResponse(response.data)
        })

    }, [])

    return (
        <div id="app">
        
            <div className="navbar">
                <nav>
                    <section>
                        <h1>DevYard</h1>
                    </section>

                    <section>
                        <ul>
                            <li>Home</li>
                            <li>Explore</li>
                            <li>Bookmarks</li>
                            <li>About</li>
                        </ul>
                        <div className="buttons">
                            <button>Log in</button>
                            <button>Sign up</button>
                        </div>
                        <svg className="menuBtn" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clipPath="url(#clip0_429_11066)"> <path d="M3 6.00092H21M3 12.0009H21M3 18.0009H21" stroke="#292929" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/> </g> <defs> <clipPath id="clip0_429_11066"> <rect width="24" height="24" fill="white" transform="translate(0 0.000915527)"/> </clipPath> </defs> </svg>
                    </section>
                </nav>
            </div>

            <div className="blog-post-container">

                {
                    response.map((data, key) => {
                        return <BlogPost key={key} data={data} />
                    })
                }
                
            </div>

        </div>
    )
}



function BlogPost(props) {
    return (
        <div className="post">
            <div className="banner" style={{ backgroundImage: props.data.cover }}></div>
            <div className="content">
                <h1>{props.data.title}</h1>
                <p>Most-shared stories, first-person perspectives, and Boosted stories from new writers</p>
                <div className="profile">
                    <div className="cover"></div>
                    <div className="info">
                        <h2>Jane Doe</h2>
                        <p>{props.data.created_at}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
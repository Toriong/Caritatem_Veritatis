import React, { useState, useContext } from 'react'
import { UserInfoContext } from '../provider/UserInfoProvider'
import { handleKeyDown } from './functions/handleKeyDown'
import ReactPlayer from 'react-player'
import '../blog-css/videoEmbedded.css'

const VideoEmbedded = ({ _id }) => {
    const { _blogPost } = useContext(UserInfoContext);
    const [blogPost, setBlogPost] = _blogPost;
    const [path, setPath] = useState("");
    const [didUserSubmitInput, setDidUserSubmitInput] = useState(false);

    const handleChange = (event) => {
        event.preventDefault();
        setPath(event.target.value);
    }



    // show the video link after the user deletes any input above 
    return (
        didUserSubmitInput ?
            <section className="videoInputContainer video">
                <ReactPlayer
                    url={path}
                />
            </section>
            :
            <section className="videoInputContainer">
                <input type="text"
                    id={_id}
                    placeholder="Link to embed video content and press enter"
                    value={path}
                    onChange={handleChange}
                    onKeyDown={event => handleKeyDown(event, blogPost, setBlogPost, setDidUserSubmitInput)}
                />
            </section>
    )
}



export default VideoEmbedded

import React, { useState, useEffect, useContext } from 'react'
import { MdCancel } from "react-icons/md";
import { AiOutlineConsoleSql } from 'react-icons/ai';
import { CgArrowsExpandDownLeft } from 'react-icons/cg';
import { UserInfoContext } from '../provider/UserInfoProvider'
import '../blog-css/dragAndDropImage.css'

const DragAndDropImage = ({ _setWillDataBeSaved }) => {
    const { _blogPost } = useContext(UserInfoContext);
    const [blogPost, setBlogPost] = _blogPost;
    const [isMouseOver, setIsMouseOver] = useState(false);

    const handleMouseOver = event => {
        event.preventDefault()
        console.log("hello there")
        setIsMouseOver(true)
    }
    const handleMouseLeave = event => {
        event.preventDefault()
        setIsMouseOver(false)
    }

    const uploadImage = files => {
        const files_ = files.target ? files.target.files : files;
        // how does a for loop work with an object?
        for (let image of files_) {
            // FileReader is async
            let reader = new FileReader();
            reader.readAsDataURL(image);
            reader.addEventListener("load", () => {
                let _image = {
                    name: image.name,
                    src: reader.result
                };
                localStorage.setItem("introPic", JSON.stringify(_image));
                setBlogPost({
                    ...blogPost,
                    introPic: _image
                });
            });
        };
        _setWillDataBeSaved(true);
    }
    const handleDrop = event => {
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer.files;
        uploadImage(files);
    };

    const deleteImage = event => {
        event.preventDefault();
        setBlogPost({
            ...blogPost,
            introPic: null
        });
        localStorage.removeItem("introPic");
        _setWillDataBeSaved(true);

    };




    return (
        <div
            className="dropAreaBlogPost"
            style={{
                "border": (blogPost.introPic && blogPost.introPic.src) ? "none" : isMouseOver && "dashed 1.5px #c0c0c0",
                "cursor": (blogPost.introPic && blogPost.introPic.src) && "default",
                "transition": "1s"
            }}
        >

            {(blogPost.introPic && blogPost.introPic.src) ?
                <>
                    <div className="overlayDragAndDrop">
                        <MdCancel id="blogImageInserted" onClick={deleteImage} />
                        <img
                            src={blogPost.introPic.src}
                            alt={blogPost.introPic.name ?? JSON.parse("introPic").name}
                        />
                    </div>
                </>
                :
                <>
                    <p style={{ "font-style": isMouseOver ? "italic" : "normal" }}>Include an intro pic to attract more readers</p>
                    <input
                        name="imageUpload"
                        type="file"
                        onDrop={handleDrop}
                        onMouseOver={handleMouseOver}
                        onMouseLeave={handleMouseLeave}
                        onChange={event => { uploadImage(event) }}
                    />
                </>
            }

        </div>
    )
}

export default DragAndDropImage

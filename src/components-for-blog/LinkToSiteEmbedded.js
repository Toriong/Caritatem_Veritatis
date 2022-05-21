import React, { useRef, useState, useContext, useEffect } from 'react'
import { UserInfoContext } from '../provider/UserInfoProvider'
import axios from 'axios'


const LinkToSiteEmbedded = ({ _section, wasInputDeleted, setWasInputDeleted }) => {
    const { _blogPost } = useContext(UserInfoContext);
    const [blogPost, setBlogPost] = _blogPost;
    const [isEmbeddedLinkShown, setIsEmbeddedLinkShown] = useState(false);
    const [data, setData] = useState(null);
    const linkPreviewUrlKey = 'b55123bc9566ac7f2fce45d6d668b413';

    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            const url = 'https://api.linkpreview.net';

            axios.post(url, {
                q: event.target.value,
                key: linkPreviewUrlKey
            }).then(res => {
                setData(res.data)
            });
        }
    }

    // store the image info into its object
    useEffect(() => {
        if (data) {
            const body_ = blogPost.body.map(section => {
                if (section.id === _section.id) {
                    return {
                        ...section,
                        ...data
                    }
                }
                return section;
            })
            setBlogPost({
                ...blogPost,
                body: body_
            })
        }
        console.log(blogPost);
    }, [data])

    useEffect(() => {
        if (wasInputDeleted) {
            const _data = blogPost.body.find(section => section.id === _section.id);
            setData(_data);
            setWasInputDeleted(false);
            console.log(data)
        }
    }, [blogPost.body, wasInputDeleted]);

    useEffect(() => {
        console.log(data);
    })


    return (
        data ?
            <section className="videoInputContainer">
                <div
                    className="embeddedLink"
                    id={_section.id}
                    name={_section.type}
                    title={_section.type}

                >
                    <div>
                        <h3>{data.title}</h3>
                        <p>{data.description}</p>
                    </div>
                    <div>
                        <a href={data.url}>
                            <img src={data.image} alt={`link_to_${data.title}`} />
                        </a>
                    </div>
                </div>
            </section>
            :
            <section className="videoInputContainer">
                <input
                    type="text"
                    onKeyDown={event => handleKeyDown(event, blogPost, setBlogPost, setIsEmbeddedLinkShown)}
                    placeholder={"Link to external to site and press enter"}
                />
            </section>
    )
}

export default LinkToSiteEmbedded;

import React from 'react';
import '../blog-css/quotation.css';

const Quotation = ({ section, handleChange }) => {
    return (
        <input
            name={section.type}
            id={section.id}
            className="inputQuotation"
            cols="30"
            rows="1"
            value={section.data}
            onChange={event => {
                handleChange(event)
            }}
            style={{
                height: "fit-content"
            }}
            // onKeyDown={handleDelete}
            // onClick={getTarget}
            placeholder="What's on your mind?"
            defaultValue={section.data ? section.data : ""}
        />
    )
}

export default Quotation

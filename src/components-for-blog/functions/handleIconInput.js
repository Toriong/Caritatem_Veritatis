

export const handleIconInput = (event, setData, setIconSrc, data) => {
    event.preventDefault();
    event.stopPropagation();
    console.log(event.target.files[0]);
    const { files } = event.target;
    console.log('uploading file')
    for (let image of files) {
        let reader = new FileReader();
        reader.readAsDataURL(image);
        reader.addEventListener("load", () => {
            console.log(reader.result)
            setIconSrc(reader.result)
        });
    };
    if (data) {
        setData({
            ...data,
            icon: event.target.files[0]
        })
    } else {
        setData(event.target.files[0])
    }
};
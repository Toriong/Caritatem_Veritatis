

export const getPhilosophyQuotes = async () => {
    try {
        const url = 'https://philosophy-quotes-api.glitch.me/quotes/philosophy/Stoicism'
        const promise = await fetch(url);
        // what is the await doing for the promise
        const data = await promise.json();

        return data;
    } catch (error) {
        console.log("Error message: " + error)
    }
}






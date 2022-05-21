import history from "../../../history/history";
import { getSearchResults } from "../getSearchResults";


export const takeUserToTag = (vals, fns) => {
    const { topic } = vals ?? {};
    const { setSearchInput, setWasAllTagBtnClick } = fns;
    topic ? setSearchInput(topic) : setWasAllTagBtnClick(true)
    history.push('/search/tags');
}



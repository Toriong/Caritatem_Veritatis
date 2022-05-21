import history from "../../history/history";
import { getSearchResults } from "./getSearchResults";



export const goToSearchPageClick = (event, fns, searchInput, searchType) => {
    const { closeSearchResults, setSearchResults } = fns;
    closeSearchResults();
    history.push(`/search/${searchType ?? event.target.name}`)
}

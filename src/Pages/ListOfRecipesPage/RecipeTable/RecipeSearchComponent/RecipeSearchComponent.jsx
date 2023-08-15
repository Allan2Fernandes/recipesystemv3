import "./RecipeSearchComponent.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";


function RecipeSearchComponent(props){

    function handleChangeSearchPhrase(event){
        props.setSearchkeyWord(event.target.value)
    }

    return (
        <div id={"RecipeSearchComponentMainDiv"}>
            <FontAwesomeIcon icon={faSearch}/>
            <input id={"RecipeSearchInput"} value={props.searchKeyWord} onChange={(event) => handleChangeSearchPhrase(event)}/>
        </div>
    )
}

export default RecipeSearchComponent
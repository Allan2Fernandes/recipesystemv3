import "./RecipeSearchComponent.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";


function RecipeSearchComponent(props){

    function handleChangeSearchPhrase(event){
        props.setSearchkeyWord(event.target.value)
    }

    return (
        <div id={"RecipeSearchComponentMainDiv"}>
            <div id={"SearchDiv"}>
                <FontAwesomeIcon id={"SearchIcon"} icon={faSearch}/>
                <input id={"RecipeSearchInput"} value={props.searchKeyWord} onChange={(event) => handleChangeSearchPhrase(event)}/>
            </div>

            <div id={"DisabledDiv"}>
                <input type={"checkbox"} checked={props.showDisabledRecipes} onChange={props.handleChangeShowDisabledRecipes}/>
                <label id={"DisabledLabel"}>Show disabled recipes</label>
            </div>
        </div>
    )
}

export default RecipeSearchComponent
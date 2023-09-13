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
            <div>
                <label>Show disabled recipes</label>
                <input type={"checkbox"} checked={props.showDisabledRecipes} onChange={props.handleChangeShowDisabledRecipes}/>
            </div>
        </div>
    )
}

export default RecipeSearchComponent
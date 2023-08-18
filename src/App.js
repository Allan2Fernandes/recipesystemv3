import './App.css';
import {
  BrowserRouter as Router,
  Routes ,
  Route,
  Link
} from "react-router-dom";
import LoginPage from "./Pages/LoginPage/LoginPage";
import ListOfRecipesPage from "./Pages/ListOfRecipesPage/ListOfRecipesPage";
import RecipeStepsPage from "./Pages/RecipeStepsPage/RecipeStepsPage";
import ShelfSetupPage from "./Pages/ShelfSetupPage/ShelfSetupPage";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Routes>
            <Route path={"/"} element={<LoginPage/>}/>
            <Route path={"/ListOfRecipesPage"} element={<ListOfRecipesPage/>}/>
            <Route path={"/RecipeStepsPage/RecipeSetID/:recipeSetID/RecipeName/:recipeName/UrlSelectedStepIndex/:urlSelectedStepIndex/ReadOnly/:readOnly"} element={<RecipeStepsPage/>}/>
            <Route path={"/ShelfSetupPage"} element={<ShelfSetupPage/>}/>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;

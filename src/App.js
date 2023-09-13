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
import ManageUsersPage from "./Pages/ManageUsersPage/ManageUsersPage";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Routes>
            <Route path={"/"} element={<LoginPage/>}/>
            <Route path={"/ListOfRecipesPage"} element={<ListOfRecipesPage/>}/>
            <Route path={"/RecipeStepsPage"} element={<RecipeStepsPage/>}/>
            <Route path={"/ShelfSetupPage"} element={<ShelfSetupPage/>}/>
            <Route path={"/ManageUsersPage"} element={<ManageUsersPage/>}/>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;

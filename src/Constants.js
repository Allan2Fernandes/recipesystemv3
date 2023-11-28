import stockImage from "./Images/blank_white_image.png"

export const baseURL = "http://10.0.109.150:5052/"
//export const baseURL = "https://localhost:7000/"

// If the size of the image is under 10k, it will get imported as a base64 which will cause problems
export const blank_image = stockImage

export const Directions = {
    Up: "Up",
    Down: "Down",
    Open: "Open",
    Close: "Close"
}

export const ParamIDs = {
    RecipeName: 35006,
    CommonHierarchyType: 10002,
    CommonHierarchyTypeRecipeValue: 1,
    CommonHierarchyTypeStepValue: 2,
    CommonHierarchyTypeSubStepValue: 3,
    KeyToParentRecipeStep: 15001,
    StepNumber: 10003,
    StepSubStepName: 35007,
    StepImage1: 35001,
    StepImage2: 35002,
    StepInstructions: 35003,
    SubStepNumber: 10004,
    SubStepAction: 35004,
    SubStepItem: 35005,
    UserName: 39901,
    Password: 39902,
    FileName: 35008,
    HighResImageEncoding: 35009,
    LowResImageEncoding: 35010,
    ModificationDate: 30000,
    ShelfNumber: 10005,
    ItemIdentifier: 10006,
    ActionType: 30004,
    PickActionTypeParamValue: 4,
    ExpanderActionTypeParamValue: 5,
    KolverActionTypeParamValue: 6,
    AtlasActionTypeParamValue: 7,
    PressActionTypeParamValue: 8,
    OrientationActionTypeParamValue: 9,
    AcknowledgeActionTypeParamValue:10,
    ProductTypeActionActionTypeParamValue: 11,
    ItemName: 30001,
    ExpanderXCoord: 1,
    ExpanderYCoord: 2,
    ExpanderZCoord: 3,
    ExpanderOrientation: 4,
    AdminAccessLevel: 0,
    UserAccessLevel: 1,
    DisabledAccessLevel: -1,
    AccessLevel: 15002,
    RecipeActiveStatus: 20001,
    RecipeEnabledParamValue: 1,
    RecipeDisabledParamValue: 0,
    ItemActiveStatus: 20002,
    ItemEnabledParamValue: 1,
    ItemDisabledParamValue: 0,
    ImageActiveStatus: 20003,
    ImageEnabledParamValue: 1,
    ImageDisabledParamValue: 0
}

export const Permissions = {
    viewListOfRecipesPage: {Admin: true, User: true},
    createRecipe: {Admin: true, User: false},
    duplicateRecipe: {Admin: true, User: false},
    viewRecipeStepsPage: {Admin: true, User: true},
    editRecipeSteps: {Admin: true, User: false},
    viewShelfSetUpValuesPage: {Admin: true, User: true},
    createShelfSetUpValues:{Admin: true, User: false},
    editShelfSetUpValues: {Admin: true, User: false},
    viewUserManagementPage: {Admin: true, User: false},
    createUser: {Admin: true, User: false},
    editUserAccessLevel: {Admin: true, User: false},
    UpdatePassword: {Admin: true, User: false}
}


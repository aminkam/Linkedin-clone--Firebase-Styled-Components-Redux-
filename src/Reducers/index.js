import { combineReducers } from "redux";
import articleReducer from "./ArticleReducer";
import userReducer from "./UserReducer";

const rootReducer = combineReducers({
  userState: userReducer,
  articleState: articleReducer,
});

export default rootReducer;

import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";

import rootReducer from "./reducers";
import thunk from "redux-thunk";
const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger, thunk)
});

export default store;

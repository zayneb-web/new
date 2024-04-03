import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducer";

const store = configureStore({
    // "root reducer" fait référence au reducer principal qui combine plusieurs reducers individuels en un seul reducer global. 
  reducer: rootReducer,
  
});
// fct de store Redux permet de déclencher l'envoi d'actions vers les reducers.
const { dispatch } = store;

export { store, dispatch };



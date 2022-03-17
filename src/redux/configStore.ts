import { configureStore } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();
const store = configureStore({ reducer: {} });
export default store;

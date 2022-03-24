import { configureStore } from '@reduxjs/toolkit';
import todo from './modules/todo';
import user from './modules/user';
import modal from './modules/modal';

const store = configureStore({ reducer: { modal, user, todo } });

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
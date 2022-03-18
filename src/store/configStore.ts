import { configureStore } from '@reduxjs/toolkit';
import modal from './modules/modal';

const store = configureStore({ reducer: { modal } });

export default store;

export type RootState = ReturnType<typeof store.getState>;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
	isOpen: false,
	type: '',
};

const ModalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		openModal(state) {
			state.isOpen = true;
		},
		closeModal(state) {
			state.isOpen = false;
		},
		changeModal(
			state,
			action: PayloadAction<'notSignIn' | 'signIn' | 'signUp' | 'addClass' | 'inviteCode' | 'tutorial'>
		) {
			state.type = action.payload;
		},
	},
});

export const { openModal, closeModal, changeModal } = ModalSlice.actions;

export default ModalSlice.reducer;

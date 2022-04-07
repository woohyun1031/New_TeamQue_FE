import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
	isOpen: false,
	type: '',
	data: '',
};
	
const ModalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		openModal(state, action: PayloadAction<
			| 'notSignIn'
			| 'signIn'
			| 'signUp'
			| 'addClass'
			| 'inviteCode'
			| 'tutorial'
			| 'registClass'
			| 'deleteaccount'
			| 'modifyuserinfo'
			| 'modifyclass'
			| 'streamkey'
		>) {
			state.isOpen = true;
			state.type = action.payload;
		},
		closeModal(state) {
			state.isOpen = false;
		},
		adddata(state, action: any) {
			state.data = action.payload;
		},
	},
});

export const { openModal, closeModal, adddata } = ModalSlice.actions;

export default ModalSlice.reducer;

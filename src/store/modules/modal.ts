import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
	isOpen: false,
	type: '',
	classId: '',
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
		changeClassId(state, action: PayloadAction<string>) {
			state.classId = action.payload;
		},
	},
});

export const { openModal, closeModal, changeClassId } = ModalSlice.actions;

export default ModalSlice.reducer;

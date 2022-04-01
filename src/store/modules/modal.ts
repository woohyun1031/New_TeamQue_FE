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
		openModal(state) {
			state.isOpen = true;
		},
		closeModal(state) {
			state.isOpen = false;
		},
		adddata(state, action: PayloadAction<string>) {
			state.data = action.payload;
		},
		changeModal(
			state,
			action: PayloadAction<
				| 'notSignIn'
				| 'signIn'
				| 'signUp'
				| 'addClass'
				| 'inviteCode'
				| 'tutorial'
				| 'registClass'
				| 'deleteaccount'
				| 'modifyuserinfo'
			>
		) {
			state.type = action.payload;
		},
	},
});

export const { openModal, closeModal, adddata,changeModal } = ModalSlice.actions;

export default ModalSlice.reducer;

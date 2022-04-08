import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api, { instance } from '../../api';
import axios from 'axios';

export const signIn = createAsyncThunk(
	'user/signin',
	async (
		loginInfo: { email: string; password: string },
		{ rejectWithValue }
	) => {
		try {
			const data = await api.signIn(loginInfo);
			sessionStorage.setItem('accessToken', data.accessToken);
			sessionStorage.setItem('refreshToken', data.refreshToken);
			console.log(data)
			instance.defaults.headers.common[
				'Authorization'
			] = `Bearer ${sessionStorage.getItem('accessToken')}`;
			return data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				alert(`로그인 오류: ${error.response?.data.message}`);
				return rejectWithValue(error.message);
			} else {
				alert(`알 수 없는 로그인 오류: ${error}`);
				return rejectWithValue('An unexpected error occurred');
			}
		}
	}
);

const initialState = {
	id: 0,
	name: '',
	isLogin: false,
};

export const user = createSlice({
	name: 'user',
	initialState,
	reducers: {
		authLogin: (_, action) => {
			sessionStorage.setItem('accessToken', action.payload.accessToken);
			sessionStorage.setItem('refreshToken', action.payload.refreshToken);
			instance.defaults.headers.common[
				'Authorization'
			] = `Bearer ${action.payload.accessToken}`;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(signIn.fulfilled, (state, action) => {
			state.id = action.payload.id;
			state.name = action.payload.name;
			state.isLogin = true;
		});
	},
});

export const { authLogin } = user.actions;

export default user.reducer;

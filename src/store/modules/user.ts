import { instance } from './../../api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apis from '../../api';

export const signUp = createAsyncThunk(
	'user/signup',
	async (
		userInfo: {
			email: string;
			name: string;
			password: string;
			confirmPassword: string;
		},
		{ rejectWithValue }
	) => {
		try {
			const response = await apis.signUp(userInfo);
			return response.data;
		} catch (err) {
			return rejectWithValue(err);
		}
	}
);

export const signIn = createAsyncThunk(
	'user/signin',
	async (
		loginInfo: { email: string; password: string },
		{ rejectWithValue }
	) => {
		try {
			const {data} = await apis.signIn(loginInfo);
			console.log(data)
			sessionStorage.setItem('name', data.name);
			sessionStorage.setItem('accessToken', data.accessToken);
			sessionStorage.setItem('refreshToken', data.refreshToken);
			instance.defaults.headers.common["Authorization"] = `Bearer ${sessionStorage.getItem('accessToken')}`;
			return data;
		} catch (err) {
			return rejectWithValue(err);
		}
	}
);

export const signOut = createAsyncThunk(
	'user/logoutAxios',
	async (_, { rejectWithValue }) => {
		try {
			sessionStorage.removeItem('nickname');
			sessionStorage.removeItem('accessToken');
			sessionStorage.removeItem('refreshToken');
			const response = await apis.signOut();
			console.log(response)
			return true;
		} catch (err) {
			return rejectWithValue(err);
		}
	}
);

export const nicknameSet = createAsyncThunk(
	'user/nickname',
	async (nickname: string, {rejectWithValue}) => {
		try {
			await apis.setNick(nickname);
			return true;
		} catch (err) {
			return rejectWithValue(err);
		}
	}
);

const initialState = {
	user_info: {
		// id: '',
		name: '',		
	},
	isLogin: false,
};

export const user = createSlice({
	name: 'user',
	initialState,
	reducers: {
		getUser: (state) => {
			const name = sessionStorage.getItem('name');
			if (name) {
				state.user_info.name = name
			}
			state.isLogin = true;
		},
		errorLog: (state, action) => {
			if (action.payload.response) {
				console.log(action.payload.response, 'error.response');
			} else if (action.payload.request) {
				console.log(action.payload.request, 'error.request');
			} else if (action.payload.message) {
				console.log(action.payload.message, 'error.message');
			}
		},
	},
	extraReducers: (builder) => {
		builder.addCase(signUp.fulfilled, (state, action) => {
			if (action.payload) {
				state.user_info = initialState.user_info;
				state.isLogin = false;
			}
		});
		builder.addCase(signIn.rejected, (state, action) => {
			console.log(action.payload);
		});
		builder.addCase(signIn.fulfilled, (state, action) => {
			state.user_info = {
				name: action.payload.name,
			};
			state.isLogin = true;
		});
		builder.addCase(signOut.fulfilled, (state, action) => {
			// 로그아웃 로직 추가
			if (action.payload) {
				state.user_info = initialState.user_info;
				state.isLogin = false;
			}
			alert('로그아웃 완료');
		});
	},
});

export const { getUser } = user.actions;

export default user.reducer;
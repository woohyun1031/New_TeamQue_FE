import { instance } from './../../api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apis from '../../api';
import axios from 'axios';

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
			const { data } = await apis.signUp(userInfo);
			return data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				alert(`회원가입 오류: ${error.response?.data.message}`);
				return rejectWithValue(error.message);
			} else {
				alert(`알 수 없는 회원가입 오류: ${error}`);
				return rejectWithValue('An unexpected error occurred');
			}
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
			const { data } = await apis.signIn(loginInfo);
			sessionStorage.setItem('accessToken', data.accessToken);
			sessionStorage.setItem('refreshToken', data.refreshToken);
			instance.defaults.headers.common[
				'Authorization'
			] = `Bearer ${sessionStorage.getItem('accessToken')}`;
			console.log(data,"data")
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

//kakao social 로그인
export const kakaoLogin = createAsyncThunk(
	'user/kakaoin',
	async (_,{ rejectWithValue }
	) => {
		try {
			console.log(1)
			const response = await apis.kakaoLogin();
			console.log(response)
			const data = response.data
			console.log(data,"data")
			sessionStorage.setItem('name', `${data.name}`);
			sessionStorage.setItem('accessToken', `${data.accessToke}`);
			sessionStorage.setItem('refreshToken', `${data.refreshToken}`);
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


export const signOut = createAsyncThunk(
	'user/logoutAxios',
	async (_, { rejectWithValue }) => {
		try {
			sessionStorage.removeItem('accessToken');
			sessionStorage.removeItem('refreshToken');
			await apis.signOut();
			return true;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				alert(`로그아웃 오류: ${error.response?.data.message}`);
				return rejectWithValue(error.message);
			} else {
				alert(`알 수 없는 로그아웃 오류: ${error}`);
				return rejectWithValue('An unexpected error occurred');
			}
		}
	}
);

export const getUserInfo = createAsyncThunk(
	'user/getUserInfo',
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await apis.getUserInfo();
			return data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				alert(`사용자 정보 불러오기 오류: ${error.response?.data.message}`);
				return rejectWithValue(error.message);
			} else {
				alert(`알 수 없는 사용자 정보 불러오기 오류: ${error}`);
				return rejectWithValue('An unexpected error occurred');
			}
		}
	}
);

export const nicknameSet = createAsyncThunk(
	'user/nickname',
	async (nickname: string, { rejectWithValue }) => {
		try {
			await apis.setNick(nickname);
			return true;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				alert(`닉네임 설정 오류: ${error.response?.data.message}`);
				return rejectWithValue(error.message);
			} else {
				alert(`알 수 없는 닉네임 설정 오류: ${error}`);
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
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(signIn.fulfilled, (state, action) => {
			state.id = action.payload.id;
			state.name = action.payload.name;
			state.isLogin = true;			
		});
		builder.addCase(kakaoLogin.fulfilled, (state, action) => {
			state.id = action.payload.id;
			state.name = action.payload.name;
			state.isLogin = true;
		});
		builder.addCase(getUserInfo.fulfilled, (state, action) => {
			state.id = action.payload.id;
			state.name = action.payload.name;
			state.isLogin = true;
		});
		builder.addCase(signOut.fulfilled, () => initialState);
	},
});

export default user.reducer;

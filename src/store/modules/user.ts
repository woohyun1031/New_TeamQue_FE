import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apis from '../../api';

const initialState = {
	user_info: {
		nickname: '',		
	},
	is_login: false,
};

export const signUp = createAsyncThunk(
	'user/signup',
	async (userInfo: any, thunkAPI) => {
		try {
			await apis
				.signUp(userInfo)
				.then((response:any) => {
					alert('회원가입에 성공했습니다. 로그인 페이지로 이동합니다.');
					return response.data;
				}
			);
		} catch (err:any) {
			thunkAPI.dispatch(user.actions.errorLog(err));
			alert(err);
			return thunkAPI.rejectWithValue(err.response.message);
		}
	}
);

export const signIn = createAsyncThunk(
	'user/signin',
	async (form: any, thunkAPI) => {
		try {
			console.log('signIn dispatch 확인')
			const response = 
			await apis
				.signIn(form)
				.then((res:any) => {
					if (res.status === 200) {
						alert('로그인에 성공했습니다. 메인 페이지로 이동합니다.');
					}					
					thunkAPI.dispatch(user.actions.setUserToSession(res))				
					return res.data;
				});			
			return response;
		} catch (err:any) {
				alert(err + " signin err");
				thunkAPI.dispatch(user.actions.errorLog(err));
				return thunkAPI.rejectWithValue(err.response.message);
		}
	}
);


export const signOut = createAsyncThunk(
	'user/logoutAxios',
	async (_, thunkAPI) => {
		try {
			thunkAPI.dispatch(user.actions.deleteUserFromSession());
			await apis.signOut().then((response:any) => {
				alert('로그아웃에 성공하셨습니다');
			});
			return true;
		} catch (err:any) {
			alert(err.response.data.msg + '로그아웃 실패');
			thunkAPI.dispatch(user.actions.errorLog(err));
			return false;
		}
	}
);

export const nicknameSet = createAsyncThunk(
	'user/nickname',
	async (nickname: string, thunkAPI) => {
		try{			
			await apis
				.setNick(nickname)
				.then(()=> {					
					alert('닉네임 설정에 성공했습니다. 메인 페이지로 이동합니다.');
				})
		} catch (error:any){			
			alert(error);
			thunkAPI.dispatch(user.actions.errorLog(error));
			return thunkAPI.rejectWithValue(error.response.message);
		}
	}
)

export const user = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUserToSession: (state, action) => {
			console.log(action.payload,"setUserToSession action.payload.data");
      // getUserInfo api 수정예정		
			sessionStorage.setItem('nickname', action.payload.data.nickname);
			sessionStorage.setItem('accessToken', action.payload.data.accessToken);
			sessionStorage.setItem('refreshToken', action.payload.data.refreshToken);
		},
		getUser: (state) => {
			const tempName = sessionStorage.getItem('nickname');
			state.user_info.nickname = tempName ? tempName : '';		
			state.is_login = true;
		},
		deleteUserFromSession: () => {
			sessionStorage.removeItem('nickname');
			sessionStorage.removeItem('accessToken');
			sessionStorage.removeItem('refreshToken');
		},
		errorLog: (state, action) => {
			if (action.payload.response){
				console.log(action.payload.response,"error.response")
				}else if(action.payload.request){				
				console.log(action.payload.request,"error.request")				
				}else if(action.payload.message){				
				console.log(action.payload.message,"error.message")	
				}
		}
	},
	extraReducers: (builder) => {
		builder.addCase(signUp.fulfilled, (state, action) => {if (action.payload) {
			state.user_info = initialState.user_info;
			state.is_login = false;
		}
		});
		builder.addCase(signIn.fulfilled, (state, action) => {
			console.log(action.payload,"signIn.fulfilled action.payload.data");
			console.log(action.payload)
			state.user_info = {
        nickname: action.payload.nickname,
      };
			state.is_login = true;
		});
		builder.addCase(signOut.fulfilled, (state, action) => {
			if (action.payload) {
				state.user_info = initialState.user_info;
				state.is_login = false;
			}
			alert('로그아웃 완료');
		});
	},
});

export const { setUserToSession, getUser, deleteUserFromSession } = user.actions;

export default user.reducer;
import axios, { AxiosRequestConfig } from 'axios';

const instance = axios.create({
	baseURL: 'http://noobpro.shop:3000/',
	headers: {
		'Content-Type': 'application/json;charset=utf-8',
	},
});

instance.interceptors.request.use(
	(config: AxiosRequestConfig) => {
		const accesssToken = sessionStorage.getItem('accessToken');
		if (accesssToken) {
			// 수정 필요
			config.headers!.Authorization = `Bearer ${accesssToken}`;
		}
		return config;
	},
	(error) => {
		alert(error + 'interceptors.request error');
		console.log(error, 'request error');
	}
);

instance.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const {
			config,
			response: { status },
		} = error;
		if (status === 401) {
			console.log(error, '401 error');
			if (error.response.data.message === 'TokenExpiredError') {
				const originalRequest = config;
				const refreshToken = sessionStorage.getItem('refreshToken');

				//token refresh 요청
				let accesssToken;
				if (refreshToken) {
					const { data } = await apis.refresh(refreshToken);
					accesssToken = data;
				}

				//new token
				const { accessToken: newAccessToken } = accesssToken;
				sessionStorage.setItem('accessToken', newAccessToken);
				//sessionStorage.setItem('refreshToken', newRefreshToken);

				axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

				return axios(originalRequest);
			}
		}
		return Promise.reject(error);
	}
);

export const apis = {
	//---- 유저  ----//
	// 사용할지 잘 모름
	kakao: (authorization_code: string) =>
		instance.get(`/api/auth/kakao/callback?code=${authorization_code}`), //카카오로그인
	signUp: (userInfo: object) => instance.post('/auth/signup', userInfo), //회원가입
	signIn: (userInfo: object) => instance.post('/auth/signin', userInfo), //로그인
	signOut: () => instance.post('/auth/signout', {}), //로그아웃
	//---- 유저 정보 등록 ----//
	setNick: (nickname: string) => instance.put('/auth/nickname', { nickname }), //초기 닉네임 등록
	test: () => instance.get('/auth/test'),
	//---- refresh  ----//
	refresh: (refreshToken: string) =>
		instance.post('/auth/refresh', refreshToken),

	withdrawal: () => instance.delete('auth/withdrawal'),

	// 클래스
	createClass: (classInfo: object) => instance.post('/class', classInfo),
	loadLearnClass: () => instance.get('/class/student/class'),
	loadTeachClass: () => instance.get('/class'),
	loadClassInfo: (classId: string) => instance.get(`/class/${classId}`),
	loadClassBoards: (classId: string) => instance.get(`/boards/${classId}`),
	loadStudents: (classId: string) => instance.get(`class/student/${classId}`),

	// 게시판
	loadDetail: (boardId: string) => instance.get(`/boards/board/${boardId}`),


	// todo
	loadTodo: () => instance.get('/boards/todo'),
	addTodo: (todo: string) => instance.post('/boards/todo', { content: todo }),
	deleteTodo: (todoid: string) => instance.delete(`/boards/todo/${todoid}`),
	updateTodo: (todoid: string) => instance.put(`/boards/todo/${todoid}`, {}),
};
export default apis;

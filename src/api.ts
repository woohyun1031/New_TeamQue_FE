import axios from 'axios';

export const instance = axios.create({
	baseURL: 'https://noobpro.shop:3000/',
	headers: {
		'Content-Type': 'application/json;charset=utf-8',
	},
});

instance.defaults.headers.common[
	'Authorization'
] = `Bearer ${sessionStorage.getItem('accessToken')}`;

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
				console.log('refresh error');
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

				axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

				return axios(originalRequest);
			}
		}
		return Promise.reject(error);
	}
);

export const apis = {
	// User
	signUp: (userInfo: object) => instance.post('/user/signup', userInfo),
	signIn: (signInInfo: { email: string; password: string }) =>
		instance.post('/user/signin', signInInfo),
	signOut: () => instance.post('/user/signout', {}),
	setNick: (nickname: string) => instance.put('/user/nickname', { nickname }),
	test: () => instance.get('/auth/test'),
	refresh: (refreshToken: string) =>
		instance.post('/auth/refresh', refreshToken),
	withdrawal: () => instance.delete('auth/withdrawal'),

	// Class
	createClass: (classInfo: object) => instance.post('/class', classInfo),
	loadLearnClass: () => instance.get('/class/student/class'),
	loadTeachClass: () => instance.get('/class'),
	loadClassInfo: (classId: string) => instance.get(`/class/${classId}`),
	loadClassBoards: (classId: string) => instance.get(`/boards/${classId}`),
	loadStudents: (classId: string) => instance.get(`/class/student/${classId}`),

	// Post
	loadDetail: (boardId: string) => instance.get(`/boards/board/${boardId}`),

	// Main
	loadMyCalendar: (year: number, month: number) =>
		instance.get(`/class/date?year=${year}&month=${month}`),

	// Todo
	loadTodo: () => instance.get('/post/todo'),
	addTodo: (content: string) => instance.post('/post/todo', { content: content }),
	deleteTodo: (todoId: number) => instance.delete(`/post/todo/${todoId}`),
	completeTodo: (todoId: number) =>
		instance.put('/post/todo/complete', {id: todoId}),
};
export default apis;

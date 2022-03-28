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
	signUp: (userInfo: object) => instance.post('/auth/signup', userInfo),
	signIn: (userInfo: object) => instance.post('/auth/signin', userInfo),
	signOut: () => instance.post('/auth/signout', {}),
	setNick: (nickname: string) => instance.put('/auth/nickname', { nickname }),
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
	loadAllCalendar: (year: number, month: number) =>
		instance.get(`/class/date/all/${year}/${month}`),

	// Post
	loadDetail: (boardId: string) => instance.get(`/boards/board/${boardId}`),
	// Todo
	loadTodo: () => instance.get('/boards/todo'),
	addTodo: (todo: string) => instance.post('/boards/todo', { content: todo }),
	deleteTodo: (todoid: number) => instance.delete(`/boards/todo/${todoid}`),
	updateTodo: (todoid: number) => instance.put(`/boards/todo/${todoid}`, {}),
	changeOrderTodo: (todoid1: string, todoid2: string) =>
		instance.put(`/boards/todo/change/${todoid1}/${todoid2}`, {}),
};
export default apis;

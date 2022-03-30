import axios from 'axios';

export const instance = axios.create({
	baseURL: 'https://noobpro.shop:3000/',
	headers: {
		'Content-Type': 'application/json;charset=utf-8',
	},
});


let isRefreshing = false;
const refreshSubscribers: ((arg: string) => void)[] = [];
const addRefreshSubscriber = (callback: (arg: string) => void) => {
	refreshSubscribers.push(callback);
};

instance.defaults.headers.common[
	'Authorization'
] = `Bearer ${sessionStorage.getItem('accessToken')}`;

instance.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		if (axios.isAxiosError(error)) {
			const originalRequest = error.config;
			if (
				error.response?.status === 401 &&
				error.response?.data.message === 'Unauthorized'
			) {
				if (!isRefreshing) {
					const response = await apis.refresh();
					const accessToken = response.data.accessToken;
					sessionStorage.setItem('accessToken', response.data.accessToken);
					instance.defaults.headers.common[
						'Authorization'
					] = `Bearer ${response.data.accessToken}`;
					isRefreshing = false;
					refreshSubscribers.map((callback) => callback(accessToken));
				}
				const retryOriginalRequest = new Promise((resolve) => {
					addRefreshSubscriber((accessToken: string) => {
						if (originalRequest.headers) {
							originalRequest.headers.Authorization = 'Bearer ' + accessToken;
							resolve(axios(originalRequest));
						}
					});
				});
				return retryOriginalRequest;
			}
			return Promise.reject(error);
		}
	}
);

export const apis = {
	// User
	signUp: (userInfo: object) => instance.post('/user/signup', userInfo),
	signIn: (signInInfo: { email: string; password: string }) =>
		instance.post('/user/signin', signInInfo),
	signOut: () => instance.post('/user/signout', {}),
	getUserInfo: () => instance.get('/user'),
	withdrawal: () => instance.delete('auth/withdrawal'),
	setNick: (nickname: string) => instance.put('/user/nickname', { nickname }),
	refresh: () =>
		instance.post(
			'/user/refresh',
			{},
			{
				headers: {
					Authorization: `Bearer ${sessionStorage.getItem('refreshToken')}`,
				},
			}
		),
	kakaoLogin: (authorization_code: any) => instance.get(`/user/kakao/callback?code=${authorization_code}`),

	// Class
	loadClassInfo: (classId: string) => instance.get(`/class/${classId}`),
	loadStudents: (classId: string) => instance.get(`/class/student/${classId}`),

	// Post
	loadPosts: (classId: string, page: string) =>
		instance.get(`/post/${classId}?page=${page}`),
	loadPost: (postId: string) => instance.get(`/post/detail/${postId}`),

	// Main
	loadLearnClass: () => instance.get('/class/learn'),
	loadTeachClass: () => instance.get('/class/teach'),
	loadMyCalendar: (year: number, month: number) =>
		instance.get(`/class/date?year=${year}&month=${month}`),
	// 강의참여하기 추가 예정
	createClass: (classInfo: object) => instance.post('/class', classInfo),
	// Todo
	loadTodo: () => instance.get('/post/todo'),
	addTodo: (content: string) =>
		instance.post('/post/todo', { content: content }),
	deleteTodo: (todoId: number) => instance.delete(`/post/todo/${todoId}`),
	completeTodo: (todoId: number) =>
		instance.put('/post/todo/complete', { id: todoId }),

	//Comment
	sendComment: (content: object) => instance.post('/post/comment', { content }),
};
export default apis;

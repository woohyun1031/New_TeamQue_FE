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
	withdrawal: (password: string) => instance.put('/user/delete', {password}),
	modifyUserInfo: (name: string) => instance.put('/user/edit', {name}),
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

	// Class
	loadClassData: (classId: string) => instance.get(`/class/${classId}`),
	loadStudents: (classId: string) => instance.get(`/class/student/${classId}`),
	changeState: (classId: string, studentId: number, isAccept: boolean) => instance.put(`/class/student/${classId}/${studentId}`, {isOk: isAccept}), 
	registClass: (uuid: string) => instance.post(`/class/student`, {uuid}),
	cancelApply: (classId: string) => instance.delete(`/class/student/${classId}`),
	
	// Post
	loadPosts: (classId: string, page: string) =>
	instance.get(`/post/${classId}?page=${page}`),
	loadPost: (postId: string) => instance.get(`/post/detail/${postId}`),
	postBoard: (classInfo: {classid:string,boardInfo:object}) => instance.post(`/post/${classInfo.classid}`,classInfo.boardInfo),
	deleteBoard: (postid:string) => instance.delete(`/post/${postid}`),
	updateBoard: (classInfo: {updateid:string,boardInfo:object}) => instance.put(`/post/${classInfo.updateid}`,classInfo.boardInfo),

	//Comment
	sendComment: (contents: {postid:string,comment:string}) => instance.post(`/post/comment/${contents.postid}`, { content:contents.comment }),
	loadPage: (postid:string) => instance.get(`/post/detail/${postid}`),

	// Main
	loadLearnClass: () => instance.get('/class/learn'),
	loadTeachClass: () => instance.get('/class/teach'),
	loadMyCalendar: (year: number, month: number) =>
		instance.get(`/class/date?year=${year}&month=${month}`),
	createClass: (classInfo: object) => instance.post('/class', classInfo),
	// Todo
	loadTodo: () => instance.get('/post/todo'),
	addTodo: (content: string) =>
		instance.post('/post/todo', { content: content }),
	deleteTodo: (todoId: number) => instance.delete(`/post/todo/${todoId}`),
	completeTodo: (todoId: number) =>
		instance.put('/post/todo/complete', { id: todoId }),


};
export default apis;

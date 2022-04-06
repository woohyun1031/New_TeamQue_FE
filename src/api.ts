import axios, { AxiosResponse } from 'axios';
import { CardType, ClassDataType, PostsType, PostType, StudentType, TodoType } from './type';

export const instance = axios.create({
	baseURL: process.env.REACT_APP_API_BASE_URL,
	headers: {
		'Content-Type': 'application/json;charset=utf-8',
	},
});


let isRefreshing = false;
const refreshSubscribers: ((arg: string) => void)[] = [];
const addRefreshSubscriber = (callback: (arg: string) => void) => {
	refreshSubscribers.push(callback);
};

instance.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem('accessToken')}`;

instance.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		if (axios.isAxiosError(error)) {
			const originalRequest = error.config;
			if (error.response?.status === 401 && error.response?.data.message === 'Unauthorized') {
				if (!isRefreshing) {
					const response = await instance.post('/user/refresh', {}, { headers: { Authorization: `Bearer ${sessionStorage.getItem('refreshToken')}` } });
					const accessToken = response.data.accessToken;
					sessionStorage.setItem('accessToken', response.data.accessToken);
					instance.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
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

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
	get: (url: string) => instance.get(url).then(responseBody),
	post: (url: string, body: object) => instance.post(url, body).then(responseBody),
	put: (url: string, body: object) => instance.put(url, body).then(responseBody),
	delete: (url: string) => instance.delete(url).then(responseBody),
};

const api = {
	// User
	signUp: (userInfo: object) => requests.post('/user/signup', userInfo),
	signIn: (signInInfo: { email: string; password: string }) =>
		requests.post('/user/signin', signInInfo),
	signOut: () => requests.post('/user/signout', {}),
	getUserInfo: (): Promise<{ id: number; name: string }> =>
		requests.get('/user'),
	withdrawal: (password: string) => requests.put('/user/delete', { password }),
	modifyUserInfo: (name: string) => requests.put('/user/edit', { name }),

	// Class
	loadLearnCards: (): Promise<CardType[]> => requests.get('/class/learn'),
	loadTeachCards: (): Promise<CardType[]> => requests.get('/class/teach'),
	cancelApply: (classId: string) =>
		requests.delete(`/class/student/${classId}`),
	loadMyCalendar: (year: number, month: number) =>
		requests.get(`/class/date?year=${year}&month=${month}`),
	createClass: (classInfo: object) => requests.post('/class', classInfo),
	loadClassData: (classId: string): Promise<ClassDataType> =>
		requests.get(`/class/${classId}`),
	loadStudents: (classId: string): Promise<StudentType[]> =>
		requests.get(`/class/student/${classId}`),
	changeState: (classId: string, studentId: number, isAccept: boolean) =>
		requests.put(`/class/student/${classId}/${studentId}`, { isOk: isAccept }),
	registClass: (uuid: string) => requests.post(`/class/student`, { uuid }),
	loadClassCalendar: (classId: string, year: number, month: number) =>
		requests.get(`/class/date/${classId}?year=${year}&month=${month}`),
	changeClass: (classInfo: object, classId : string) => requests.put(`/class/${classId}`, classInfo),
	deleteClass:(classId : string) => requests.delete(`/class/${classId}`),
	getInviteCode:(classId : string) => requests.get(`/class/invitecode/${classId}`),
	// Post
	loadPosts: (classId: string, page: string): Promise<PostsType> =>
		requests.get(`/post/${classId}?page=${page}`),
	loadPost: (postId: string): Promise<PostType> =>
		requests.get(`/post/detail/${postId}`),
	addPost: (classid: string, postData: {title: string, content: string, postType: 'Question' | 'Notice'}) =>
		requests.post(`/post/${classid}`, postData),
	deletePost: (postid: string) => requests.delete(`/post/${postid}`),
	updatePost: (classInfo: { updateid: string; boardInfo: object }) =>
		requests.put(`/post/${classInfo.updateid}`, classInfo.boardInfo),

	//Comment
	addComment: (postid: string, comment: string) =>
		requests.post(`/post/comment/${postid}`, { content: comment }),
	deleteComment: (commentId: number) => requests.delete(`/post/comment/${commentId}`),

	// Todo
	loadTodo: (): Promise<TodoType[]> => requests.get('/post/todo'),
	addTodo: (content: string) =>
		requests.post('/post/todo', { content: content }),
	deleteTodo: (todoId: number) => requests.delete(`/post/todo/${todoId}`),
	completeTodo: (todoId: number) =>
		requests.put('/post/todo/complete', { id: todoId }),
};

export default api;
import axios, { AxiosResponse } from 'axios';
import { CardType, PostsType, PostType, StudentType, TodoType } from './type';

export const instance = axios.create({
	baseURL: "https://noobpro.shop",
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
					isRefreshing = true;
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
	signUp: (SignUpData: {
		email: string;
		name: string;
		password: string;
		confirmPassword: string;
	}) => requests.post('/user/signup', SignUpData),
	signIn: (signInData: { email: string; password: string }) =>
		requests.post('/user/signin', signInData),
	signOut: () => requests.delete('/user/signout'),
	getUserInfo: (): Promise<{ id: number; name: string }> =>
		requests.get('/user'),
	deleteAccount: (password: string) =>
		requests.put('/user/delete', { password }),
	changeName: (name: string) => requests.put('/user/edit', { name }),

	// Class
	loadLearnCards: (): Promise<CardType[]> => requests.get('/class/learn'),
	loadTeachCards: (): Promise<CardType[]> => requests.get('/class/teach'),
	cancelApply: (classId: string) =>
		requests.delete(`/class/student/${classId}`),
	loadTotalCalendar: (year: number, month: number) =>
		requests.get(`/class/date?year=${year}&month=${month}`),
	createClass: (classInfo: object) => requests.post('/class', classInfo),
	loadClassData: (classId: string) => requests.get(`/class/${classId}`),
	loadStudents: (classId: string): Promise<StudentType[]> =>
		requests.get(`/class/student/${classId}`),
	changeState: (classId: string, studentId: number, isAccept: boolean) =>
		requests.put(`/class/student/${classId}/${studentId}`, { isOk: isAccept }),
	registClass: (inviteCode: string) => requests.post(`/class/student`, { inviteCode }),
	loadClassCalendar: (classId: string, year: number, month: number) =>
		requests.get(`/class/date/${classId}?year=${year}&month=${month}`),
	changeClass: (classInfo: {
		title: string;
		imageUrl: string;
		startDate: string;
		endDate: string;
		times: {	
			id: number;
			day: number;
			startTime: string;
			endTime: string;}[];
		}, classId: string) =>
		requests.put(`/class/${classId}`, classInfo),
	deleteClass: (classId: string) => requests.delete(`/class/${classId}`),
	getInviteCode: (classId: string): Promise<{ inviteCode: string }> =>
		requests.get(`/class/invitecode/${classId}`),
	getStreamCode: (classId: string): Promise<{ streamKey: string }> =>
		requests.get(`/stream/key/${classId}`),

	// Post
	loadPosts: (classId: string, page: string): Promise<PostsType> =>
		requests.get(`/post/${classId}?page=${page}`),
	loadPost: (postId: string): Promise<PostType> =>
		requests.get(`/post/detail/${postId}`),
	addPost: (
		classid: string,
		postData: {
			title: string;
			content: string;
			postType: 'Question' | 'Notice';
		}
	) => requests.post(`/post/${classid}`, postData),
	deletePost: (postid: string) => requests.delete(`/post/${postid}`),
	updatePost: (classInfo: { updateid: string; boardInfo: object }) =>
		requests.put(`/post/${classInfo.updateid}`, classInfo.boardInfo),

	//Comment
	addComment: (postid: string, comment: string) =>
		requests.post(`/post/comment/${postid}`, { content: comment }),
	deleteComment: (commentId: number) =>
		requests.delete(`/post/comment/${commentId}`),

	// Todo
	loadTodo: (): Promise<TodoType[]> => requests.get('/post/todo'),
	addTodo: (content: string) => requests.post('/post/todo', { content }),
	deleteTodo: (todoId: number) => requests.delete(`/post/todo/${todoId}`),
	completeTodo: (todoId: number) =>
		requests.put('/post/todo/complete', { id: todoId }),
};

export default api;

// - 정적 타이핑 지원 ⇒ JS, 동적 타이핑은 런타임 단계에서 JS엔젠에 의해 자동 해석으로 의도에 따라 받고 전달하는 데이터 타입이 불분명해질 수 있다.
// - Type을 지정하고 먼저 선언함으로, 프로그래밍 단계, HTTP 통신을 통한 데이터 를 주고 받는 과정에서 데이터 안전하게 주고 받을 수 있다
// - 또한 타입을 미리 선언으로 타입에 관련된 프로토타입 매서드를 손쉽게 찾아 쓸 수 있다
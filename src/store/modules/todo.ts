import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apis from '../../api';

export const loadTodos = createAsyncThunk(
	'todo/loadTodos',
	async (_, thunkAPI) => {
		try {
			const response = await apis.loadTodo();
			return response.data;
		} catch (err: any) {
			return thunkAPI.rejectWithValue(err.response.message);
		}
	}
);

export const addTodo = createAsyncThunk(
	'todo/addTodo',
	async (data: string, thunkAPI) => {
		try {
			await apis.addTodo(data);
			await thunkAPI.dispatch(loadTodos());
			return;
		} catch (err: any) {
			return thunkAPI.rejectWithValue(err.response.message);
		}
	}
);

export const deleteTodo = createAsyncThunk(
	'todo/deleteTodo',
	async (id: string, thunkAPI) => {
		try {
			await apis.deleteTodo(id);
			// state만 따로 바꿀지 서버랑 동기화 할지 고민
			// await thunkAPI.dispatch(loadTodos())
			return id;
		} catch (err: any) {
			return thunkAPI.rejectWithValue(err.response.message);
		}
	}
);

export const toggleComplete = createAsyncThunk(
	'todo/toggleComplete',
	async (id: string, thunkAPI) => {
		try {
			await apis.updateTodo(id);
			// state만 따로 바꿀지 서버랑 동기화 할지 고민
			// await thunkAPI.dispatch(loadTodos())
			return id;
		} catch (err: any) {
			return thunkAPI.rejectWithValue(err.response.message);
		}
	}
);

export const todo = createSlice({
	name: 'todo',
	initialState: [],
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(loadTodos.fulfilled, (_, action) => {
			return action.payload;
		});
		builder.addCase(deleteTodo.fulfilled, (state: { id: string }[], action) => {
			const index = state.findIndex((state) => state.id === action.payload);
			state.splice(index, 1);
		});
		builder.addCase(
			toggleComplete.fulfilled,
			(state: { id: string; isComplete: boolean }[], action) => {
				const index = state.findIndex((state) => state.id === action.payload);
				state[index].isComplete = !state[index].isComplete;
			}
		);
	},
});

export default todo.reducer;

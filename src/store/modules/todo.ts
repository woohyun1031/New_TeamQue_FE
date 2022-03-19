import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apis from '../../api';

export const loadTodos = createAsyncThunk(
	'todo/loadTodos',
	async (_, thunkAPI) => {
		try {
			const response = await apis.loadTodo();
			console.log(response);
			return response.data;
		} catch (err: any) {
			alert(err);
			return thunkAPI.rejectWithValue(err.response.message);
		}
	}
);

export const addTodo = createAsyncThunk(
	'todo/addTodo',
	async (data: string, thunkAPI) => {
		try {
			const response = await apis.addTodo(data);
			console.log(response)
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
			return;
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
			return;
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
	},
});

export default todo.reducer;

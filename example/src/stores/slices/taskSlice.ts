import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TaskState } from '../types/task';
import { RootState } from '../types/root';
import {
  putUpdateTask,
  getTasks,
  deleteTask,
  postAddTask,
} from '@/api/services/task';
import { TaskResponseModel } from '@/api/types';

const initialTaskState: TaskState = {
  task: [],
  completedTask: [],
};

const taskSlice = createSlice({
  name: 'task',
  initialState: initialTaskState,
  reducers: {
    onSetTask: (state, action: PayloadAction<TaskResponseModel[]>) => {
      state.task = action.payload || [];
    },
    onUpdateTask: (state, action: PayloadAction<TaskResponseModel>) => {
      const index = state.task.findIndex(item => item.id === action.payload.id);
      if (index >= 0) {
        state.task[index] = { ...state.task[index], ...action.payload };
      }
    },
    // onUpdateTask: (
    //   state,
    //   action: PayloadAction<{ id: string; isChecked: boolean }>,
    // ) => {
    //   state.task = state.task.map(task =>
    //     task.id === action.payload.id
    //       ? { ...task, isChecked: action.payload.isChecked }
    //       : task,
    // );
    // },
  },
  extraReducers: builder => {
    builder.addCase(getTasks.fulfilled, (state, action) => {
      state.task = action.payload || [];
      state.completedTask = state.task.filter(item => item.isChecked);
    });
    builder.addCase(postAddTask.fulfilled, (state, action) => {
      state.task.push(action.payload);
    });
    builder.addCase(putUpdateTask.fulfilled, (state, action) => {
      const index = state.task.findIndex(item => item.id === action.payload.id);
      if (index >= 0) {
        state.task[index].isChecked = action.payload.isChecked;
      }
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.task = state.task.filter(item => item.id !== action.payload.id);
    });
  },
});

export const { reducer: taskReducer, actions: taskActions } = taskSlice;

export const getTaskState = (state: RootState) => state.task;

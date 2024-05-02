import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchChapters as fetchChaptersAPI } from '../utils/api'; // Import the fetchChapters function from your API utilities

const initialState = {
  chapters: [],
  status: 'idle',
  error: null,
};

export const fetchChapters = createAsyncThunk(
  'chapter/fetchChapters',
  async (_, { rejectWithValue }) => {
    try {
      const chapters = await fetchChaptersAPI();
      return chapters;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const chapterSlice = createSlice({
  name: "chapter",
  initialState,
  reducers: {
    // Define any synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChapters.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChapters.fulfilled, (state, action) => {
        state.status = 'idle';
        state.chapters = action.payload;
      })
      .addCase(fetchChapters.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      });
  },
});

export default chapterSlice.reducer;

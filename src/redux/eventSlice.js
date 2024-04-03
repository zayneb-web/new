import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addEvent, getEvent as fetchEvent } from '../utils/api'; // Import the addEvent and getEvent functions from your API utilities
import { deleteEvent as deleteEventAPI } from '../utils/api'; 
import { updateEvent as updateEventAPI } from '../utils/api'; 

const initialState = {
  events: [],
  event: {},
  status: 'idle',
  error: null,
};

export const deleteEvent = createAsyncThunk(
  'event/deleteEvent',
  async (eventId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth; // Assuming you have an auth slice with a token
      await deleteEventAPI(token, eventId);
      return eventId; // Return the event ID if the deletion is successful
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const postEvent = createAsyncThunk(
  'event/postEvent',
  async (eventData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth; // Assuming you have an auth slice with a token
      const response = await addEvent(token, eventData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateEvent = createAsyncThunk(
  'event/updateEvent',
  async ({ token, eventId, eventData }, { rejectWithValue }) => {
    try {
      const response = await updateEventAPI(token, eventId, eventData);
      return response.data; // Assuming the API returns updated event data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    getEvents(state, action) {
      state.events = action.payload;
    },
    getEvent(state, action) {
      state.events[action.payload] = action.payload;
    },
    updateEvent(state, action) {
      state.events[action.payload.id] = action.payload;
    },
    deleteEventSuccess(state, action) {
      state.status = 'idle';
      // Remove the deleted event from the events array
      state.events = state.events.filter(event => event._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postEvent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(postEvent.fulfilled, (state, action) => {
        state.status = 'idle';
        state.events = action.payload;
      })
      .addCase(postEvent.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      })
      .addCase(deleteEvent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.status = 'idle';
        // Remove the deleted event from the events array
        state.events = state.events.filter(event => event._id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      })
      .addCase(updateEvent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.status = 'idle';
        // Update the event in the events array with the new data
        state.events = state.events.map(event =>
          event._id === action.payload._id ? action.payload : event
        );
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      });
  },
});

export default eventSlice.reducer;

export const { getEvents, getEvent, deleteEventSuccess } = eventSlice.actions;

export function SetEvents(event) {
  return (dispatch, getState) => {
    dispatch(eventSlice.actions.getEvents(event));
  };
}

export function SetEvent(event) {
  return (dispatch, getState) => {
    dispatch(eventSlice.actions.getEvent(event));
  };
}

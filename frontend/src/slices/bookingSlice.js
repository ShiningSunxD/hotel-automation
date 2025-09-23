import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  bookings: [],
};

export const bookingSlice = createSlice({
    name:'booking',
    initialState,
    reducers:{
        addBooking: (state, action) => {
            state.bookings.push(action.payload);
        },
        removeBooking: (state, action) => {
            state.bookings = state.bookings.filter(
                booking => booking.id !== action.payload.id
            );
        },
        clearBookings: (state) => {
            state.bookings = [];
        },
    }
});

export const { addBooking, removeBooking, clearBookings} = bookingSlice.actions;
export default bookingSlice.reducer;
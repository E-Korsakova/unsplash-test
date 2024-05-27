import { Action, PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type ImagesType = {
    id: string;
    width: number;
    height: number;
    alt_description: string;
    urls: {
        full: string;
        raw: string;
        regular: string;
        small: string;
        small_s3: string;
        thumb: string;
    }
}

type InitialStateType = {
    activeModal: boolean;
    activeImage: null | ImagesType;
    currentPage: number;
    results: ImagesType[];
    loading: boolean;
    isError: null | string;
    currQuery: string;
    hasMore: boolean;
}

const initialState: InitialStateType = {
    activeModal: false,
    activeImage: null,
    currentPage: 0,
    results: [],
    loading: false,
    isError: null,
    currQuery: '',
    hasMore: true,
}

function isError(action: Action) {
    return action.type.endsWith('rejected');
  }

export const getImages = createAsyncThunk<InitialStateType, {query: string, page: number}, { rejectValue: string }>(
    'images/getImages',
    async function ({query, page}, { rejectWithValue }) {
        const response = await fetch(`https://api.unsplash.com/search/photos?client_id=Ip0XA55zY7b7-d19osq1L5btGg-YCeDZVpnnJjXqHxs&query=${query}&page=${page}`);
        if (!response.ok) rejectWithValue('No Data!')
        const data = await response.json();
        return data;
    }
)
export const imagesSlice = createSlice({
    name: 'images',
    initialState,
    reducers: {
        setCurrentPage(state, action) {
            state.currentPage = action.payload;
        },
        setActiveModal(state, action) {
            state.activeModal = action.payload;
        },
        setActiveImage(state, action) {
            state.activeImage = action.payload;
        },
        setCurrentQuery(state, action) {
            state.currQuery = action.payload;
            state.hasMore = true;
            state.results = [];
        }
    },
    extraReducers(builder) {
        builder.addCase(getImages.pending, (state) => {
            state.loading = true;
            state.isError = null;
        })
        .addCase(getImages.fulfilled, (state, action) => {
            if (action.payload.results.length === 0) {
                state.hasMore = false;
            } else {  
                if (action.payload.results.length < 10) state.hasMore = false;          
                state.results.push(...action.payload.results);
            }
            state.loading = false;
        })
        .addMatcher(isError, (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.hasMore = false;
            state.isError = action.payload;
            state.currentPage--;
        })
    },
});

export const {setCurrentPage, setCurrentQuery, setActiveModal, setActiveImage} = imagesSlice.actions;
export default imagesSlice.reducer;
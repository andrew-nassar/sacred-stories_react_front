// File: src/features/saints/store/saintsSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiStoryItem, SacredStoryDetail } from "./types";
import { fetchSacredStories, fetchSacredStoryById } from "./saintsThunks";

export interface SaintsState {
  stories: ApiStoryItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  selectedStory: SacredStoryDetail | null;
  loadingStories: boolean;
  loadingDetail: boolean;
  error: string | null;
  
  // Filtering and pagination state
  searchTerm: string;
  selectedType: number | undefined; // undefined means "All"
  selectedStatus: number | undefined; // undefined means "All" or 1 (Approved/Published)
}

const initialState: SaintsState = {
  stories: [],
  totalCount: 0,
  pageNumber: 1,
  pageSize: 6, // 6 items per page fits perfectly on a 3x2 grid
  selectedStory: null,
  loadingStories: false,
  loadingDetail: false,
  error: null,
  searchTerm: "",
  selectedType: undefined,
  selectedStatus: undefined, // Default to All Statuses so user's remote draft stories load instantly
};

export const saintsSlice = createSlice({
  name: "saints",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.pageNumber = 1; // Reset to page 1 on search
    },
    setSelectedType: (state, action: PayloadAction<number | undefined>) => {
      state.selectedType = action.payload;
      state.pageNumber = 1; // Reset to page 1 on filter
    },
    setSelectedStatus: (state, action: PayloadAction<number | undefined>) => {
      state.selectedStatus = action.payload;
      state.pageNumber = 1; // Reset to page 1 on status change
    },
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumber = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.pageNumber = 1;
    },
    clearSelectedStory: (state) => {
      state.selectedStory = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // fetchSacredStories
    builder.addCase(fetchSacredStories.pending, (state) => {
      state.loadingStories = true;
      state.error = null;
    });
    builder.addCase(fetchSacredStories.fulfilled, (state, action) => {
      state.loadingStories = false;
      state.stories = action.payload.data.items;
      state.totalCount = action.payload.data.totalCount;
      state.pageNumber = action.payload.data.pageNumber;
      state.pageSize = action.payload.data.pageSize;
    });
    builder.addCase(fetchSacredStories.rejected, (state, action) => {
      state.loadingStories = false;
      state.error = action.payload || "Failed to load sacred stories.";
    });

    // fetchSacredStoryById
    builder.addCase(fetchSacredStoryById.pending, (state) => {
      state.loadingDetail = true;
      state.error = null;
    });
    builder.addCase(fetchSacredStoryById.fulfilled, (state, action) => {
      state.loadingDetail = false;
      state.selectedStory = action.payload;
    });
    builder.addCase(fetchSacredStoryById.rejected, (state, action) => {
      state.loadingDetail = false;
      state.error = action.payload || "Failed to load saint details.";
    });
  }
});

export const {
  setSearchTerm,
  setSelectedType,
  setSelectedStatus,
  setPageNumber,
  setPageSize,
  clearSelectedStory,
  clearError
} = saintsSlice.actions;

export default saintsSlice.reducer;

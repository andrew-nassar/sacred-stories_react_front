import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getSacredStoriesUseCase, getSacredStoryDetailUseCase } from "../../di/container";
import {
  GetStoriesParams,
  PaginatedList,
  SacredStoryDetail,
  SacredStoryListItem,
  StoryStatus,
  StoryType,
} from "../../domain/entities/sacredStory";

export interface SacredStoriesState {
  // List state
  items: SacredStoryListItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  loadingList: boolean;
  errorList: string | null;

  // Filter state
  searchTerm: string;
  typeFilter: StoryType | "ALL";
  statusFilter: StoryStatus | "ALL";

  // Detail state
  selectedStoryId: string | null;
  storyDetail: SacredStoryDetail | null;
  loadingDetail: boolean;
  errorDetail: string | null;
}

const initialState: SacredStoriesState = {
  items: [],
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  loadingList: false,
  errorList: null,

  searchTerm: "",
  typeFilter: "ALL",
  statusFilter: "ALL",

  selectedStoryId: null,
  storyDetail: null,
  loadingDetail: false,
  errorDetail: null,
};

// Async Thunks using Clean Architecture Use Cases
export const fetchSacredStories = createAsyncThunk(
  "sacredStories/fetchSacredStories",
  async (paramsOverride: Partial<GetStoriesParams> | undefined, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as any).sacredStories as SacredStoriesState;
      const params: GetStoriesParams = {
        searchTerm: paramsOverride?.searchTerm !== undefined ? paramsOverride.searchTerm : state.searchTerm,
        type: paramsOverride?.type !== undefined ? paramsOverride.type : (state.typeFilter === "ALL" ? undefined : state.typeFilter),
        status: paramsOverride?.status !== undefined ? paramsOverride.status : (state.statusFilter === "ALL" ? undefined : state.statusFilter),
        pageNumber: paramsOverride?.pageNumber !== undefined ? paramsOverride.pageNumber : state.pageNumber,
        pageSize: paramsOverride?.pageSize !== undefined ? paramsOverride.pageSize : state.pageSize,
      };

      const result = await getSacredStoriesUseCase.execute(params);
      return result;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to load sacred stories.");
    }
  }
);

export const fetchSacredStoryById = createAsyncThunk(
  "sacredStories/fetchSacredStoryById",
  async (id: string, { rejectWithValue }) => {
    try {
      const detail = await getSacredStoryDetailUseCase.execute(id);
      return detail;
    } catch (err: any) {
      return rejectWithValue(err.message || `Failed to load details for story ${id}.`);
    }
  }
);

export const sacredStoriesSlice = createSlice({
  name: "sacredStories",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.pageNumber = 1;
    },
    setTypeFilter: (state, action: PayloadAction<StoryType | "ALL">) => {
      state.typeFilter = action.payload;
      state.pageNumber = 1;
    },
    setStatusFilter: (state, action: PayloadAction<StoryStatus | "ALL">) => {
      state.statusFilter = action.payload;
      state.pageNumber = 1;
    },
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumber = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.pageNumber = 1;
    },
    setSelectedStoryId: (state, action: PayloadAction<string | null>) => {
      state.selectedStoryId = action.payload;
    },
    clearStoryDetail: (state) => {
      state.storyDetail = null;
      state.errorDetail = null;
      state.selectedStoryId = null;
    },
  },
  extraReducers: (builder) => {
    // List Reducers
    builder.addCase(fetchSacredStories.pending, (state) => {
      state.loadingList = true;
      state.errorList = null;
    });
    builder.addCase(fetchSacredStories.fulfilled, (state, action: PayloadAction<PaginatedList<SacredStoryListItem>>) => {
      state.loadingList = false;
      state.items = action.payload.items;
      state.totalCount = action.payload.totalCount;
      state.pageNumber = action.payload.pageNumber;
      state.pageSize = action.payload.pageSize;
    });
    builder.addCase(fetchSacredStories.rejected, (state, action) => {
      state.loadingList = false;
      state.errorList = action.payload as string;
    });

    // Detail Reducers
    builder.addCase(fetchSacredStoryById.pending, (state) => {
      state.loadingDetail = true;
      state.errorDetail = null;
    });
    builder.addCase(fetchSacredStoryById.fulfilled, (state, action: PayloadAction<SacredStoryDetail>) => {
      state.loadingDetail = false;
      state.storyDetail = action.payload;
      state.selectedStoryId = action.payload.id;
    });
    builder.addCase(fetchSacredStoryById.rejected, (state, action) => {
      state.loadingDetail = false;
      state.errorDetail = action.payload as string;
    });
  },
});

export const {
  setSearchTerm,
  setTypeFilter,
  setStatusFilter,
  setPageNumber,
  setPageSize,
  setSelectedStoryId,
  clearStoryDetail,
} = sacredStoriesSlice.actions;

export default sacredStoriesSlice.reducer;

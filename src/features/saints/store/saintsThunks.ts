// File: src/features/saints/store/saintsThunks.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import { saintsAdapter } from "../adapters/saintsAdapter";
import { 
  ApiStoryItem, 
  SacredStoryDetail, 
  GetStoriesParams,
  PaginatedResponse 
} from "./types";

export const fetchSacredStories = createAsyncThunk<
  PaginatedResponse<ApiStoryItem>,
  GetStoriesParams | undefined,
  { rejectValue: string }
>(
  "saints/fetchSacredStories",
  async (params, { rejectWithValue }) => {
    try {
      const response = await saintsAdapter.getSacredStories(params);
      if (!response.succeeded) {
        return rejectWithValue(response.message || "Failed to fetch sacred stories.");
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "An unexpected error occurred.");
    }
  }
);

export const fetchSacredStoryById = createAsyncThunk<
  SacredStoryDetail,
  string,
  { rejectValue: string }
>(
  "saints/fetchSacredStoryById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await saintsAdapter.getSacredStoryById(id);
      if (!response.succeeded || !response.data) {
        return rejectWithValue(response.message || `Failed to fetch sacred story with ID ${id}.`);
      }
      // The backend returns { statusCode: 200, succeeded: true, message: "...", data: storyObject }
      return response.data as unknown as SacredStoryDetail;
    } catch (error: any) {
      return rejectWithValue(error.message || "An unexpected error occurred.");
    }
  }
);

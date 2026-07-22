// File: src/features/sacred_stories/logic/useSacredStoryDetail.ts

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../core/store/hooks";
import { clearSelectedStory, clearError } from "../../saints/store/saintsSlice";
import { fetchSacredStoryById } from "../../saints/store/saintsThunks";

export function useSacredStoryDetail() {
  const dispatch = useAppDispatch();
  
  const {
    selectedStory,
    loadingDetail,
    error
  } = useAppSelector((state) => state.saints);

  const loadStoryById = useCallback((id: string) => {
    return dispatch(fetchSacredStoryById(id));
  }, [dispatch]);

  const clearStoryDetail = useCallback(() => {
    dispatch(clearSelectedStory());
  }, [dispatch]);

  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    selectedStory,
    loadingDetail,
    error,
    
    // Actions
    loadStoryById,
    clearStoryDetail,
    resetError
  };
}

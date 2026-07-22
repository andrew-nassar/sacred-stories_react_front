// File: src/features/saints/use-cases/useSaints.ts

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../core/store/hooks";
import { 
  setSearchTerm, 
  setSelectedType, 
  setSelectedStatus, 
  setPageNumber, 
  setPageSize,
  clearSelectedStory,
  clearError
} from "../store/saintsSlice";
import { fetchSacredStories, fetchSacredStoryById } from "../store/saintsThunks";

export function useSaints() {
  const dispatch = useAppDispatch();
  
  const {
    stories,
    totalCount,
    pageNumber,
    pageSize,
    selectedStory,
    loadingStories,
    loadingDetail,
    error,
    searchTerm,
    selectedType,
    selectedStatus
  } = useAppSelector((state) => state.saints);

  const loadStories = useCallback(() => {
    dispatch(
      fetchSacredStories({
        searchTerm: searchTerm || undefined,
        type: selectedType,
        status: selectedStatus,
        pageNumber,
        pageSize
      })
    );
  }, [dispatch, searchTerm, selectedType, selectedStatus, pageNumber, pageSize]);

  const loadStoryById = useCallback((id: string) => {
    return dispatch(fetchSacredStoryById(id));
  }, [dispatch]);

  const changeSearchTerm = useCallback((term: string) => {
    dispatch(setSearchTerm(term));
  }, [dispatch]);

  const changeSelectedType = useCallback((type: number | undefined) => {
    dispatch(setSelectedType(type));
  }, [dispatch]);

  const changeSelectedStatus = useCallback((status: number | undefined) => {
    dispatch(setSelectedStatus(status));
  }, [dispatch]);

  const changePageNumber = useCallback((page: number) => {
    dispatch(setPageNumber(page));
  }, [dispatch]);

  const changePageSize = useCallback((size: number) => {
    dispatch(setPageSize(size));
  }, [dispatch]);

  const clearStoryDetail = useCallback(() => {
    dispatch(clearSelectedStory());
  }, [dispatch]);

  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    stories,
    totalCount,
    pageNumber,
    pageSize,
    selectedStory,
    loadingStories,
    loadingDetail,
    error,
    searchTerm,
    selectedType,
    selectedStatus,
    
    // Actions
    loadStories,
    loadStoryById,
    changeSearchTerm,
    changeSelectedType,
    changeSelectedStatus,
    changePageNumber,
    changePageSize,
    clearStoryDetail,
    resetError
  };
}

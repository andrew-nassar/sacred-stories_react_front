// File: src/features/sacred_stories/logic/useSacredStoriesList.ts

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../core/store/hooks";
import { 
  setSearchTerm, 
  setSelectedType, 
  setSelectedStatus, 
  setPageNumber, 
  setPageSize,
  clearError
} from "../../saints/store/saintsSlice";
import { fetchSacredStories } from "../../saints/store/saintsThunks";

export function useSacredStoriesList() {
  const dispatch = useAppDispatch();
  
  const {
    stories,
    totalCount,
    pageNumber,
    pageSize,
    loadingStories,
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

  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    stories,
    totalCount,
    pageNumber,
    pageSize,
    loadingStories,
    error,
    searchTerm,
    selectedType,
    selectedStatus,
    
    // Actions
    loadStories,
    changeSearchTerm,
    changeSelectedType,
    changeSelectedStatus,
    changePageNumber,
    changePageSize,
    resetError
  };
}

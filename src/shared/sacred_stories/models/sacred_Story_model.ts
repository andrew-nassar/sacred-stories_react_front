// نموذج عنصر القصة القادم من الـ API
export interface SacredStoryItem {
  id: string;
  type: number;
  name: string;
  coverImage: string;
  famousQuote: string;
  status?: number; // تم جعله اختياري (Optional) وعدم الاعتماد عليه في الطلبات
}

// نموذج أنواع القصص القادم من /api/SacredStories/types
export interface SacredStoryType {
  id: number;
  name: string;
  displayName: string;
}

// نموذج معاملات الطلب (Query Parameters) لـ GET /api/SacredStories
// تم استبعاد status تماماً بناءً على طلبك
export interface SacredStoriesQueryParams {
  searchTerm?: string;
  type?: number; // الأنواع من 0 إلى 5
  pageNumber?: number;
  pageSize?: number;
}

// التغليف الأساسي للاستجابة من السيرفر (Response Envelope)
export interface SacredStoriesResponse {
  statusCode: number;
  meta: string;
  succeeded: boolean;
  message: string;
  errors: string[] | null | unknown;
  data: {
    items: SacredStoryItem[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
}
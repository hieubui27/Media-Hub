export interface HistoryItem {
  mediaItemId: number;
  title: string;
  typeName: string;
  urlItem: string | null;
  createdAt: string;
}

export interface HistoryResponse {
  content: HistoryItem[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
  first: boolean;
  last: boolean;
}
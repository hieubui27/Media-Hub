import { BookDetail, GameDetail, MovieDetail, SeriesDetail } from "./mediaItemDetail";

export type MediaItem =  | MovieDetail | SeriesDetail | GameDetail | BookDetail;

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
  sort: Sort;
}

export interface MediaResponse {
  content: MediaItem[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: Pageable;
  size: number;
  sort: Sort;
  totalElements: number;
  totalPages: number;
}
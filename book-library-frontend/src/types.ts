export interface Publisher {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  year: number;
  pages: number;
  isFavorite: boolean;
  publisherId?: number | null;
  publisherName?: string | null;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
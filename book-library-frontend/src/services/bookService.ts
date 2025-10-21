import {api} from "./api";
import type { Book, PagedResult ,Publisher} from "../types";

const API = "/books";

export async function fetchBooks(params?: {
  search?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
  favoriteOnly?: boolean;
  publisherId?: number;
}): Promise<PagedResult<Book>> {
  const { data } = await api.get(API, { params });
  return data as PagedResult<Book>;
}
export async function fetchPublishers(): Promise<{ id: number; name: string }[]> {
  const { data } = await api.get("/publishers");
  return data;
}

export async function addBook(book: Omit<Book, "id">): Promise<Book> {
  const { data } = await api.post(API, book);
  return data as Book;
}

export async function updateBook(id: number, book: Partial<Book>): Promise<void> {
  await api.put(`${API}/${id}`, book);
}

export async function deleteBook(id: number): Promise<void> {
  await api.delete(`${API}/${id}`);
}
import { api } from "./api";

export const searchBuyBooks = async (query: string) => {
  const response = await api.get(`/ai/buy-books?query=${encodeURIComponent(query)}`);
  return response.data;
};

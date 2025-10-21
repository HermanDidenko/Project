import {api} from "./api";
import type { Publisher } from "../types";

const API = "/publishers";
export const fetchPublishers = async () => {
  const { data } = await api.get("/publishers");
  return data;
}
// export async function fetchPublishers(): Promise<Publisher[]> {
//   const { data } = await api.get<Publisher[]>(API);
//   return data;
// }

export async function getPublisher(id: number): Promise<Publisher> {
  const { data } = await api.get<Publisher>(`${API}/${id}`);
  return data;
}
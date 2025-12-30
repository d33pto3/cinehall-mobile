import api from "@/services/api";

export interface Hall {
  _id: string;
  name: string;
  address: string;
  ownerId: string;
  image?: string;
}

interface HallsResponse {
  success: boolean;
  message: string;
  data: Hall[];
}

export const getAllHalls = async (): Promise<Hall[]> => {
  const { data } = await api.get<HallsResponse>("/hall");
  return data.data;
};

import { ENDPOINTS } from "@/api/endpoints";
import api from "@/services/api";

export const createBooking = async (data: any) => {
  try {
    const response = await api.post(ENDPOINTS.CREATE_BOOKING, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const initiatePayment = async (
  bookingId: string,
  redirects?: { success: string; fail: string; cancel: string }
) => {
  try {
    const response = await api.post(
      `${ENDPOINTS.CREATE_BOOKING}/initiate/${bookingId}`,
      { redirects }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

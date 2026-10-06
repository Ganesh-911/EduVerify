import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/api";

export async function checkApiHealth() {
  const response = await apiClient.get(API_ENDPOINTS.HEALTH);

  return response.data;
}
import axios from "axios";

const API_BASE_URL = "http://dapp.bableto.site/api";

export const getDrivers = async () => {
  const response = await axios.get(`${API_BASE_URL}/drivers`);
  return response.data;
};

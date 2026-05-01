import axios from "axios";
import { getCache, setCache } from "../utils/cache.js";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.EXCHANGE_API_KEY) {
  throw new Error("Missing EXCHANGE_API_KEY in environment variables");
}

const BASE_URL = `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest`;

export const getRates = async (base) => {
  try {
    const cachedRates = await getCache(base)

    if (cachedRates) {
      return cachedRates
    }

    const response = await axios.get(`${BASE_URL}/${base}`);

    const formattedData = {
      base: response.data.base_code,
      rates: response.data.conversion_rates,
    }

    await setCache(base, formattedData, 6000)
    
    return formattedData
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error("Error fetching exchange rates");
  }
};

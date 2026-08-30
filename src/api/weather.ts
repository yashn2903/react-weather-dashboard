import { API_CONFIG } from "./config"
import type { Coordinates, ForecastData, GeocodingResponse, WeatherData } from "./types"

class WeatherApi {

    private createUrl(
        endpoint: string,
        params: Record<string, string | number>
    ) {
        const searchParams = new URLSearchParams({
            appid: API_CONFIG.API_KEY,
            ...params,
        })

        return `${endpoint}?${searchParams.toString()}`
    }

    private async fetachData<T>(url: string): Promise<T> {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Weather Api Error: ${response.statusText}`)
        }

        return response.json()
    }

    async getCurrentWeather({ lat, lon }: Coordinates): Promise<WeatherData> {
        const url = this.createUrl(`${API_CONFIG.BASE_URL}/weather`, {
            lat: lat.toString(),
            lon: lon.toString(),
            units: API_CONFIG.DEFAULT_PARAMS.units,
        })

        return this.fetachData<WeatherData>(url)
    }


    async getForecast({ lat, lon }: Coordinates): Promise<ForecastData> {
        const url = this.createUrl(`${API_CONFIG.BASE_URL}/forecast`, {
            lat: lat.toString(),
            lon: lon.toString(),
            units: API_CONFIG.DEFAULT_PARAMS.units,
        })

        return this.fetachData<ForecastData>(url)
    }


    async reverseGeocode({ lat, lon }: Coordinates): Promise<GeocodingResponse[]> {
        const url = this.createUrl(`${API_CONFIG.GEO}/reverse`, {
            lat: lat.toString(),
            lon: lon.toString(),
            limit: 1,
        })

        return this.fetachData<GeocodingResponse[]>(url)
    }

    async SearchLocations(query: string): Promise<GeocodingResponse[]> {
        const url = this.createUrl(`${API_CONFIG.GEO}/direct`, {
            q: query,
            limit: "5",
        })

        return this.fetachData<GeocodingResponse[]>(url)
    }

}

export const WeatherAPI = new WeatherApi();
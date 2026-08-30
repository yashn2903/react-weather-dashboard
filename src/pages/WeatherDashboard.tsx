import CurrentWeather from '@/components/CurrentWeather'
import FavoriteCities from '@/components/FavoriteCities'
import HourlyTempereture from '@/components/HourlyTempereture'
import WeatherSkeleton from '@/components/LoadingSkeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import WeatherDetails from '@/components/WeatherDetails'
import WeatherForecast from '@/components/WeatherForecast'
import { useGeoLocation } from '@/hooks/useGeoLocation'
import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from '@/hooks/useWeather'
import { AlertTriangle, MapPin, RefreshCcw } from 'lucide-react'

const WeatherDashboard = () => {

  const {
    coordinates,
    error: locationError,
    getLoctaion,
    isLoading: locationLoading
  } = useGeoLocation()

  const weatherQuery = useWeatherQuery(coordinates)
  const forecastQuery = useForecastQuery(coordinates)
  const locationQuery = useReverseGeocodeQuery(coordinates)


  const handleRefresh = () => {
    getLoctaion()

    if (coordinates) {
      weatherQuery.refetch()
      forecastQuery.refetch()
      locationQuery.refetch()
    }
  }

  if (locationLoading) {
    return <WeatherSkeleton />
  }

  if (locationError) {
    return (
      <Alert variant="destructive" className="w-full">
        <AlertTriangle className='h-4 w-4'/>
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className=' flex flex-col gap-4'>
          <p>{locationError}</p>
          <Button onClick={getLoctaion} variant={'outline'} className="w-fit">
            <MapPin className='mr-2 h-4 w-4' />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!coordinates) {
    return (
      <Alert variant="destructive" className="w-full">
        <AlertTriangle className='h-4 w-4' />
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className=' flex flex-col gap-4'>
          <p>Please enable location access to see your local weather.</p>
          <Button onClick={getLoctaion} variant={'outline'} className="w-fit">
            <MapPin className='mr-2 h-4 w-4' />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  const locationName = locationQuery.data?.[0]

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive" className="w-full">
        <AlertTriangle className='h-4 w-4' />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className=' flex flex-col gap-4'>
          <p>Fail to fetch the weather data. Please try again.</p>
          <Button onClick={handleRefresh} variant={'outline'} className="w-fit">
            <RefreshCcw className='mr-2 h-4 w-4' />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />
  }


  return (
    <div className='space-y-4'>
      {/* Favirout cities render */}
      <FavoriteCities />
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-bold tracking-tight'>My Location</h1>
        <Button variant={'outline'}
          size={"icon"}
          onClick={handleRefresh}
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}
        >
          <RefreshCcw className={`h-4 w-4 ${weatherQuery.isFetching ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className='grid gap-6'>
        <div className=' flex flex-col lg:flex-row gap-4'>
          {/* current Weather */}
          <CurrentWeather data={weatherQuery.data} locationName={locationName} />
          {/* hourly Weather */}
          <HourlyTempereture data={forecastQuery.data} />
        </div>

        <div className='grid gap-6 md:grid-cols-2 items-start'>
          {/* details */}
          <WeatherDetails data={weatherQuery.data} />
          {/* Forecast */}
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  )
}

export default WeatherDashboard
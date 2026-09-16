"""Open-Meteo Air-Quality API client.

    The six main factors, effecting the risk of an asthma excerbation,
    investigated in this prototype are: Particulate Matter <= 2.5 micrograms
    (PM2.5), nitrogen dioxide (NO2), ozone (O3), pollen, relative Humidity
    and temperature. Raw data is collected from Open Meteo.
"""
from __future__ import annotations

import pandas as pd
import openmeteo_requests
import requests_cache
from retry_requests import retry

cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
openmeteo = openmeteo_requests.Client(session = retry_session)
pd.options.display.float_format = '{:.2f}'.format


OPEN_METEO_URL_AQ = "https://air-quality-api.open-meteo.com/v1/air-quality"
OPEN_METEO_URL_WEATHER = "https://api.open-meteo.com/v1/forecast"

AIR_QUALITY_VARIABLES = ["pm2_5", "nitrogen_dioxide", "ozone"]
POLLEN_VARIABLES = ["birch_pollen", "grass_pollen", "ragweed_pollen"]
RH_VARIABLES = ["relative_humidity_2m"]
TEMP_VARIABLES = ["temperature_2m_max", "temperature_2m_min"]


AIR_QUALITY_PAST_DAYS = 1
POLLEN_PAST_DAYS = 4
WEATHER_PAST_DAYS = 2

def fetch_hourly_data(latitude: float,
                      longitude: float,
                      variables: list[str],
                      past_days: int,
                      url: str) -> pd.DataFrame:
    """Holt stündliche Pollendaten und gibt einen DataFrame zurück.

        Spalten: date (index, tz-aware), birch_pollen, grass_pollen, ragweed_pollen
        """
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "hourly": variables,
        "timezone": "auto",
        "past_days": past_days,
    }
    responses = openmeteo.weather_api(url, params=params)
    response = responses[0]
    hourly = response.Hourly()

    data = {
        "date": pd.date_range(
            start=pd.to_datetime(hourly.Time(), unit="s", utc=True),
            end=pd.to_datetime(hourly.TimeEnd(), unit="s", utc=True),
            freq=pd.Timedelta(seconds=hourly.Interval()),
            inclusive="left",
        ).tz_convert(response.Timezone().decode())
    }

    for i, name in enumerate(variables):
        data[name] = hourly.Variables(i).ValuesAsNumpy()
    df = pd.DataFrame(data).set_index("date").sort_index()
    return df


def fetch_air_quality(latitude, longitude,
                      variables = AIR_QUALITY_VARIABLES,
                      past_days = AIR_QUALITY_PAST_DAYS,
                      url = OPEN_METEO_URL_AQ):
    return fetch_hourly_data(latitude, longitude, variables, past_days, url)


def fetch_pollen(latitude, longitude,
                 variables = POLLEN_VARIABLES,
                 past_days = POLLEN_PAST_DAYS,
                 url = OPEN_METEO_URL_AQ):
    return fetch_hourly_data(latitude, longitude, variables, past_days, url)

def fetch_rh(latitude, longitude,
             variables = RH_VARIABLES,
             past_days = WEATHER_PAST_DAYS,
             url = OPEN_METEO_URL_WEATHER):
    return fetch_hourly_data(latitude, longitude, variables, past_days, url)

def fetch_temperature(latitude, longitude) -> pd.DataFrame:
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": ["temperature_2m_max", "temperature_2m_min"],
        "timezone": "auto",
        "past_days": WEATHER_PAST_DAYS,
    }
    weather_responses = openmeteo.weather_api(OPEN_METEO_URL_WEATHER, params=params)
    weatherResponse = weather_responses[0]
    dailyTemp = weatherResponse.Daily()
    daily_temperature_2m_max = dailyTemp.Variables(0).ValuesAsNumpy()
    daily_temperature_2m_min = dailyTemp.Variables(1).ValuesAsNumpy()

    daily_temperature_data = {
        "date": pd.date_range(
            start = pd.to_datetime(dailyTemp.Time(), unit = "s", utc = True),
            end =  pd.to_datetime(dailyTemp.TimeEnd(), unit = "s", utc = True),
            freq = pd.Timedelta(seconds = dailyTemp.Interval()),
            inclusive = "left"
        )
    }

    daily_temperature_data["temperature_2m_max"] = daily_temperature_2m_max
    daily_temperature_data["temperature_2m_min"] = daily_temperature_2m_min

    daily_temp_df = pd.DataFrame(data = daily_temperature_data).set_index("date").sort_index()
    return daily_temp_df

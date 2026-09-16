"""
2. Manipulating Data for Asthma Exacerbation Risk calculations

According to studies one cannot rely solely on the current data values to predict
the risk of a possible exacerbation. The diural temperature range (DTR) for example
is more of an indicating factor than the raw current temperature value. The mean of
 the last 24 hours of air quality factors (nitrogen dioxide and PM2.5) and last 8
hours of ozone should be taken into account. As for the relative humidity the mean
as well as the difference value of the last 24 hours have to be calculated. The
difference value is by definition the current mean minus the previous mean of the
same time period (24 hours). Generally, an asthma exacerbation depends mostly on
the daily concentration of pollen with a lag of 0-4 days.
"""

import pandas as pd
from environmental_factors import fetching_environmental_data as env
from schemas import PatientInput, EnvironmentalFactors


def add_rolling_aq_mean(df: pd.DataFrame):
    air_quality_df = pd.DataFrame(index=df.index)

    air_quality_df['Moving PM2.5 mean'] = df['pm2_5'].rolling(window = 24).mean()
    air_quality_df['Moving NO2 mean'] = df['nitrogen_dioxide'].rolling(window = 24).mean()
    air_quality_df['Moving O3 mean'] = df['ozone'].rolling(window = 8).mean()

    return air_quality_df

def add_rolling_pollen_mean(df: pd.DataFrame):
    pollen_df = pd.DataFrame(index = df.index)

    pollen_df['Birch Pollen mean'] = df['birch_pollen'].rolling(window = 72).mean()
    pollen_df['Grass Pollen 72H shifted mean'] = df['grass_pollen'].rolling(window = 72).mean()
    pollen_df['Ragweed Pollen mean'] = df['ragweed_pollen'].rolling(window = 72).mean()


    return pollen_df

def add_relative_range(df: pd.DataFrame):
    rh_df = pd.DataFrame(index = df.index)

    rh_df['rh_mean'] = df['relative_humidity_2m'].rolling(window = 24).mean()
    rh_df['rh_diff'] = rh_df['rh_mean'] - rh_df['rh_mean'].shift(24)
    return rh_df

def add_range(df: pd.DataFrame):
    temp_df = pd.DataFrame(index = df.index)

    temp_df['temp_diff'] = df['temperature_2m_max'] - df['temperature_2m_min']
    temp_df.reset_index(inplace = True)
    return temp_df

def get_current_time(df: pd.DataFrame) -> pd.Timestamp:
    df.reset_index(inplace = True)
    current_time = pd.Timestamp.now(df['date'].dt.tz)
    current_row = df[
        (df['date'].dt.date == current_time.date())&
        (df['date'].dt.hour == current_time.hour)
    ]
    # print(current_row)
    return current_row

def final_factors(latitude: float, longitude: float) -> EnvironmentalFactors:
    # Fetching the hourly data
    aq = env.fetch_air_quality(latitude, longitude)
    pollen = env.fetch_pollen(latitude, longitude)
    rh = env.fetch_rh(latitude, longitude)
    temp = env.fetch_temperature(latitude, longitude)


    current_aq_row = get_current_time(add_rolling_aq_mean(aq))
    current_pollen_row = get_current_time(add_rolling_pollen_mean(pollen))
    current_rh_row = get_current_time(add_relative_range(rh))

    temp_df = add_range(temp)
    get_current_date = pd.Timestamp.now(temp_df['date'].dt.tz).date()
    temp_row = temp_df[(temp_df['date'].dt.date == get_current_date)]
    # print(temp_row)

    return EnvironmentalFactors(
        current_PM25_mean = float(current_aq_row['Moving PM2.5 mean'].iloc[0]),
        current_NO2_mean = float(current_aq_row['Moving NO2 mean'].iloc[0]),
        current_O3_mean = float(current_aq_row['Moving O3 mean'].iloc[0]),
        birch_pollen_72H_mean = float(current_pollen_row['Birch Pollen mean'].iloc[0]),
        grass_pollen_72H_mean = float(current_pollen_row['Grass Pollen 72H shifted mean'].iloc[0]),
        ragweed_pollen_72H_mean = float(current_pollen_row['Ragweed Pollen mean'].iloc[0]),
        mean_RH_difference = float(current_rh_row['rh_diff'].iloc[0]),
        current_temp_diff = float(temp_row['temp_diff'].iloc[0])
    )

# final_factors()

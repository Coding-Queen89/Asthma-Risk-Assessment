Asthma is a chronic condition affecting the bronchial tubes, causing inflammation and narrowing of the airways. While medications and the right treatment plan can help reduce symptoms, the disease remains incurable. Asthma causes around half a million deaths globally each year, a lot of which could have been prevented with early intervention. The Asthma and Allergy Foundation of America (AAFA) states that adults are 6 times more likely to die from asthma than children.
This prototype is hence a learning goal to investigate the factors that contribute to asthma exacerbations on adults and to provide a risk assessment for the next possible short-term asthma attack.

1. Collect asthma related patient clinical information.


2. Collect RR, OR, Percentage for every field in relation to asthma exacerbations.


3. Retrieve environmental data from an external API.
Initially, the 6 most impacting environmental factors were retrieved from the Open Meteo API and investigated in detail. Particulate Matter (PM2.5), nitrogen dioxide (NO2), ozone (O3), pollen, relative Humidity and temperature predominantly trigger the next exacerbation.

Workflow: The factors were first called in a Jupyter Notebook over the Open Meteo API for better visualisation and data manipulation. Here, 3 Types of Pollen were take into account: Birch, Grass and Ragweed as representative pollen types for trees, grass and weeds respectively. The factors were then carried to a Python script, which was used to retrieve the data from the API and another to calculate the pollen concentration (µg/m³) for the last 72 hours, thus leveraging Separation of Concerns for better data management.

Limitations: The pollen concentration(µg/m³) is calculated by the mean of the last 72 hours according to multiple sources. One source ("https://pmc.ncbi.nlm.nih.gov/articles/PMC5643363/"), however, mentioned that grass pollen has a lag of 3 days. Nonetheless, shift was not considered in the calculations due to incosistency and possible out of date values.
Open Meteo API takes data from Satellites instead of weather stations, which limits the accuracy of the Air Quality data.

4. Standardize acquired input into an internal data structure (JSON).
Workflow: Created model.py using the pydantic library to collect the data from different sources and create a unified data structure.





Only God Knows what I am doing:
1. Prepared Schemas.py: This is a pydantic model that defines the structure of the data. All models will import schemas.py and call it to take the required fields. This just works as a serialization layer between the different models.
For example, export.py will take PatientState and export it to a JSON file, in order to then be converted to FHIR. RiskEngine.py will need, for instance, the RiskFactors class imported from schemas.py to calculate the risk score.
2. To create a unifidd JSON file, I assigned the Frontend input data a seperate api_routes.py file. Both clinical_dynamic_factors.py and clinical_baseline_factors.py will import api_routes.py to get the data from the Frontend. Initially both files imported schemas and api_routes. However, according to LLM Deepseek this could lead to a cyclic import. Therefore, I moved the import of schemas.py to the top of the file and removed the import of api_routes.py.
The data flow is currently as follows: api takes artificial data, and passes it to schemas.py, which creates a PatientInput object and validates data. The API subsequently calls clinical_dynamic_factors and clinical_baseline_factors then take the data from api_routes and pass it to the respective schemas.
Environmental data still need to retrieve the longtitude and latitude from the Frontend.

Risk-factors.py is ready and contains the main data structure for the Risk Engine. Further parsing of data to JSON is in this stage unnecessary.

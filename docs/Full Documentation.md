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


5. Apply evidence-informed risk rules.  AND
6. Calculate a risk category.
To calculate the risk score from a set of different risk factors, the catergories were changed to continuous, threshold and boolean. Starting from the baseline given for continuous datatypes either in clinical studies or from WHO standards, the log odds of the effect type was multiplied by the difference between the current value and the baseline value per unit scale. The log odds of the boolean factors directly added to the final risk score, given that the current value is True. Should the factor have a threshold effect, like BMI, the log odds was only added if the current value was above the baseline value.

I am honestly not sure if I should include a pydantic model for the PEF_Overrides and risk categories. For now I added them.

PEF Overrides: The PEF overrides the risk score, if the current PEF is on a more dangerous level than the category given by the risk score. A 0-49 % percentile of the best PEF is a given for a medical emergency, hence overrides the score and outputs the medical emergency category. Likewise, a 50-79 percentile proves to be a moderate risk and should by default output the moderate risk category regardless, whether the score is low or moderate. On the other hand, how can PEF be above 80% with controlled asthma, if the score and especially the SABA_use is high? If it is rather the environmental factors that are contributing to the asthma attack, then that would make sense, for the presence of high risk does not necessarily mean that the patient is in medical emergency, however, SABA_use is another angle.

Both Risk Category and Risk Score will be packed in a Pydantic model: DerivedRisk and passed on to the PatientState model, which contains all relevant data for clinical FHIR transport. Upon export, only this model will be exported.

Step 8 adding contributing results only need to be added to DerivedRisk, so I added it in the corresponding Pydantic model, risk_engine.py and patient_state.py. Should I add the percentage of the contribution?????

Screenshot in docs displays first version of the MVP backend. Input data in one JSON file, Risk Factors calculated, collected and stored in another, and Risk Score and Risk Category computed, calculated and sent over to PatientState. At the end of api_routes the PatientState is dumped to a JSON file.

Limitations: The weight was calculated by ln(OR), ln(RR), ln(aOR), ln(aRR) and ln(IRR) for all datatypes, which is not necessarily accurate. Furthermore, the effect (OR= 1.45) of short-acting Beta-Agonists(SABA) was calculated weekly and not yearly. Primitively, the recognized study declared 2 or more canisters of SABA annually as the cause of a asthma attack with the mentiioned OR. However, in order to properly calculate the short term exacerbation risk, the number of puffs per canister (200) was divided by the weeks in a year (52) to get the weekly average of 8 puffs. The risk was then carried as a continuous factor of 2 or more puffs daily. I still need to add the right explanations for the PEF_Overrides and Risk Categories.

7. Connect backend to FastAPI and create an SQLite database.
With two main Methods from FastAPI, I managed to create and understand the connections one needs to make to get and post data to the backend. Before moving on to programming the next needed methods, I had to decide which Database I wanted to use and implement it. The decision fell on SQLite using the SQLAlchemy library, as it thus facilitate the migration to more scalable databases like PostgreSQL in the future.

Deepseek AI suggested to use SQLModel instead of SQLAlchemy, as it is a more modern and has excellent support for pydantic models. However, I decided to stick with SQLAlchemy, since it is the standard when the architectural preference tends to be towards Separation of Concerns.
Currently weighing the advantages and disadvantages of including every environmental factor in the Assessment database as a separate column VS including them in a single JSON blob.

One of the hardest parts of the project in my opinion was dealing with FastAPI and database connections simultaneously. In the end, I managed to make 8 endpoints that work together to provide, update and delete patient data. These are the basic endpoints and more are expected to be added in the future.

8. Create a FHIR server and connect it to the FastAPI backend.
Reading about FHIR  and its specifications from their official site with the help of YouTube and LLMs. I clearly need to split the workflow of this step into 2 parts. Converting the PatientState model to FHIR then exporting it to HAPI FHIR, which is apparently the standard for FHIR. I'll install the dependencies.
Mapping values from PatientBase to the Pydantic 2 FHIR model needs only a few fields, since most of FHIR fields are optional. Connecting this to the FastAPI backend is straightforward. However, I realized that a lot of code is copied, especially the validation of assessment and patient. Can I make a separate method for that?

Uncertainty: When the patient clicks on Assessment History, the Assessment ID shown is the one of the database, not its chronological order accoring to the Patient. Is this a problem?

A business identifier is a patient's unique identifier in the real world like Nationaal ID or Medical Record Number. This means that it's a vital field when it comes to healthcare.

Created a LOINC account to be able to get to the LOINC codes for Observations as the FHIR specifications recommended. Whilst I got confused at first as to why the System in LOINC classified BMI as "Patient", the explanation was that FHIR uses the class Patient from LOINC to define the BMI as an Observation. Making Observation for every factor, but some will have to be split as Conditions in FHIR, although they do play as factors in the Risk Engine. Past exacerbations is not a documented factor in LOINC and therefore will have to be Code specified. For Conditions, I needed to look up the codes from SNOMED CT.
Finished Conditions and Observations mapping, but I need to make Observation Method mapping like I did for Conditions. Now I'll download the fhir-validator.jar from HapiFHIR server and validate the exported JSON files before moving on to assessment mapping.
After correcting 84 validation errors and 54 Warnings, I am moving on to assessment mapping. I will have to map each RiskCategory to a FHIR Condition.
Deepseek AI claims that one cannot map the RiskScore from this version of the App, since it is not a calibrated probability, rather a calculated log-odds ratio.
Added RiskAssessment to the Bundle as the last step and I'm now validating the exported JSON files. No errors in the validation.

Limitations: My Medical Emergency category is mapped as certain, although that is not what is meant by the category. I am unsure what to do in this case. I shifted the category ID one level down to avoid colliding with the "certain" category in FHIR. The ID of Low Risk for example is now "negligible" instead of "low", however the Label is unchanged. Consequently, Medical Emergency/Very High Risk is now mapped to "high".

To connect to HAPI FHIR Server, I needed to download docker to initialize their server and be able to send the validated JSON files. The first attempt at sending the bundle seemingly worked, however, I quickly realized that the Bundle was not splitting the fields to Patient, Observations, Conditions and RiskAssessment. This was due to the fact that the Bundle was a collection instead of a transaction bundle. After changing the type and removing the URN:UUIDs of Observation, Condition and RiskAssessment and linking them instead to that of the Patient instead, the bundle was successfully processed by the server. When adding a new RiskAssessment, I wanted to avoid duplicating the patients on the server, while maintaining Patient history. I hence added the ifNoneExist parameter which allowed one Patient to have multiple Observations, Conditions and RiskAssessments.

Problems: Working with a 4GB RAM Laptop for docker was not the easiest task, the server needed a long time to start. According to Gemini, it's my fault that the FHIR server takes so long to start. I need to "-wrap all connections in a try-finally block".

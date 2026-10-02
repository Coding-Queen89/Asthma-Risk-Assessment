# Asthma Environmental Risk Assessment

## Problem

Environmental factors such as air pollution and weather conditions
may contribute to worsening asthma symptoms.

Existing consumer applications provide environmental warnings,
but environmental and clinical information are often handled
separately from interoperable healthcare records.

## Objective

Develop a learning prototype that combines environmental data
with patient information, applies evidence and rule-based
logic to generate the next possible asthma exacerbation score and
represent environmental data, patient information along with the
results using HL7 FHIR.

## Target Users

Patients with asthma.

## Core Workflow

 1. Collect asthma related patient clinical information. ✔️
 2. Collect RR, OR, Percentage for every field in relation to asthma exacerbations. ✔️
 3. Retrieve environmental data from an external API. ✔️
 4. Standardize acquired input into a risk Data Transfer Object. ✔️
 5. Apply evidence-informed risk rules to calculate Derived Risk. ✔️
 6. Display the factors contributing to the result, result & Patient Input. ✔️
 7. Connect backend to FastAPI and create an SQLite database. ✔️
 8. Create a FHIR server and connect it to the FastAPI backend.
 9. Build a solid frontend with React.
10. Deploy the backend and frontend to a server.

## Initial FHIR Resources

- Patient
- Condition
- Observation
- MedicationRequest / MedicationStatement

## MVP

The first version will:

- use synthetic patient data
- retrieve environmental data through an API
- represent relevant patient data using FHIR
- calculate LOW / MODERATE / HIGH risk using explicit rules
- explain which factors contributed to the calculated level
- display corresponding predefined guidance

## Out of Scope

- diagnosis
- autonomous treatment decisions
- real patient data
- prediction of asthma attacks
- machine learning
- smart-inhaler Bluetooth integration

## Future Work

- SMART on FHIR integration
- smart-inhaler data
- World wide pollen data
- machine-learning risk prediction
- personalized risk models
- Add a relational DB
- Support FHIR based imports [previously step 5]
- Contributions to Percentage?
- Mount Media in DB, FastAPI and Frontend
- Authentication and Authorization either via JWT or OAuth2
- Soft delete of paitent records

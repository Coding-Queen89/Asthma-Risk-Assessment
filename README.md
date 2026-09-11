# Asthma Environmental Risk Assessment

## Problem

Environmental factors such as air pollution and weather conditions
may contribute to worsening asthma symptoms.

Existing consumer applications provide environmental warnings,
but environmental and clinical information are often handled
separately from interoperable healthcare records.

## Objective

Develop a learning prototype that combines environmental data
with patient information represented using HL7 FHIR and applies
transparent rule-based logic to generate an environmental asthma
risk level.

## Target Users

Patients with asthma.

## Core Workflow

1. Collect asthma related patient clinical information.
2. Collect RR, OR, Percentage for every field in relation to asthma exacerbations.
3. Retrieve environmental data from an external API.
4. Standardize acquired input into an internal data structure (JSON).
5. Support FHIR based imports and map them to the internal DS.
6. Apply evidence-informed risk rules.
7. Calculate a risk category.
8. Display the factors contributing to the result.
9. Display predefined risk-management guidance.

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

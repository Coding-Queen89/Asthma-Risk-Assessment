# Clinical Dynamic factors

from schemas import  PatientInput, DynamicFactors

def calculate_pef(current, best):
    if best <= 0:
        raise ValueError("Best PEF must be greater than zero.")
    pef = (current / best) * 100
    return pef

def dynamic_factors(api: PatientInput) -> DynamicFactors:
    return DynamicFactors(
        recent_exacerbations = api.recent_exacerbations,
        pef_percent_of_best = calculate_pef(api.current_pef, api.best_pef),
        smoke_exposure = api.smoke_exposure,
        chemical_exposure = api.chemical_exposure,
        saba_use = api.saba_use
    )

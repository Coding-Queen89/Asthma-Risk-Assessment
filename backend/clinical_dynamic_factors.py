# Clinical Dynamic factors

from schemas import  DynamicQuestionnaire, DynamicFactors

def calculate_pef(current, best):
    if best <= 0:
        raise ValueError("Best PEF must be greater than zero.")
    pef = (current / best) * 100
    return pef

def dynamic_factors(questionnaire: DynamicQuestionnaire, pef: float) -> DynamicFactors:
    return DynamicFactors(
        recent_exacerbations = questionnaire.recent_exacerbations,
        current_pef = questionnaire.current_pef,
        pef_percent_of_best = calculate_pef(questionnaire.current_pef, pef),
        smoke_exposure = questionnaire.smoke_exposure,
        chemical_exposure = questionnaire.chemical_exposure,
        saba_use = questionnaire.saba_use
    )

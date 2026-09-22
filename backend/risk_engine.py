"""
yaml factors are collected in a pydantic model.
The model is then used to calculate the Risk Score and Risk Category.

The Risk Engine is responsible for calculating the Risk Score and Risk Category from
the Risk Factors using a LogOdds model.
"""
import math
import yaml
from pathlib import Path
from risk_factors import risk_factors
from schemas import FactorDetails, CategoryDetails, PEF_Override, RiskFactors, DerivedRisk

parent_dir = Path(__file__).parents[1]
yaml_path = parent_dir/"docs"/"config.yaml"

with open(yaml_path, 'r', encoding='utf-8') as f:
    config = yaml.safe_load(f)


def compute_risk(details: list[FactorDetails], rf: RiskFactors) -> dict:
    final_risk_score = 0
    contributions = {}

    for factor in details:
        # PEF will only show a categorical effect
        if factor.effect_value is None:
            continue

        # Get the section of the Risk Factors
        if factor.category == "Dynamic":
            section = rf.dynamic
        elif factor.category == "Baseline":
            section = rf.baseline
        elif factor.category == "Environmental":
            section = rf.environmental
        else:
            raise ValueError(f"\n For {factor.id} no category was found.")

        # Get the required variables for risk calculation
        ID = factor.id
        label = factor.Label
        effect_value = factor.effect_value
        current_value = getattr(section, ID) if getattr(section, ID) is not None else None
        baseline_value = factor.baseline if factor.baseline is not None else 0
        scale = factor.scale if factor.scale is not None else 1
        contribution = 0

        if current_value is None:
            continue

        # Calculate the contribution of each factor and the difference between
        # the input value and the baseline value if needed.
        if factor.datatype == "continuous" and current_value != "None":
            delta = abs(current_value - baseline_value) if factor.direction == "two-sided" else max(current_value - baseline_value, 0)
            contribution = math.log(effect_value) * (delta / scale)

        elif factor.datatype == "threshold" and current_value >= baseline_value:
            contribution = math.log(effect_value)

        elif factor.datatype == "boolean" and current_value == True:
            contribution = math.log(effect_value)

        # Add the contribution to the final risk score
        final_risk_score += contribution
        contributions[factor.Label] = round(float(contribution), 3)

        # print(f"\nThe current value of {label} with the ID {ID} is: {current_value}.\nThe baseline value and scale are: {baseline_value}, {scale} respectively.\nThe contribution of the factor is: {contribution}.")

    return {
        "risk_score": round(float(final_risk_score), 3),
        "factor_contribution": contributions
    }

def compute_category(categories: list[CategoryDetails], pef_overrides: list[PEF_Override], risk_score: float, pef_of_best: float) -> dict:

    risk_category_ind = 0
    risk_category = categories[0].Label
    risk_color = categories[0].color
    asthma_state = pef_overrides[0].asthma_state
    risk_guidance = categories[0].guidance
    risk_explanation = categories[0].explanation

    for index, category in enumerate(categories):
        if risk_score <= category.max_score:
            risk_category_ind = index
            risk_category = category.Label
            risk_color = category.color
            risk_guidance = category.guidance
            risk_explanation = category.explanation
            break

    # print(f"\nThe Risk Category is: {risk_category} with ind: {risk_category_ind}.")

    for override in pef_overrides:
        if pef_of_best >= override.min_percent:
            if override.override and risk_category_ind < override.target_ind:
                risk_category = categories[override.target_ind].Label
                risk_color = categories[override.target_ind].color
                asthma_state = override.asthma_state
                risk_guidance = categories[override.target_ind].guidance
                risk_explanation = override.explanation
                break
            else:
                break

    return {
        "risk_category": risk_category,
        "asthma_state": asthma_state,
        "risk_color": risk_color,
        "risk_explanation": risk_explanation,
        "risk_guidance": risk_guidance
    }


def risk_engine(rf: RiskFactors) -> DerivedRisk:
    categories = [CategoryDetails(**category) for category in config["Categories"]]
    pef_overrides = [PEF_Override(**override) for override in config["PEF_Overrides"]]
    details = [FactorDetails(**factor) for factor in config["Factors"]]
    pef_of_best = rf.dynamic.pef_percent_of_best

    risk_score = compute_risk(details, rf)
    risk_details = compute_category(categories, pef_overrides, risk_score["risk_score"], pef_of_best)

    return DerivedRisk(
        risk_category = risk_details["risk_category"],
        risk_score = risk_score["risk_score"],
        asthma_state = risk_details["asthma_state"],
        risk_color = risk_details["risk_color"],
        factor_contribution = risk_score["factor_contribution"],
        risk_explanation = risk_details["risk_explanation"],
        risk_guidance = risk_details["risk_guidance"]
    )


if __name__ == "__main__":
    print("End of Factors")

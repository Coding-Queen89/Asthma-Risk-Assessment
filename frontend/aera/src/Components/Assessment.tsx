import { Text, View, StyleSheet} from "react-native";
import { globalStyles, colors,fonts } from "../styles/global";
import Button from "./Button";
import api from "../api";

type RiskScoreProps = {
    riskCategory : string;
    riskScore : number;
    pefPercentOfBest : number;
    asthmaState : string;
    riskColor : string;
    factorContribution : object;
    riskExplanation : string;
    riskGuidance : string;
};

export default function Assessment({riskCategory, riskScore, pefPercentOfBest, asthmaState, riskColor, factorContribution, riskExplanation, riskGuidance}: RiskScoreProps) {

    const risk_score = riskScore;
    const pef_percent_of_best = pefPercentOfBest;
    const risk_category = riskCategory;
    const asthma_control = asthmaState;
    const risk_guidance = riskGuidance;
    const risk_explanation = riskExplanation;

    return (
        <View style = {[styles.assessmentContainer, {backgroundColor: riskColor}]}>
            <View style = {styles.assessmentScore}>
                <Text style = {globalStyles.title}> {risk_score} </Text>
                <Text style = {globalStyles.title}> {pef_percent_of_best} %</Text>
            </View>
            <View style = {styles.asthmaControl}>
                <Text style = {globalStyles.subTitle}> {risk_category} </Text>
                <Text style = {globalStyles.details}> Asthma Control: {asthma_control} </Text>
            </View>
            <View style = {styles.riskGuidance}>
                <Text style = {[globalStyles.details, styles.italics]}> {risk_guidance} </Text>
                <Text style = {[globalStyles.details, styles.italics]}> {risk_explanation} </Text>
            </View>
            {/* <Button
                label = "Export your Assessment"
                onPress = {() => router.push("./myAssessment")}
            /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    assessmentContainer: {
        // backgroundColor: colors.riskLow,
        padding: 20,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 26,
    },
    italics: {
        fontStyle: "italic",
    },
    assessmentScore: {
        // flexDirection: "row",
        // justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    asthmaControl: {
        alignItems: "center",
        marginBottom: 10,
    },
    riskGuidance: {
        marginBottom: 5,
    },
});

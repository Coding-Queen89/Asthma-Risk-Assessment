import { globalStyles,colors } from "../styles/global";
import {useState, useEffect, use} from "react";
import { Text, ScrollView, Alert} from "react-native";
import { router } from "expo-router";
import Button from "../Components/Button";
import Assessment from "../Components/Assessment";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";



export default function myAssessmentScreen() {

    const [username, setUsername] = useState("");
    const [nameOfPatient, setNameOfPatient] = useState("");

    const [riskScore, setRiskScore] = useState<number>(0);
    const [riskCategory, setRiskCategory] = useState<string>("");
    const [pefPercentOfBest, setPefPercentOfBest] = useState<number>(0);
    const [asthmaState, setAsthmaState] = useState<string>("");
    const [riskColor, setRiskColor] = useState<string>("");
    const [factorContribution, setFactorContribution] = useState<object>({});
    const [riskExplanation, setRiskExplanation] = useState<string>("");
    const [riskGuidance, setRiskGuidance] = useState<string>("");
    const [hasData, setHasData] = useState<boolean>(false);

    const derivedRiskScore = async () => {
        try {
            const userName = await AsyncStorage.getItem("username");
            // const nameOfPatient = await AsyncStorage.getItem("nameOfPatient");

            if (!userName) {
                throw new Error("No username found.");
            }

            setUsername(userName);
            // setNameOfPatient(nameOfPatient ?? "");


            const response = await api.post(`/patients/${userName}/assessments/`);
            setRiskScore(response.data.risk_score);
            setRiskCategory(response.data.risk_category);
            setPefPercentOfBest(response.data.pef_percent_of_best);
            setAsthmaState(response.data.asthma_state);
            setRiskColor(response.data.risk_color);
            setFactorContribution(response.data.factor_contribution);
            setRiskExplanation(response.data.risk_explanation);
            setRiskGuidance(response.data.risk_guidance);
            setHasData(true);
            console.log(response.data.pef_percent_of_best);
            // router.push('/myAssessment');
            // return response;
        } catch (error) {
            Alert.alert("Error", "Please make sure you have completed the Dynamic Questionnaire.");
        }
    };

    useEffect(() => {
        derivedRiskScore();
    }, []);

    return (
        <ScrollView style = {globalStyles.screenContainer}>
            {hasData && <Assessment

                riskCategory = {riskCategory}
                riskScore = {riskScore}
                pefPercentOfBest = {pefPercentOfBest}
                asthmaState = {asthmaState}
                riskColor = {riskColor}
                factorContribution = {factorContribution}
                riskExplanation = {riskExplanation}
                riskGuidance = {riskGuidance}
            />}
        </ScrollView>
    );
}

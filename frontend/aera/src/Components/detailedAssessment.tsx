import { Text, View, StyleSheet, ActivityIndicator} from "react-native";
import { useState, useEffect } from "react";
import { globalStyles, colors } from "../styles/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "./Button";
import api from "../api";

type DetailedAssessmentProps = {
    assessmentId: string;
    createdAt: string;
};

// FORMATTING CREATEDAT TO FIT THE STANDARD OF UI
function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

export default function DetailedAssessment({assessmentId, createdAt}: DetailedAssessmentProps) {

    const [username, setUsername] = useState("");
    const [nameOfPatient, setNameOfPatient] = useState("");
    const [assessment, setAssessment] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect (() => {
        const loadAssessment = async () => {
            try {
                const userName = await AsyncStorage.getItem("username");
                // const nameOfPatient = await AsyncStorage.getItem("nameOfPatient");

                if (!userName) {
                    throw new Error("No username found.");
                }

                setUsername(userName);
                // setNameOfPatient(nameOfPatient ?? "");

                const response = await api.get(`/patients/${userName}/assessments/${assessmentId}`);
                setAssessment(response.data);
                // console.log(response.data.exacerbation_risk.factor_contribution);
            } catch (error) {
                console.log("There was an error loading the assessment");
            } finally {
                setLoading(false);
            }
        };
        loadAssessment();
    }, []);

    // AS LONG AS THE ASSESSMENT IS STILL LOADING, DON'T TRY TO ACCESS THE DATA
    if (loading) {
        return (
            <View>
                <ActivityIndicator size = "large" color = {colors.textSecondary} />
            </View>
        );
    }
    // IF THE ASSESSMENT IS NOT LOADED, RETURN A MESSAGE
    if (!assessment) {
        return (
            <View>
                <Text style = {[globalStyles.details]}> Assessment not found </Text>
            </View>
        );
    }
    const factors = assessment.exacerbation_risk.factor_contribution as Record<string, number>;
    return (
        <View >
            <View >
                <Text style = {[globalStyles.details]}> Assessment ID: {assessmentId} </Text>
                <Text style = {[globalStyles.details]}> Taken on: {formatDate(createdAt)} </Text>
                <Text style = {[globalStyles.details]}> Category: {assessment.exacerbation_risk.risk_category} </Text>
                <Text style = {[globalStyles.details]}> Score: {assessment.exacerbation_risk.risk_score} </Text>
                <Text style = {[globalStyles.details]}> PEF: {assessment.risk_factors.dynamic.pef_percent_of_best} </Text>
                <Text style = {[globalStyles.details]}> Asthma Control: {assessment.exacerbation_risk.asthma_state} </Text>
                {Object.entries(factors).filter(([key, value]) => value > 0).map(([key, value]) => (
                    <View key = {key} style = {{flexDirection: "row"}}>
                        <Text style = {[globalStyles.details]}> {key} : </Text>
                        <Text style = {[globalStyles.details]}> + {value} </Text>
                    </View>
                ))}
                <Button
                    label = "Export your Assessment"
                    onPress = {() => console.log("Export your Assessment")}
                    style = {styles.button}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.mainBackground,
        fontSize: 16,
        color: colors.textSecondary,
    },
});

import { globalStyles } from "../styles/global";
import api from "../api";
import {useState, useEffect} from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, ScrollView, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PastAssessmentCard from "../Components/pastAssessmentCard";

export default function PastAssessmentsScreen() {
    const insets = useSafeAreaInsets();

    const [username, setUsername] = useState("");
    const [nameOfPatient, setNameOfPatient] = useState("");
    const [assessments, setAssessments] = useState<any[]>([]);

    useEffect(() => {
        const loadAssessments = async () => {
            try {
                const userName = await AsyncStorage.getItem("username");
                // const nameOfPatient = await AsyncStorage.getItem("nameOfPatient");

                if (!userName) {
                    throw new Error("No username found.");
                }

                setUsername(userName);
                // setNameOfPatient(nameOfPatient ?? "");

                const response = await api.get(`/patients/${userName}/assessments`);
                setAssessments(response.data);
            } catch (error) {
                console.log("There was an error loading the assessments");
            }
        };
        loadAssessments();
    }, []);


    return (
        <ScrollView style = {globalStyles.screenContainer}  contentContainerStyle = {{paddingBottom: insets.bottom + 40}}>
            <Text style = {globalStyles.title}> Past Assessments </Text>
            <View style = {globalStyles.mainContainer}>
                {assessments.map((mappedDetail) => (
                    <PastAssessmentCard
                        key = {mappedDetail.assessment_id}
                        assessmentNumber = {assessments.indexOf(mappedDetail) + 1}
                        assessmentId = {mappedDetail.assessment_id}
                        createdAt = {mappedDetail.created_at}
                        riskCategory = {mappedDetail.risk_category}
                        riskScore = {mappedDetail.risk_score}
                        onExport = {() => console.log("Export: ", mappedDetail.assessment_id)}
                    />
                ))}
            </View>
        </ScrollView>
    );
}

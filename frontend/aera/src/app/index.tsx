import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Text, ScrollView, View, StyleSheet} from "react-native";
import { globalStyles } from "../styles/global";
import Header from "../Components/Header";
import LastAssessmentHeaderCard from "../Components/lastAssessmentHeaderCard";
import Button from "../Components/Button";
import {getUsername,getNameOfPatient} from "../auth/username";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function HomeScreen() {
  const router = useRouter();
  const date = new Date().toLocaleDateString(
    "de-DE",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const [username, setUsername] = useState("");
  const [nameOfPatient, setNameOfPatient] = useState("");

  useEffect(() => {
    const getPatientInfo = async () => {
      try {
        const userName = await AsyncStorage.getItem("username");
        // const nameOfPatient = await AsyncStorage.getItem("nameOfPatient");
        if (!userName) {
          throw new Error("No username found.");
        }
        setUsername(userName);
        console.log(userName);

        const patientProfile = await api.get(`/patients/${userName}/my_profile`);
        const data = patientProfile.data;
        setNameOfPatient(data.name);

      } catch (error) {
        console.log("There was an error fetching the username");
      }
    };
    getPatientInfo();
  }, []);

  return (
      <ScrollView style = {globalStyles.screenContainer}>
          <Header />
          <Text style = {globalStyles.title}> Hello, {nameOfPatient}! </Text>
          <Text style = {globalStyles.details}> {date} </Text>
          <LastAssessmentHeaderCard />
          <Button
            label = "Dynamic Questionnaire"
            onPress = {() => router.push("./dynamicQuestionnaire")}
          />
          <Button
            label = "Know your Risk"
            onPress = {() => router.push("./riskAssessment")}
          />
          <Button
            label = "View your past Assessments"
            onPress = {() => router.push("./pastAssessments")}
          />
      </ScrollView>
  );
}

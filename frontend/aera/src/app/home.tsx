import { useState, useEffect, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { ScrollView, View, Text} from "react-native";
import { globalStyles,colors } from "../styles/global";
import Header from "../Components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MessageModal from "../Components/messageModal";
import api from "../api";
import Greeting from "../Components/Greeting";
import LastAssessmentHeaderCard from "../Components/LastAssessmentHeaderCard";
import IndexGrid from "../Components/indexGrid";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {styles} from "../Components/LastAssessmentHeaderCard";

export default function HomeScreen() {
  const router = useRouter();
  const date = new Date().toLocaleDateString(
    "de-DE",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const [username, setUsername] = useState("");
  const [nameOfPatient, setNameOfPatient] = useState("");
  const [lastAssessment, setLastAssessment] = useState<any[]>([]);
  const [hasAssessments, setHasAssessments] = useState(false);
  const [createdAt, setCreatedAt] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  useFocusEffect(
    useCallback(() => {
      const getPatientInfo = async () => {
        try {
          // CALLING USERNAME FROM ASYNC STORAGE
          const userName = await AsyncStorage.getItem("username");
          if (!userName) {
            throw new Error("No username found.");
          }
          setUsername(userName);

          // CALLING PATIENT PROFILE FOR PATIENT NAME FROM API
          const patientProfile = await api.get(`/patients/${userName}/my_profile`);
          const data = patientProfile.data;
          setNameOfPatient(data.name);

          // CALLING ASSESSMENTS FROM API TO CHECK IF USER HAS ASSESSMENTS
          const response = await api.get(`/patients/${userName}/assessments`);
          setLastAssessment(response.data);
          if (response.data.length > 0) {
            setHasAssessments(true);
          } else{
            setHasAssessments(false);
          }

        } catch (error) {
          setModalVisible(true);
          setModalTitle("Error");
          setModalMessage("There was an error fetching the username. Please try again.");
        }
      };
      getPatientInfo();
    }, [])
  );
  return (
      <ScrollView style = {globalStyles.screenContainer}>
          <Header
            showProfile = {true}
            userNameInitial = {username.slice(0, 1).toUpperCase()}
          />

          <Greeting
            nameOfPatient = {nameOfPatient}
          />

            <LastAssessmentHeaderCard
              hasAssessments = {hasAssessments}
              createdAt = {lastAssessment.length > 0 ? lastAssessment[0].created_at : ""}
            />

          <IndexGrid
            hasAssessments = {hasAssessments}
          />

          {lastAssessment.length < 1 && (
              <View style = {styles.remark}>
                  <MaterialCommunityIcons name = "information-outline" size = {20} color = {colors.mediumRisk} />
                  <Text style = {[globalStyles.details, styles.remarkText]}> AERA is a demo App meant for educational purposes only and does not replace professional medical advice, diagnosis or treatment. </Text>
              </View>
          )}

          {/* MESSAGEMODAL */}
          <MessageModal
              visible = {modalVisible}
              title = {modalTitle}
              message = {modalMessage}
              onClose = { () => {
                console.log("There was an error fetching the username")
                setModalVisible(false);
              }}
          />
      </ScrollView>
  );
}

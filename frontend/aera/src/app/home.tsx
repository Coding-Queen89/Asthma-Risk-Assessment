import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { ScrollView, View, Text, StyleSheet} from "react-native";
import { globalStyles,colors } from "../styles/global";
import Header from "../Components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MessageModal from "../Components/messageModal";
import Button from "../Components/Button";
import api from "../api";
import Greeting from "../Components/Greeting";
import LastAssessmentHeaderCard from "../Components/LastAssessmentHeaderCard";
import IndexGrid from "../Components/indexGrid";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  const router = useRouter();
  const date = new Date().toLocaleDateString(
    "de-DE",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const [username, setUsername] = useState("");
  const [nameOfPatient, setNameOfPatient] = useState("");
  const [hasAssessments, setHasAssessments] = useState(false);


  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

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

        const assessments = await api.get(`/patients/${userName}/assessments`);
        if (assessments.data.length > 0) {
          setHasAssessments(true);
        }

      } catch (error) {
        setModalVisible(true);
        setModalTitle("Error");
        setModalMessage("There was an error fetching the username. Please try again.");
      }
    };
    getPatientInfo();
  }, []);

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
          />

          <IndexGrid
            hasAssessments = {hasAssessments}
          />

          <View style = {styles.remark}>
              <MaterialCommunityIcons name = "information-outline" size = {20} color = {colors.mediumRisk} />
              <Text style = {[globalStyles.details, styles.remarkText]}> AERA is a demo App meant for educational purposes only and does not replace professional medical advice, diagnosis or treatment. </Text>
          </View>

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


const styles = StyleSheet.create({
  remark: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.warningSurface,
    borderRadius: 16,
    borderColor: colors.mediumRisk,
    borderWidth: 1,
    gap: 5,
    padding: 5,
  },
  remarkText: {
    fontSize: 11,
    color: colors.mediumRisk,
    textAlign: "center",
  },
});

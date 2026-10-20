import { Text, View, StyleSheet} from "react-native";
import { globalStyles, colors } from "../styles/global";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import Button from "./Button";
import api from "../api";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type LastAssessmentHeaderCardProps = {
    hasAssessments: boolean;
    createdAt: string;
};

// FORMATTING CREATEDAT TO FIT THE STANDARD OF UI
function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function LastAssessmentHeaderCard({hasAssessments, createdAt}: LastAssessmentHeaderCardProps) {

    const [assessment, setAssessment] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAssessment = async () => {
            try {
                const userName = await AsyncStorage.getItem("username");
                const assessment = await api.get(`/patients/${userName}/assessments`);
                setAssessment(assessment.data);
            } catch (error) {
                setAssessment(null);
            } finally {
                setLoading(false);
            }
        };
        getAssessment();
    }, []);

    if (!hasAssessments) {
        return (
            <View style = {[globalStyles.mainContainer, {alignItems: "center"}]}>
                <View style = {styles.iconCircle}>
                    <MaterialCommunityIcons name = "clipboard-text-outline" size = {60} color = {colors.white} />
                </View>
                <Text style = {[globalStyles.subTitle2, styles.emptyTitle]}> No Assessments Found yet </Text>
                <Text style = {[globalStyles.subTitle, styles.emptySubtitle]}>You haven't completed any asthma risk assessments yet. Start a new assessment to see your results here.</Text>
                <Button
                    label = "Take Assessment"
                    onPress = {() => router.push("./myAssessment")}
                    style = {{width: "100%"}}
                />
            </View>
        );
    }

    return (
        <View style = {[globalStyles.mainContainer]}>
            <View>
               <Text style = {[globalStyles.subTitle2]}> Your Last Assessment </Text>
               <Text style = {[globalStyles.subTitle2]}> {formatDate(createdAt)} </Text>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primaryBlue,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    textAlign: "center",
    marginBottom: 8,
    color: colors.white,
  },
  emptySubtitle: {
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 20,
  },
});

import { globalStyles,colors } from "@/styles/global";
import { useEffect, useState, useCallback } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import {router, useFocusEffect} from "expo-router";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";


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

export default function RecentAssessments() {
    const [recentAssessments, setRecentAssessments] = useState<any[]>([]);
    useFocusEffect(
        useCallback(() => {
            const getAssessment = async () => {
                try {
                    const userName = await AsyncStorage.getItem("username");
                    const assessment = await api.get(`/patients/${userName}/assessments`);

                    // REVERSE ARRAY TO GET NEWEST FIRST. FIX THE BACKEND WHEN RAILWAY IS FIXED
                    const newestFirst = [...assessment.data].reverse();
                    setRecentAssessments(newestFirst.slice(0, 3));
                } catch (error) {
                    console.log("There was an error fetching the assessments");
                    return null;
                }
            };
            getAssessment();
        }, [])
    );

    return (
        <View>
            <View style = {[globalStyles.rowContainer, styles.container]}>
                <Text style = {globalStyles.subTitle2}> Recent Assessments </Text>
                <Pressable
                    onPress = {() => router.push("./pastAssessments")}
                >
                    <Text style = {[styles.viewLink]}> View All <Ionicons name="chevron-forward" size={12} /> </Text>
                </Pressable>
            </View>

            {recentAssessments.map((mappedDetail) => {
                const risk = mappedDetail.risk_category;
                if (!risk)  {console.log("No Risk"); return null;}
                return (
                    <View key = {mappedDetail.assessment_id} style = {[globalStyles.rowContainer, globalStyles.mainContainer, styles.recentAssessmentContainer]}>
                        <View style = {[styles.riskBox]}>
                            <Text>{risk}</Text>
                        </View>
                        <Text style = {[globalStyles.superDetails]}>{formatDate(mappedDetail.created_at)}</Text>
                        <View>
                            <Text style = {[globalStyles.details]}> Score </Text>
                            <Text style = {[globalStyles.superDetails]}> {mappedDetail.risk_score}</Text>
                        </View>
                    </View>
                );
            })}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "space-between",
        marginBottom: 12,
    },
    viewLink: {
        fontSize: 14,
        color: colors.lightBlue,
        fontWeight: "bold",
    },
    recentAssessmentContainer: {
        justifyContent: "space-between",
        marginBottom: 12,
        paddingVertical: 8,
        paddingLeft: 16,
        gap: 8,
    },
    riskBox: {
        backgroundColor: colors.purple,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        alignItems: "center",
    },
});

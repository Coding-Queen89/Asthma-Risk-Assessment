import { useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { globalStyles, colors } from "../styles/global";
import DetailedAssessment from "./detailedAssessment";

type PastAssessmentProps = {
    assessmentNumber: number;
    assessmentId: string;
    createdAt: string;
    riskCategory: string;
    riskScore: number;
    onExport: (assessmentId: string) => void;
};

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}


export default function PastAssessmentCard({assessmentNumber, assessmentId, createdAt, riskCategory, riskScore, onExport}: PastAssessmentProps) {

  const [expanded, setExpanded] = useState(false);
  return (
    <View style = {styles.cardContainer}>
      <Pressable onPress = {() => setExpanded(!expanded)} style = {styles.chevronContainer}>
        <View style = {styles.cardContainer}>
          <Text style = {[globalStyles.subTitle2]}> Assessment {assessmentNumber} </Text>
          <Text style = {[globalStyles.text, styles.extra]}> Category: {riskCategory} </Text>
          <Text style = {[globalStyles.text, styles.extra]}> Score: {riskScore} </Text>
          <Text style = {[globalStyles.text, styles.extra]}> Taken on: {formatDate(createdAt)} </Text>
        </View>
        <Text style={styles.chevron}>{expanded ? "▲" : "▼"}</Text>
      </Pressable>

      {expanded && (
        <DetailedAssessment
          assessmentId = {assessmentId}
          createdAt = {createdAt}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.surfaceLight,
    // flexDirection: "row",
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 16,
  },
  chevronContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

  },
  darkTitle: {
    color: colors.textDark,
    fontSize: 18,
    fontWeight: "bold",
  },
  chevron: {
    color: colors.primary,
    fontSize: 16,
    marginLeft: 8,
  },
  extra: {
    color: colors.primary,
    fontWeight: "bold",
  },
});

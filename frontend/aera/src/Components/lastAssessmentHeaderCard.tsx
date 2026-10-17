import { Text, View, StyleSheet} from "react-native";
import { globalStyles, colors } from "../styles/global";

export default function LastAssessmentHeaderCard() {
    const username = "John Doe";
    const riskCategory = "High Risk";
    const riskColor = "#d73a49";
    const riskScore = 8.32;
    const asthmaControl = "Well Controlled";
    const currDate = new Date().toLocaleDateString(
        "de-DE",
        { day: "numeric", month: "short", year: "numeric" }
    );

    return (
        <View style = {styles.cardContainer}>
            <View style = {styles.header}>
                <Text style = {styles.headerTitle}> Your Last Assessment </Text>
                <Text style = {styles.headerDate}> {currDate} </Text>
            </View>
            <View style = {styles.mainDetails}>
                <View style = {[styles.categoryIcon, { backgroundColor: riskColor }]}>
                    <Text style = {styles.iconText}>!</Text>
                </View>
                <View style = {styles.pastAssessment}>
                    <Text style = {globalStyles.details}> Category: {riskCategory} </Text>
                    <Text style = {globalStyles.details}> Score: {riskScore} </Text>
                    <Text style = {globalStyles.details}> PEF: {asthmaControl} </Text>
                </View>
            </View>
            <View style = {styles.disclaimer}>
                <Text style = {[globalStyles.details, styles.italics]}> Disclaimer: This is a demo app and is not a real risk assessment.  </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.surface,
    padding: 20,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 26,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  mainDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  categoryIcon: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    width: 48,
    height: 48,
    borderRadius: 48,
  },
  pastAssessment: {
    flex: 1,
  },
  disclaimer: {
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "left",
  },
  headerDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "right",
  },
  iconText: {
    fontSize: 24,
    color: "gold",
    fontWeight: "bold",
  },
  italics: {
    fontStyle: "italic",
  },
});

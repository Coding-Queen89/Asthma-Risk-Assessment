import { Text, View, StyleSheet} from "react-native";
import { globalStyles, colors } from "../styles/global";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
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

    const [riskCategory, setRiskCategory] = useState("");
    const [riskScore, setRiskScore] = useState("");
    const [bestPEF, setBestPEF] = useState("");
    const [asthmaState, setAsthmaState] = useState("");
    const [riskColor, setRiskColor] = useState("");
    const [contributingFactorsNumber, setContributingFactorsNumber] = useState(0);

    useEffect(() => {
        const getAssessment = async () => {
            try {
                const userName = await AsyncStorage.getItem("username");
                const assessment = await api.get(`/patients/${userName}/latest_assessment`);
                setAssessment(assessment.data);

                // SET DATA FOR THE CARD
                const derivedRiskDetails = assessment.data.exacerbation_risk;

                setRiskCategory(derivedRiskDetails.risk_category);
                console.log(derivedRiskDetails.risk_category);
                setRiskScore(derivedRiskDetails.risk_score);
                setBestPEF(derivedRiskDetails.pef_percent_of_best);
                setAsthmaState(derivedRiskDetails.asthma_state);
                setRiskColor(derivedRiskDetails.risk_color);
                const fieldCounts = Object.keys(derivedRiskDetails.factor_contribution).filter(key => derivedRiskDetails.factor_contribution[key] > 0).length;
                setContributingFactorsNumber(fieldCounts);

            } catch (error) {
                setAssessment(null);
            } finally {
                setLoading(false);
            }
        };
        getAssessment(); //Calls the method although there are no assessments Error
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
            {/* CARD HEADER TITLE AND DATE */}
            <View style = {styles.headerRow}>
                <View>
                    <Text style = {[globalStyles.smallCardHeader]}> Your Last Assessment </Text>
                    <Text style = {[globalStyles.superDetails, {marginTop: 2}]}> {formatDate(createdAt)} </Text>
                </View>
                <Button
                    label="View Details >"
                    size="small"
                    onPress={() => router.push("/myAssessment")}
                    style={{ width: "auto", paddingHorizontal: 9, paddingVertical: 2, marginRight: 0, backgroundColor: colors.elevatedSurface, borderRadius: 40, borderColor: colors.elevatedSurface, borderWidth: 1}}
                />
            </View>

            {/* LATEST ASSESSMENT DETAILS */}
            <View style = {styles.latestAssessmentDetails}>
                {/* LEFT STATUS BOX */}
                <View style={[styles.statusBox, { backgroundColor: riskColor }]}>
                    <MaterialCommunityIcons name="alert" size={28} color={colors.warningSurface} />
                    <Text style={[globalStyles.smallCardHeader, {textAlign: "center", color: colors.warningSurface}]}>{riskCategory}</Text>
                    <Text style={styles.asthmaState}>{asthmaState.toUpperCase()}</Text>
                </View>

                {/* MIDDLE RISK SCORE BOX */}
                <View style={styles.scoreBox}>
                    <Text style={[globalStyles.smallCardHeader, {color: colors.mutedText}]}>Risk Index <Ionicons name="information-circle-outline" size={12} /></Text>
                    <Text style={[globalStyles.subTitle2, {color: colors.white}]}>{riskScore}</Text>

                    {/* Risiko-Skala */}
                    <View >
                        <Text style={[globalStyles.smallCardHeader, {color: colors.mutedText}]}>Risk Level  <Ionicons name="information-circle-outline" size={12} /></Text>

                        <View style={styles.scaleLabels}>
                            <Text style={[styles.scaleText, riskCategory === "Low Risk" && {fontWeight: "bold", color: riskColor}]}>Low </Text>
                            <Text style={[styles.scaleText, riskCategory === "Moderate Risk" && {fontWeight: "bold", color: riskColor}]}> Moderate </Text>
                            <Text style={[styles.scaleText, riskCategory === "High Risk" && {fontWeight: "bold", color: riskColor}]}> High </Text>
                            <Text style={[styles.scaleText, riskCategory === "Very High Risk" && {fontWeight: "bold", color: riskColor}]}> Very High</Text>
                        </View>
                    </View>
                </View>

                {/* RIGHT FACTOR DETAILS  */}

                <View style={styles.factorDetails}>
                    <View style={[globalStyles.rowContainer, styles.factor]}>
                        <View><MaterialCommunityIcons name="lungs" size={18} color={colors.lightBlue} /></View>
                        <View style={[globalStyles.rowContainer, styles.metricContainer]}>
                            <Text style={globalStyles.details}>PEF: </Text>
                            <Text style={[globalStyles.details, styles.metricValue]}>{bestPEF} %</Text>
                        </View>
                    </View>
                    <View style={[globalStyles.rowContainer, styles.factor]}>
                        <View ><MaterialCommunityIcons name="leaf" size={18} color={riskColor} /></View>
                        <View style={[globalStyles.rowContainer, styles.metricContainer]}>
                            <Text style={[globalStyles.details, {flexWrap: "wrap"}]}>Key Contributors: <Text style={styles.metricValue}>{contributingFactorsNumber} factors</Text></Text>

                        </View>
                    </View>
                </View>
            </View>

            <View style = {styles.remark}>
                <MaterialCommunityIcons name = "information-outline" size = {20} color = {colors.mediumRisk} />
                <Text style = {[globalStyles.details, styles.remarkText]}> AERA is a research prototypeand does not replace professional medical advice, diagnosis or treatment. </Text>
            </View>

            <Button
                label = "Take Assessment"
                onPress = {() => router.push("./myAssessment")}
                style = {{width: "100%"}}
            />
        </View>
    )
}


export const styles = StyleSheet.create({
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  latestAssessmentDetails: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    marginTop: 8,
    gap: 8,
    flex: 1,
  },
  statusBox: {
    padding: 8,
    borderRadius: 16,
    borderColor: colors.elevatedSurface,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "28%",
  },
  scoreBox: {
    padding: 8,
    borderRadius: 16,
    borderColor: colors.elevatedSurface,
    borderWidth: 1,
    flex: 1,
  },
  factorDetails: {
    flex: 1,
    justifyContent: "center",
    gap: 16,
    borderRadius: 16,
    borderColor: colors.elevatedSurface,
    borderWidth: 1,
    padding: 8,
  },
  metricContainer: {
    flex: 1,
  },
  factor: {
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 7,
    backgroundColor: colors.elevatedSurface,
    borderRadius: 14,
    padding: 5,
  },
  asthmaState: {
    fontSize: 11,
    color: colors.primaryBlue,
    textAlign: "center",
    fontWeight: "bold",
  },
  scaleLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    flexWrap: "wrap",
},
metricValue:{
    color: colors.white,
    fontWeight: "bold",
    flexWrap: "wrap",
},
  scaleText: {
    fontSize: 9,
    color: colors.white,
  },

  remark: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "center",
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

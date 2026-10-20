import { Ionicons,MaterialCommunityIcons} from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View, StyleSheet, Pressable} from "react-native";
import {globalStyles, colors} from "../styles/global";

type IndexGridProps = {
    hasAssessments: boolean;
};

export default function IndexGrid({hasAssessments}: IndexGridProps) {
    return (
        <View>
            {/* INFORMATIVE SMALL CARDS */}
            <View style = {[globalStyles.rowContainer, styles.topCards]}>
                <Pressable onPress = {() => router.push("./riskAssessment")} style = {[globalStyles.rowContainer, globalStyles.mainContainer, styles.smallCard]}>
                    <MaterialCommunityIcons name = "shield-check-outline" size = {26} color = {colors.lightBlue} />
                    <View style = {styles.cardTitleContainer}>
                        <Text style={styles.cardTitle}>Know your Risk</Text>
                        <Text style={globalStyles.details}>Learn how environmental and clinical factors can affect your asthma risk.</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.mutedText} />
                </Pressable>

                <Pressable onPress = {() => router.push("./dynamicQuestionnaire")} style = {[globalStyles.rowContainer, globalStyles.mainContainer, styles.smallCard]}>
                    <MaterialCommunityIcons name = "notebook-edit-outline" size = {26} color = {colors.lightBlue} />
                    <View style = {styles.cardTitleContainer}>
                        <Text style={styles.cardTitle}>Update your Diary</Text>
                        <Text style={globalStyles.details}>Always update your dynamic diary to keep track of your asthma risk.</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.mutedText} />
                </Pressable>
            </View>
            {/* PAST ASSESSMENT LOGS ONLY VISIBLE IF USER HAS ASSESSMENTS */}
            {hasAssessments && (
                <View>

                </View>
            )}
            <View style = {[globalStyles.mainContainer, {marginBottom:8}]}>
                <Pressable onPress = {() => router.push("./pastAssessments")} style = {[globalStyles.rowContainer, styles.smallCard]}>
                    <MaterialCommunityIcons name = "clock-outline" size = {26} color = {colors.lightBlue} />
                    <View style = {styles.cardTitleContainer}>
                        <Text style={styles.cardTitle}>View Past Assessments</Text>
                        <Text style={globalStyles.details}>If you want to have a closer look at your past assessments, you can view them here. Studying the patterns of an asthma attack helps prevent one. You can also export your assessment as a FHIR bundle.</Text>
                        <Text style={styles.linkDesign}>Learn More {'>'}</Text>
                    </View>
                </Pressable>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    topCards: {
        gap: 8,
        width: "100%",
        flex:1,
        flexDirection: "row",
    },
    smallCard: {
        paddingRight: 8,
        flex: 1,
        borderWidth: 0,
        alignItems: "flex-start",
    },
    cardTitleContainer: {
        paddingLeft: 7,
        paddingRight: 5,
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.white,
    },
    linkDesign: {
        fontSize: 15,
        color: colors.lightBlue,
        textDecorationLine: "underline",
    },
});

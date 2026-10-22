import { Ionicons,MaterialCommunityIcons} from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View, StyleSheet, Pressable} from "react-native";
import {globalStyles, colors} from "../styles/global";
import RecentAssessments from "./RecentAssessments"

type IndexGridProps = {
    hasAssessments: boolean;
    createdAt?: string;
};

export default function IndexGrid({hasAssessments, createdAt}: IndexGridProps) {
    return (
        <View>
            {/* INFORMATIVE SMALL CARDS */}
            <View style = {[globalStyles.rowContainer, styles.topCards]}>
                <Pressable onPress = {() => router.push("./riskAssessment")} style = {[globalStyles.rowContainer, globalStyles.mainContainer, styles.smallCard]}>
                    <MaterialCommunityIcons name = "shield-check-outline" size = {26} color = {colors.lightBlue} />
                    <View style = {styles.cardTitleContainer}>
                        <Text style={globalStyles.smallCardHeader}>Know your Risk</Text>
                        <Text style={globalStyles.details}>Learn how environmental and clinical factors can affect your asthma risk.</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.mutedText} />
                </Pressable>

                <Pressable onPress = {() => router.push("./dynamicQuestionnaire")} style = {[globalStyles.rowContainer, globalStyles.mainContainer, styles.smallCard]}>
                    <MaterialCommunityIcons name = "notebook-edit-outline" size = {26} color = {colors.lightBlue} />
                    <View style = {styles.cardTitleContainer}>
                        <Text style={globalStyles.smallCardHeader}>Update your Diary</Text>
                        <Text style={globalStyles.details}>Always update your dynamic diary to keep track of your asthma risk.</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.mutedText} />
                </Pressable>
            </View>
            {/* PAST ASSESSMENT LOGS ONLY VISIBLE IF USER HAS ASSESSMENTS */}
            {hasAssessments && (
                <RecentAssessments  />
            )}
            <View style = {[globalStyles.mainContainer, {marginTop: 12, marginBottom:8}]}>
                <Pressable onPress = {() => router.push("./pastAssessments")} style = {[globalStyles.rowContainer, styles.smallCard]}>
                    <MaterialCommunityIcons name = "clock-outline" size = {26} color = {colors.lightBlue} />
                    <View style = {styles.cardTitleContainer}>
                        <Text style={globalStyles.smallCardHeader}>About AERA</Text>
                        <Text style={globalStyles.details}>
                            AERA (Asthma Exacerbation Risk Assessment) combines personal health information with environmental data to provide an evidence-informed assessment of asthma exacerbation risk.

                            By analyzing clinical and environmental risk factors, AERA helps users understand which factors may contribute to a more sever asthma attack.
                        </Text>
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
        alignItems: "flex-start",
        borderColor: colors.elevatedSurface,
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

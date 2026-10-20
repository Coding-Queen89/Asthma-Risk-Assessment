import { Text, View, StyleSheet} from "react-native";
import { globalStyles, colors } from "../styles/global";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import Button from "./Button";

type LastAssessmentHeaderCardProps = {
    hasAssessments: boolean;
};

export default function LastAssessmentHeaderCard({hasAssessments}: LastAssessmentHeaderCardProps) {

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

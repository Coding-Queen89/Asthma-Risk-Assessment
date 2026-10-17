import { globalStyles } from "../styles/global";
import { Text, View, StyleSheet} from "react-native";
import { router } from "expo-router";
import Button from "../Components/Button";

export default function AssessmentsScreen() {

    return (
        <View style = {globalStyles.screenContainer}>
            <Text style = {globalStyles.title}> Short Term Risk Assessment </Text>
            <Button
                label = "Assess your risk"
                onPress = {() => router.push("./myAssessment")}
            />
        </View>
    );
}

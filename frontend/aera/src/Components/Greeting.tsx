import { Text, View, StyleSheet} from "react-native";
import { globalStyles, colors } from "../styles/global";
import {Ionicons} from "@expo/vector-icons";

type GreetingProps = {
    nameOfPatient: string;
};

export default function Greeting({nameOfPatient}: GreetingProps) {
    const riskCategory = "High Risk";
    const riskColor = "#d73a49";
    const riskScore = 8.32;
    const asthmaControl = "Well Controlled";
    const currDate = new Date().toLocaleDateString(
        "de-DE",
        { day: "numeric", month: "short", year: "numeric" }
    );

    return (
            <View style = {styles.greetingContainer}>
                <Ionicons name = "sunny" size = {40} color = {colors.lightBlue}  />
                <View style = {styles.greetings}>
                    <Text style = {globalStyles.title}> Hello, {nameOfPatient}</Text>
                    <Text style = {globalStyles.subTitle}> Let's explore your asthma risk together. </Text>
                </View>
            </View>

    );
}

const styles = StyleSheet.create({
  greetingContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
    // marginTop: 10,
  },
  greetings: {
    marginLeft: 10,
  },
});

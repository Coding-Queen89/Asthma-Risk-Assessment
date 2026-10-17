import { Text, View, StyleSheet} from "react-native";
import {globalStyles} from "../styles/global";

export default function IndexGridScreen() {
    return (
        <View style = {globalStyles.screenContainer}>
            <Text style = {globalStyles.subTitle}> Index Views </Text>
        </View>
    );
}

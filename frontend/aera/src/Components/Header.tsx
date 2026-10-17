import { Text, View, StyleSheet} from "react-native";
import { globalStyles, colors } from "../styles/global";
import { useRouter } from "expo-router";
import Button from "./Button";


export default function Header() {
    const router = useRouter();
    const username = "Avriel_Karpov23";

    return (
        <View style = {styles.header}>
            <View>
                <Text style = {styles.logo}> AERA </Text>
            </View>
            <View>
                <Button
                    label = "My Profile"
                    onPress = {() => router.push("./myProfile")}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingBottom: 50,
    },
    logo:{
        fontSize: 20,
        fontFamily: "Lora-Bold",
        fontWeight: "bold",
        color: "#F4F4F4",
        textAlign: "left",
    },
    username: {
        fontSize: 20,
        color: colors.text,
        textAlign: "right",
        justifyContent: "flex-start",
    },
});

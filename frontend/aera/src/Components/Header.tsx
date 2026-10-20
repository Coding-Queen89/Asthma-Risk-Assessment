import { Text, View, StyleSheet, Pressable} from "react-native";
import {MaterialCommunityIcons, Ionicons} from "@expo/vector-icons";
import { globalStyles, colors } from "../styles/global";
import { useRouter } from "expo-router";
import Button from "./Button";

type HeaderProps = {
    showProfile?: boolean;
    userNameInitial?: string;
};

export default function Header({showProfile = true, userNameInitial}: HeaderProps) {
    const router = useRouter();

    return (
        <View style = {styles.header}>
            {/* SETTING UP LOGO AND BRAND */}
            <View style = {styles.logoContainer}>
                <MaterialCommunityIcons name = "lungs" size = {40} color = {colors.lightBlue} />
                <View style = {styles.brandAndLogo}>
                    <Text style = {styles.logoTitle}> AERA </Text>
                    <Text style = {styles.logoSubtite}> Asthma Exacerbation Risk Assessment </Text>
                </View>

                {showProfile && (
                    <Pressable
                        style={styles.profileButton}
                        onPress={() => router.push("/myProfile")} >

                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{userNameInitial}</Text>
                        </View>
                        <Text style={styles.profileText}>My Profile</Text>
                        <Ionicons name="chevron-forward" size={16} color={colors.mutedText} />
                    </Pressable>
                )}
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
    logoContainer:{
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    brandAndLogo: {
        marginLeft: 2,
        flex: 1,
    },
    logoTitle: {
        fontSize: 22,
        color: colors.white,
        textAlign: "left",
    },
    logoSubtite: {
        fontSize: 8,
        color: colors.mutedText,
        textAlign: "left",
    },
    profileButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.cardBackground,
        paddingVertical: 4,
        paddingHorizontal: 7,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.primaryBlue,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primaryBackgroundBlue,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
     avatarText: {
        color: colors.textSecondary,
        fontWeight: "bold",
        fontSize: 14,
    },
    profileText: {
        color: colors.textSecondary,
        fontSize: 14,
        fontWeight: "500",
        marginRight: 4,
    },
});

import { globalStyles, colors } from "@/styles/global";
import {signInandOutStyle} from "../styles/signInandOutStyles";
import { Text, View, TextInput, StyleSheet, ScrollView} from "react-native";
import { useState } from "react";
import api from "../api";
import Button  from "../Components/Button";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MessageModal from "../Components/messageModal";


export default function LoginScreen() {
    // const for SignIn
    const [username, setUsername] = useState<string>("");
    const [nameOfPatient, setNameOfPatient] = useState<string>("");

    // const for MessageModal
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    const handleSignIn = async () => {
        const trimmedUsername = username.trim();
        const trimmedNameOfPatient = nameOfPatient.trim();

        if (!trimmedUsername) {
            setModalVisible(true);
            setModalTitle("Username is Incorrect.");
            setModalMessage("Please enter your username.");
            return;
        }

        const response = await api.get(`/patients/${trimmedUsername}/exists`);
        const data = response.data;
        await AsyncStorage.setItem("username", trimmedUsername);
        try {
            if (data.exists) {
                const patientProfile = await api.get(`/patients/${trimmedUsername}/my_profile`);
                const nameOfPatient = patientProfile.data.name;
                setNameOfPatient(nameOfPatient);

                setModalVisible(true);
                setModalTitle("Welcome Back");
                setModalMessage(`It's nice to have you back, ${nameOfPatient}!`);

            } else {
                setModalVisible(true);
                setModalTitle("Username is Incorrect.");
                setModalMessage("Please sign up if you want to create a new account.");
            }
            console.log(`Successfully signed up: ${trimmedUsername}`);
        } catch (error) {
            console.log("There was an error signing up");
        }
    };


    return (
        <ScrollView style={signInandOutStyle.loginScreen} contentContainerStyle={{flexGrow: 1, justifyContent: "center"}}>
            <Text style={globalStyles.title}>Welcome to AERA</Text>
            <Text style={[globalStyles.text, { marginTop: 24, marginBottom: 12 }]}>
                Please enter your username to sign In.
            </Text>
            <TextInput
                style={signInandOutStyle.input}
                placeholder="Username"
                placeholderTextColor={colors.muted}
                value= {username}
                onChangeText={setUsername}
                keyboardType="default"
                autoCapitalize="none"
                autoCorrect={false}
            />
            <View style = {signInandOutStyle.buttonContainer}>
                <Button
                    label="Sign In"
                    onPress={handleSignIn}
                    style = {{alignSelf: "stretch"}}
                />
                <Button
                    label="Sign Up"
                    onPress = {() => router.push("./signUp")}
                    size = "small"
                />
            </View>

            {/* MESSAGEMODAL */}
            <MessageModal
                visible = {modalVisible}
                title = {modalTitle}
                message = {modalMessage}
                onClose = {() => {
                    if (modalTitle === "Welcome Back") {
                        router.push("/home");
                    }
                    setModalVisible(false);
                }}
            />
        </ScrollView>
    )
}

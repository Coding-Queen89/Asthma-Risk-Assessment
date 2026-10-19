import { globalStyles, colors } from "@/styles/global";
import {signInandOutStyle} from "../styles/signInandOutStyles";
import { Text, View, TextInput, ScrollView} from "react-native";
import { useState } from "react";
import api from "../api";
import Button  from "../Components/Button";
import MessageModal from "../Components/messageModal";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function SingUpScreen() {
    const [username, setUsername] = useState<string>("");
    const [nameOfPatient, setNameOfPatient] = useState<string>("");

    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    const handleSignUp = async () => {
        const trimmedUsername = username.trim();
        const trimmedNameOfPatient = nameOfPatient.trim();

        // CHECKING IF USERNAME AND NAME ARE ENTERED
        if (!trimmedUsername || !trimmedNameOfPatient) {
            setModalVisible(true);
            setModalTitle("Username and Name are Incorrect.");
            setModalMessage("Please enter your username and name.");
            return;
        }

        // CHECKING IF USERNAME IS MORE THAN 3 CHARACTERS LONG
        if(trimmedUsername.length < 3) {
            setModalVisible(true);
            setModalTitle("Username is Incorrect.");
            setModalMessage("Your username should be at least 3 characters long.");
            return;
        }

        // CHECKING IF USERNAME IS MORE THAN 20 CHARACTERS LONG
        if(trimmedUsername.length > 20) {
            setModalVisible(true);
            setModalTitle("Username is Incorrect.");
            setModalMessage("Your username should be less than 20 characters long.");
            return;
        }

        // CHECKING IF USERNAME CONTAINS SPECIAL CHARACTERS
        if (!/^(?=.*\d)(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9\W_]{3,20}$/.test(trimmedUsername)) {
           setModalVisible(true);
           setModalTitle("Username is Incorrect.");
           setModalMessage("Your username should contain letters, numbers and special characters.");
            return;
        }

        const response = await api.get(`/patients/${trimmedUsername}/exists`);
        const data = response.data;
        await AsyncStorage.setItem("username", trimmedUsername);
        try {
            if (data.exists) {
                setModalVisible(true);
                setModalTitle("Username is Incorrect.");
                setModalMessage("Please sign in if you want to sign in.");
                return;
            } else {
                await AsyncStorage.setItem("username", trimmedUsername);
                await AsyncStorage.setItem("nameOfPatient", trimmedNameOfPatient);
                router.replace("./onBoarding");
            }
        } catch (error) {
            setModalVisible(true);
            setModalTitle("Error");
            setModalMessage("There was an error signing up. Please try again.");
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
            <Text style={[globalStyles.text, { marginTop: 24, marginBottom: 12 }]}>
                Please enter your name.
            </Text>
            <TextInput
                style={signInandOutStyle.input}
                placeholder="Name"
                placeholderTextColor={colors.muted}
                value= {nameOfPatient}
                onChangeText={setNameOfPatient}
                keyboardType="default"
                autoCapitalize="none"
                autoCorrect={false}
            />
            <View style = {signInandOutStyle.buttonContainer}>
                <Button
                    label="Sign Up"
                    onPress={handleSignUp}
                    style = {{alignSelf: "stretch"}}
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

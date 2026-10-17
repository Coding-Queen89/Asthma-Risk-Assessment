import { globalStyles, colors } from "@/styles/global";
import {signInandOutStyle} from "../styles/signInandOutStyles";
import { Text, View, TextInput, StyleSheet, ScrollView, Alert } from "react-native";
import { useState } from "react";
import api from "../api";
import Button  from "../Components/Button";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function SingUpScreen() {
    const [username, setUsername] = useState<string>("");
    const [nameOfPatient, setNameOfPatient] = useState<string>("");

    const handleSignUp = async () => {
        const trimmedUsername = username.trim();
        const trimmedNameOfPatient = nameOfPatient.trim();

        if (!trimmedUsername || !trimmedNameOfPatient) {
            Alert.alert("Missing Name", "Please enter your username and your name.");
            return;
        }
        if (!/^(?=.*[^a-zA-Z0-9])[a-zA-Z0-9\W_]{3,20}$/.test(trimmedUsername)) {
            Alert.alert("Invalid Username", "Your username should contain special characters.");
            return;
        }
        if(trimmedUsername.length < 3) {
            Alert.alert("Invalid Username", "Your username should be at least 3 characters long.");
            return;
        }

        const response = await api.get(`/patients/${trimmedUsername}/exists`);
        const data = response.data;
        await AsyncStorage.setItem("username", trimmedUsername);
        try {
            if (data.exists) {
                Alert.alert(
                    "Username already exists.",
                    "This username is already taken. Please choose another one."
                );
                return;
            } else {
                await AsyncStorage.setItem("username", trimmedUsername);
                await AsyncStorage.setItem("nameOfPatient", trimmedNameOfPatient);
                router.replace("./onBoarding");
            }
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
        </ScrollView>
    )
}

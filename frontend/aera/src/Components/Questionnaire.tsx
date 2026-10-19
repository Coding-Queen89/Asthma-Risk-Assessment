import {router} from "expo-router";
import { useState } from "react";
import { Text, View,ScrollView, StyleSheet, TextInput} from "react-native";
import {globalStyles, colors} from "../styles/global";
import Button from "./Button";
import MessageModal from "./messageModal";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";


type QuestionnaireProps = {
    recentExacerbationsQ: string;
    currentPEFQ: string;
    smokeExposureQ: string;
    chemicalExposureQ: string;
    sabaUseQ: string;
};

export default function Questionnaire({recentExacerbationsQ, currentPEFQ, smokeExposureQ, chemicalExposureQ, sabaUseQ}: QuestionnaireProps) {

    const [user, setUserName] = useState("");

    const [recentExacerbations, setRecentExacerbations] = useState<boolean>(false);
    const [currentPEF, setCurrentPEF] = useState('');
    const [smokeExposure, setSmokeExposure] = useState<boolean>(false);
    const [chemicalExposure, setChemicalExposure] = useState<boolean>(false);
    const [sabaUse, setSabaUse] = useState('');

    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    const addDynamicFactors = async () => {
        try {
            const userName = await AsyncStorage.getItem("username");

            if (!userName) {
                throw new Error("No username found.");
            }

            setUserName(userName);

            const response = await api.post(`/patients/${userName}/dynamic_records`, {
                recent_exacerbations: recentExacerbations,
                current_pef: parseFloat(currentPEF),
                smoke_exposure: smokeExposure,
                chemical_exposure: chemicalExposure,
                saba_use: parseInt(sabaUse),
            });
            // Alert.alert('Success', 'The Test has been added to your diary.');
            // router.push('./home');
            setModalVisible(true);
            setModalTitle("Success");
            setModalMessage("The test has been added to your diary.");
            console.log("Success!");
        } catch (error) {
            // Alert.alert('Error', 'There was an error submitting the dynamic factors');
            setModalVisible(true);
            setModalTitle("Error");
            setModalMessage("There was an error submitting the dynamic factors. Please try again.");
            console.log("There was an error submitting the dynamic factors");
        }
        console.log(recentExacerbations, currentPEF, smokeExposure, chemicalExposure, sabaUse);
    };

    return (
        <ScrollView style = {globalStyles.mainContainer}>
            {/* Asking about Recent Exacerbations */}
            <Text style = {[globalStyles.text, questionnaireStyles.question]}> {recentExacerbationsQ} </Text>
            <View style = {questionnaireStyles.booleanButton}>
                <Button
                    label = "Yes"
                    onPress = {() =>setRecentExacerbations(true)}
                    size = "small"
                    style = {{flex: 1}}
                />
                <Button
                    label = "No"
                    onPress = {() => setRecentExacerbations(false)}
                    size = "small"
                    style = {{flex: 1}}
                />
            </View>
            {/* Asking about last measured PEF(Current PEF) */}
            <Text style = {[globalStyles.text, questionnaireStyles.question]}> {currentPEFQ} </Text>
            <View style = {questionnaireStyles.inputContainer}>
                <TextInput
                    style = {questionnaireStyles.input}
                    placeholder = "0.00"
                    placeholderTextColor = {colors.text}
                    keyboardType = "numeric"
                    value = {currentPEF}
                    onChangeText = {setCurrentPEF}
                />
                <Text style = {[globalStyles.details, questionnaireStyles.margin]}> L/min </Text>
            </View>
            {/* Asking about smoke exposure */}
            <Text style = {[globalStyles.text, questionnaireStyles.question]}> {smokeExposureQ} </Text>
            <View style = {questionnaireStyles.booleanButton}>
                <Button
                    label = "Yes"
                    onPress = {() => setSmokeExposure(true)}
                    size = "small"
                    // variant={recentExacerbations === true ? "primary" : "secondary"}
                    style = {{flex: 1}}
                />
                <Button
                    label = "No"
                    onPress = {() =>  setSmokeExposure(false)}
                    size = "small"
                    style = {{flex: 1}}
                />
            </View>
            {/* Asking about chemical exposure */}
            <Text style = {[globalStyles.text, questionnaireStyles.question]}> {chemicalExposureQ} </Text>
            <View style = {questionnaireStyles.booleanButton}>
                <Button
                    label = "Yes"
                    onPress = {() => setChemicalExposure(true)}
                    size = "small"
                    style = {{flex: 1}}
                />
                <Button
                    label = "No"
                    onPress = {() => setChemicalExposure(false)}
                    size = "small"
                    style = {{flex: 1}}
                />
            </View>
            {/* Asking about saba use */}
            <Text style = {[globalStyles.text, questionnaireStyles.question]}> {sabaUseQ} </Text>
            <View style = {questionnaireStyles.inputContainer}>
                <TextInput
                    style = {questionnaireStyles.input}
                    placeholder = "0"
                    placeholderTextColor = {colors.text}
                    keyboardType = "numeric"
                    value = {sabaUse}
                    onChangeText = {setSabaUse}
                />
                <Text style = {[globalStyles.details, questionnaireStyles.margin]}> puffs </Text>
            </View>

            <Button
                label = "Submit"
                onPress = {addDynamicFactors}
            />

            {/* MESSAGEMODAL */}
            <MessageModal
                visible = {modalVisible}
                title = {modalTitle}
                message = {modalMessage}
                onClose = {() => {
                    if (modalTitle === "Success") {
                        router.push("./home");
                    }
                    setModalVisible(false);
                }}
            />
        </ScrollView>
    );
}

export const questionnaireStyles = StyleSheet.create({
    question: {
        marginTop: 15,
        paddingTop: 20,
        margin: 10,
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    input: {
        backgroundColor: colors.surfaceLight,
        borderColor: colors.surfaceLight,
        color: colors.text,
        width: 60,
        height: 38,
        borderRadius: 20,
        borderWidth: 1,
        paddingLeft: 16,
        marginTop: 10,
        marginBottom: 10,
    },
    margin: {
        marginTop: 10,
        marginBottom: 10,
    },
    booleanButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
});

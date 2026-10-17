import { globalStyles, colors } from "@/styles/global";
import {useState, useEffect} from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import  ProgressBar from "../Components/progressBar";
import ProfileQuestion from "../Components/profileQuestion";
import {questionnaireStyles} from "../Components/Questionnaire";
import Button from "../Components/Button";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";



// DECLARING QUESTIONS FOR SUCCESSFULLY CREATING PATIENT PROFILE
// AND SET ALL OBJECTS TO READ ONLY USING TYPE ASSESSERTION
const patientProfile = [
    {field: "age", question: "How old are you?", type: "number", suffix: "years"},
    {field: "height_cm", question: "How tall are you in cm?", type: "number", suffix: "cm"},
    {field: "weight", question: "How much do you weigh in kg?", type: "number", suffix: "kg"},
    {field: "latitude", question: "What is your country's latitude?", type: "number", suffix: "°"},
    {field: "longitude", question: "What is your country's longitude?", type: "number", suffix: "°"},
    {field: "gerd", question: "Were/Are you diagnosed with Gastroesophegal Refulx disease GERD?", type: "boolean"},
    {field: "osa", question: "Were/Are you diagnosed with Obstructive Sleep Apnea OSA?", type: "boolean"},
    {field: "active_smoking", question: "Do you actively smoke?", type: "boolean"},
    {field: "past_exacerbations", question: "How many times have you had asthma attacks in the last 3 months?", type: "number"},
    {field: "crs", question: "Were/Are you diagnosed with chronic rhinosinusitis CRS?", type: "boolean"},
    {field: "bestPEF", question: "What is your best peak Experiatory flow recorded?", type: "number", suffix: "L/min"},
];


type patientProfileField = typeof patientProfile[number]["field"];

export default function OnBoardingScreen() {
    const [ind, setInd] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [answers, setAnswers] = useState<Record<string, any>>({});

    const length = patientProfile.length;
    const currentQuestion = patientProfile[ind];
    const progress = (ind + 1)/length;

    type Answer = string | boolean | number;

    //Funktion that takes the previous set of answers and adds the current
    //field with its value to the answers object
    const addAnswer = (field: string, value: Answer) => {
        setAnswers((prev) => ({...prev, [field]: value}));
    };
    const setIndex = (index: number) => {
        setInd(index+1);
    };

    const handleNext = () => {
        if (ind === length - 1) {handleSubmit()}
        else {setInd(ind+1)}
    }

    const handleSubmit = async () => {
        const trimmedUsername = await AsyncStorage.getItem("username");
        const trimmedNameOfPatient = await AsyncStorage.getItem("nameOfPatient");

        if (!trimmedUsername || !trimmedNameOfPatient) {
            throw new Error("No username found.");
        }

        try{
            const response = await api.post(`/my_profile`, {
                username: trimmedUsername,
                name: trimmedNameOfPatient,
                age: answers.age,
                height_cm: answers.height_cm,
                weight_kg: answers.weight,
                latitude: answers.latitude,
                longitude: answers.longitude,

                gerd: answers.gerd,
                osa: answers.osa,
                active_smoking: answers.active_smoking,
                past_exacerbations: answers.past_exacerbations,
                crs: answers.crs,
                best_pef: answers.bestPEF,
            });
            router.replace("./");
            console.log("Successfully created the patient profile");
        } catch (error) {
            console.log("There was an error creating the patient profile");
        }
    }

    const handleBack = () => {setInd(ind-1)}

    return (
        <ScrollView style = {[globalStyles.screenContainer]}>
            <ProgressBar progress = {progress} index = {ind} length = {length} />
            <ProfileQuestion
                index = {ind}
                length = {length}
                field = {currentQuestion.field}
                question = {currentQuestion.question}
                type = {currentQuestion.type}
                answer = {answers[currentQuestion.field]}
                unit = {currentQuestion.suffix}
                onChange = {addAnswer}
            />

            {/* Adding Navigation Buttons */}
            <View style={[questionnaireStyles.booleanButton, {gap: 10}]}>
                {ind > 0 && (
                    <Button label="Back" onPress={handleBack} style={{ flex: 1 }} />
                )}
                {answers[currentQuestion.field] !== "" && answers[currentQuestion.field] !== undefined  && (<Button
                    label={ind === length - 1 ? "Done" : "Next"}
                    onPress={handleNext}
                    style={{ flex: 1 }}
                />)}
            </View>
        </ScrollView>
    );
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         flexGrow: 1,
//         justifyContent: "center",
//     },
// });

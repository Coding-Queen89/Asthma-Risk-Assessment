import { globalStyles,colors } from "../styles/global";
import {useState, useEffect, use} from "react";
import api from "../api";
import { Text, ScrollView, View, Image} from "react-native";
import FactorContainer from "../Components/factorContainer";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../Components/Button";
import MessageModal from "../Components/messageModal";
import { router } from "expo-router";

export default function myProfileScreen() {

    const [username, setUsername] = useState("");
    const [nameOfPatient, setNameOfPatient] = useState("");
    const [age, setAge] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [weight, setWeight] = useState<number>(0);
    const [bestPEF, setBestPEF] = useState<number>(0);
    const [bmi, setBmi] = useState<number>(0);
    const [gerd, setGerd] = useState<boolean>(false);
    const [osa, setOsa] = useState<boolean>(false);
    const [activeSmoking, setActiveSmoking] = useState<boolean>(false);
    const [pastExacerbations, setPastExacerbations] = useState<number>(0);
    const [crs, setCrs] = useState<boolean>(false);

    const [loading, setLoading] = useState(true);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        const getPatientInfo = async () => {
            try {
                const userName = await AsyncStorage.getItem("username");

                if (!userName) {
                    throw new Error("No username found.");
                }

                setUsername(userName);

                const response = await api.get(`/patients/${userName}/my_profile`);
                const data = response.data;
                setUsername(data.username);
                setNameOfPatient(data.name);
                setAge(data.age);
                setHeight(data.height_cm);
                setWeight(data.weight_kg);
                setBestPEF(data.best_pef);
                setBmi(data.bmi);
                setGerd(data.gerd);
                setOsa(data.osa);
                setActiveSmoking(data.active_smoking);
                setPastExacerbations(data.past_exacerbations);
                setCrs(data.crs);
            } catch (error) {

                setModalVisible(true);
                setModalTitle("Error");
                setModalMessage("There was an error fetching the username. Please try again.");

            } finally {
                setLoading(false);
            }
        };
        getPatientInfo();
    }, []);

    const handleConfirmModal = async () => {
        if (modalTitle === "Logout") {
            try{
                await AsyncStorage.removeItem("username");
                await AsyncStorage.removeItem("nameOfPatient");
                router.replace("./");
            }
            catch(error){  console.log("Logout failed"); }
        }
        else if(modalTitle === "Delete Profile") {
            try{
                const response = await api.delete(`/patients/${username}`);
                await AsyncStorage.removeItem("username");
                await AsyncStorage.removeItem("nameOfPatient");
                router.replace("./");
            }
            catch(error){  console.log("Profile could not be deleted"); }
        }
        setModalVisible(false);
    }

    const handleLogOut = async () => {
        setModalVisible(true);
        setModalTitle("Logout");
        setModalMessage(`Are you sure you want to logout, ${nameOfPatient}?`);
    }

    const handleDelete = () => {
        setModalVisible(true);
        setModalTitle("Delete Profile");
        setModalMessage(`Are you sure you want to delete your profile, ${nameOfPatient}?`);
    };


    const insets = useSafeAreaInsets();
    return (
        <ScrollView style = {globalStyles.screenContainer} contentContainerStyle = {{paddingBottom: insets.bottom + 40}}>
            <View style = {{flexDirection: "row", alignItems: "center"}}>
                <Image source = {require("../../assets/images/favicon.png")} style = {globalStyles.avatar}/>
                <View style = {{alignItems: "flex-start"}}>
                    <Text style = {globalStyles.subTitle}> {username} </Text>
                    <Text style = {globalStyles.text}> {nameOfPatient} </Text>
                </View>
            </View>
            <FactorContainer
                age = {age}
                height = {height}
                weight = {weight}
                bestPEF = {bestPEF}
                bmi = {bmi}
                gerd = {gerd}
                osa = {osa}
                activeSmoking = {activeSmoking}
                pastExacerbations = {pastExacerbations}
                crs = {crs}
            />
            <Button
                label = "Update Profile"
                onPress = {() => router.push("./editProfile")}
            />
            <Button
                label = "Logout"
                onPress = {handleLogOut}
            />
             <Button
                label = "Delete Profile"
                onPress = {handleDelete}
                style = {{backgroundColor: colors.muted}}
            />

            {/* MESSAGEMODAL FOR LOGOUT */}
            <MessageModal
                visible = {modalVisible}
                title = {modalTitle}
                message = {modalMessage}
                onClose = {handleConfirmModal}
                onCancel = {() => setModalVisible(false)}
                buttonLabel = "Confirm"
            />
        </ScrollView>
    );
}

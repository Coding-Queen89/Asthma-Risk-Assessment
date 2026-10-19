import { useState, useEffect } from "react";
import { globalStyles, colors } from "@/styles/global";
import { Text, View, TextInput, StyleSheet, ScrollView, Switch, ActivityIndicator} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "../api";
import { router } from "expo-router";
import Button from "../Components/Button";
import MessageModal from "../Components/messageModal";
import AsyncStorage from "@react-native-async-storage/async-storage";




export default function EditProfileScreen() {
    const insets = useSafeAreaInsets();

    const [userName, setUserName] = useState<string>("");
    const [nameOfPatient, setNameOfPatient] = useState<string>("");

    const [Age, setAge] = useState('');
    const [Height, setHeight] = useState('');
    const [Weight, setWeight] = useState('');
    const [Latitude, setLatitude] = useState('');
    const [Longitude, setLongitude] = useState('');
    const [bestPef, setBestPef] = useState('');

    // Baseline
    const [Gerd, setGerd] = useState(false);
    const [Osa, setOsa] = useState(false);
    const [activeSmoking, setActiveSmoking] = useState(false);
    const [pastExacerbations, setPastExacerbations] = useState('');
    const [Crs, setCrs] = useState(false);

    const [loading, setLoading] = useState(true);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        const getProfile = async () => {
            try {
                const userName = await AsyncStorage.getItem("username");
                // const nameOfPatient = await AsyncStorage.getItem("nameOfPatient");

                if (!userName) {
                    throw new Error("No username found.");
                }

                setUserName(userName);
                // setNameOfPatient(nameOfPatient ?? "");

                const response = await api.get(`/patients/${userName}/my_profile`);
                const data = response.data;
                setUserName(data.username);
                setNameOfPatient(data.name);
                setAge(data.age.toString());
                setHeight(data.height_cm.toString());
                setWeight(data.weight_kg.toString());
                setLatitude(data.latitude.toString());
                setLongitude(data.longitude.toString());
                setBestPef(data.best_pef.toString());
                setGerd(data.gerd);
                setOsa(data.osa);
                setActiveSmoking(data.active_smoking);
                setPastExacerbations(data.past_exacerbations.toString());
                setCrs(data.crs);

                setLoading(false);
            } catch (error:any) {
                setModalVisible(true);
                setModalTitle("Error");
                setModalMessage("There was an error loading your profile. Please try again.");

                // console.log("Failed to load profile");
                // console.error("Details:", JSON.stringify(error.response?.data, null, 2));
            }
        };
        getProfile();
    }, []);

    if (loading) {
        return (
            <View style = {globalStyles.screenContainer}>
                <ActivityIndicator size = "large" color = {colors.primary} />
            </View>
        );
    }

    const updateProfile = async () => {
        try {
            const userName = await AsyncStorage.getItem("username");
            // const nameOfPatient = await AsyncStorage.getItem("nameOfPatient");

            if (!userName) {
                throw new Error("No username found.");
            }

            setUserName(userName);
            // setNameOfPatient(nameOfPatient ?? "");

            const response = await api.put(`/patients/${userName}/my_profile`, {
                username: userName,
                name: nameOfPatient,
                age: parseInt(Age),
                height_cm: parseFloat(Height),
                weight_kg: parseFloat(Weight),
                latitude: parseFloat(Latitude),
                longitude: parseFloat(Longitude),
                best_pef: parseFloat(bestPef),
                gerd: Gerd,
                osa: Osa,
                active_smoking: activeSmoking,
                past_exacerbations: parseInt(pastExacerbations),
                crs: Crs,
            });
            console.log("Successfully updated profile");

            setModalVisible(true);
            setModalTitle("Success");
            setModalMessage("Your profile has been updated successfully.");

        } catch (error:any) {
            setModalVisible(true);
            setModalTitle("Error");
            setModalMessage("Failed to update your profile. Please try again.");

            console.log("Failed to update profile");
            console.error("Details:", JSON.stringify(error.response?.data, null, 2));
        }
    };


    return (
        <ScrollView style={globalStyles.screenContainer} contentContainerStyle = {{paddingBottom: insets.bottom + 40}}>
            <Text style={globalStyles.title}>Edit Profile</Text>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <Field label="Name" value={nameOfPatient} onChange={setNameOfPatient} keyboard="default" />
                <Field label="Age" value={Age} onChange={setAge} keyboard="numeric" />
                <Field label="Height (cm)" value={Height} onChange={setHeight} keyboard="numeric" />
                <Field label="Weight (kg)" value={Weight} onChange={setWeight} keyboard="numeric" />
                <Field label="Latitude" value={Latitude} onChange={setLatitude} keyboard="numeric" />
                <Field label="Longitude" value={Longitude} onChange={setLongitude} keyboard="numeric" />
                <Field label="Best PEF (L/min)" value={bestPef} onChange={setBestPef} keyboard="numeric" />
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Clinical Baseline</Text>
                <Toggle label="GERD" value={Gerd} onChange={setGerd} />
                <Toggle label="OSA" value={Osa} onChange={setOsa} />
                <Toggle label="Active Smoking" value={activeSmoking} onChange={setActiveSmoking} />
                <Field label="Past Exacerbations" value={pastExacerbations} onChange={setPastExacerbations} keyboard="numeric" />
                <Toggle label="CRS" value={Crs} onChange={setCrs} />
            </View>

            <Button
                label="Update Profile"
                onPress={updateProfile}
            />

            {/* MESSAGEMODAL */}
            <MessageModal
                visible = {modalVisible}
                title = {modalTitle}
                message = {modalMessage}
                onClose = {() => {
                    if (modalTitle === "Success") {
                        router.push("./myProfile");
                    }
                    setModalVisible(false);
                }}
            />
        </ScrollView>
    );
}

function Field({label, value, onChange, keyboard = "default",}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  keyboard?: "default" | "numeric";
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboard}
        placeholderTextColor={colors.muted}
      />
    </View>
  );
}

function Toggle({label, value, onChange}: {label: string, value: boolean, onChange: (v: boolean) => void}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
    section: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.primary,
        marginBottom: 12,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    field: {
        marginBottom: 12,
    },
    fieldLabel: {
        color: colors.muted,
        fontSize: 14,
        marginBottom: 4,
    },
    input: {
        backgroundColor: colors.surfaceLight,
        color: colors.text,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        fontSize: 16,
    },
});

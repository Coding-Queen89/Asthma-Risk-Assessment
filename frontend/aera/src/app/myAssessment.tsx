import { globalStyles} from "../styles/global";
import {useState, useEffect} from "react";
import { ScrollView, Text } from "react-native";
import Assessment from "../Components/Assessment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MessageModal from "../Components/messageModal";
import api from "../api";



export default function myAssessmentScreen() {

    const [username, setUsername] = useState("");
    const [nameOfPatient, setNameOfPatient] = useState("");

    const [riskScore, setRiskScore] = useState<number>(0);
    const [riskCategory, setRiskCategory] = useState<string>("");
    const [pefPercentOfBest, setPefPercentOfBest] = useState<number>(0);
    const [asthmaState, setAsthmaState] = useState<string>("");
    const [riskColor, setRiskColor] = useState<string>("");
    const [factorContribution, setFactorContribution] = useState<object>({});
    const [riskExplanation, setRiskExplanation] = useState<string>("");
    const [riskGuidance, setRiskGuidance] = useState<string>("");
    const [hasData, setHasData] = useState<boolean>(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    const derivedRiskScore = async () => {
        try {
            const userName = await AsyncStorage.getItem("username");
            // const nameOfPatient = await AsyncStorage.getItem("nameOfPatient");

            if (!userName) {
                throw new Error("No username found.");
            }

            setUsername(userName);
            // setNameOfPatient(nameOfPatient ?? "");


            const response = await api.post(`/patients/${userName}/assessments`);
            setRiskScore(response.data.risk_score);
            setRiskCategory(response.data.risk_category);
            setPefPercentOfBest(response.data.pef_percent_of_best);
            setAsthmaState(response.data.asthma_state);
            setRiskColor(response.data.risk_color);
            console.log("This is the risk color: ", response.data.risk_color);
            setFactorContribution(response.data.factor_contribution);
            setRiskExplanation(response.data.risk_explanation);
            setRiskGuidance(response.data.risk_guidance);
            setHasData(true);
        } catch (error) {
            setModalVisible(true);
            setModalTitle("Error");
            setModalMessage("To calculate your risk score, please make update your dynamic questionnaire.");
        }
    };

    useEffect(() => {
        derivedRiskScore();
    }, []);

    return (
        <ScrollView style = {globalStyles.screenContainer}>
            {/* <Text style = {{color: riskColor}}> This is a test. </Text> */}
            {hasData && <Assessment

                riskCategory = {riskCategory}
                riskScore = {riskScore}
                pefPercentOfBest = {pefPercentOfBest}
                asthmaState = {asthmaState}
                riskColor = {riskColor}
                factorContribution = {factorContribution}
                riskExplanation = {riskExplanation}
                riskGuidance = {riskGuidance}
            />}

            {/* MESSAGEMODAL */}
            <MessageModal
                visible = {modalVisible}
                title = {modalTitle}
                message = {modalMessage}
                onClose = {() => {
                    console.log("There was an error fetching the username")
                    setModalVisible(false);
                }}
            />
        </ScrollView>
    );
}

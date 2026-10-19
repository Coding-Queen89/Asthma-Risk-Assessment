import { Text, ScrollView} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {globalStyles} from "../styles/global";
import Header from "../Components/Header";
import Questionnaire from "../Components/Questionnaire";

export default function DynamicQuestionnaireScreen() {
    const recentExacerbationsQ = "How many times have you had asthma attacks in the last 3 months?";
    const currentPEF = "What was your last measurement of expiratory flow in the past 48 hours?";
    const smokeExposureQ = "Were you exposed to smoke of any kind in the last 24 hours?";
    const chemicalExposureQ = "Were you exposed to any chemicals in the last 24 hours?";
    const sabaUseQ = "How many puffs did you take from your inhaler in the last 7 days?";


    const insets = useSafeAreaInsets();
    return (
        <ScrollView style = {globalStyles.screenContainer} contentContainerStyle = {{paddingBottom: insets.bottom + 40}}>
            <Header />
            <Text style = {globalStyles.subTitle2}> Dynamic Questionnaire </Text>
            <Text style = {globalStyles.text}> Please, answer the following questions: </Text>
            <Questionnaire
                recentExacerbationsQ = {recentExacerbationsQ}
                currentPEFQ = {currentPEF}
                smokeExposureQ = {smokeExposureQ}
                chemicalExposureQ = {chemicalExposureQ}
                sabaUseQ = {sabaUseQ}
            />
        </ScrollView>
    );
}

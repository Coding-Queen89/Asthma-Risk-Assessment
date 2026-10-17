import { globalStyles,colors } from "../styles/global";
import {useState, useEffect, use} from "react";
import { Text, Alert, View, StyleSheet} from "react-native";
import { router } from "expo-router";
import api from "../api";

type patientFactorProps = {
    age: number,
    height: number,
    weight: number,
    bestPEF: number,
    bmi: number,
    gerd: boolean,
    osa: boolean,
    activeSmoking: boolean,
    pastExacerbations: number,
    crs: boolean,
};


export default function FactorContainer({age, height, weight, bestPEF, bmi, gerd, osa, activeSmoking, pastExacerbations, crs}: patientFactorProps) {

    return (
        <View>
            <View style = {styles.factorContainer}>
                <View style = {styles.tag}>
                    <Text style = {globalStyles.subTitle2}> Personal Information </Text>
                </View>
                <Text style = {globalStyles.text}> Age: {age} </Text>
                <Text style = {globalStyles.text}> Height: {height} cm </Text>
                <Text style = {globalStyles.text}> Weight: {weight} kg </Text>
                <Text style = {globalStyles.text}> City: Berlin </Text>
                <Text style = {globalStyles.text}> Best PEF: {bestPEF} L/min </Text>
            </View>
            <View style = {styles.factorContainer}>
                <View style = {styles.tag}>
                    <Text style = {globalStyles.subTitle2}> Baseline Factors </Text>
                </View>
                <Text style = {globalStyles.text}> BMI: {bmi} </Text>
                <Text style = {globalStyles.text}> Gerd: {gerd === true ? "Yes" : "No"} </Text>
                <Text style = {globalStyles.text}> OSA: {osa === true ? "Yes" : "No"} </Text>
                <Text style = {globalStyles.text}> Active Smoking: {activeSmoking === true ? "Yes" : "No"} </Text>
                <Text style = {globalStyles.text}> Past Exacerbations: {pastExacerbations} </Text>
                <Text style = {globalStyles.text}> CRS: {crs === true ? "Yes" : "No"} </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    factorContainer: {
        marginTop: 20,
        marginBottom: 20,
        padding: 10,
        borderRadius: 10,
        backgroundColor: colors.surface,
    },
    tag: {
        backgroundColor: colors.surfaceLight,
        padding: 5,
        borderRadius: 10,
        // marginTop: 10,
    },
});

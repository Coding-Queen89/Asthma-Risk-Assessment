import { globalStyles, colors } from "@/styles/global";
import { Text, View, StyleSheet, ActivityIndicator} from "react-native";
import { useState, useEffect } from "react";

type ProgressBarProps = {
    progress: number;
    index: number;
    length: number;
};

export default function ProgressBar({progress, index, length}: ProgressBarProps) {
    return (
        <View style = {styles.progressBarContainer}>
            <View style = {styles.progressBar}>
                <View style = {[styles.progressBarProgress, {width: `${progress * 100}%`}]} ></View>
            </View>
            <Text style = {globalStyles.text}> Question {index +1} Out of {length} </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    progressBarContainer: {
        marginTop: 24,
        marginHorizontal: 20,
    },
    progressBar: {
        height: 6,
        backgroundColor: colors.surfaceLight,
        borderRadius: 2,
        overflow: "hidden",
        marginBottom: 8,
    },
    progressBarProgress: {
        height: 6,
        backgroundColor: colors.primary,
    },
});

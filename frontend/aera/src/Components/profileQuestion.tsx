import { globalStyles, colors } from "@/styles/global";
import { Text, View, StyleSheet, ActivityIndicator, TextInput} from "react-native";
import {questionnaireStyles} from "../Components/Questionnaire";
import Button from "../Components/Button";

type ProfileQuestionProps = {
    index: number;
    length: number;
    field: string;
    question: string;
    type: string;
    answer?: string;
    unit?: string;
    onChange: (field: string, value: any) => void;
};

export default function ProfileQuestion({index, length, field, question,type, answer, unit, onChange}: ProfileQuestionProps) {


    return (
        <View style = {styles.questionArea}>
            <Text style = {globalStyles.text}> {question} </Text>

            {/* INPUT FIELDS FOR NUMERICAL PROFILE AND BASELINE FACTORS */}
            {type === "number" && (
                    <View style={[globalStyles.rowContainer, {marginBottom: 10}]}>
                        <TextInput
                            style = {styles.input}
                            value = {answer !== undefined ? String(answer): ""}
                            onChangeText={(text) => onChange(field, text)}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor={colors.muted}
                        />
                        {unit && (
                            <Text style={globalStyles.text}>{unit}</Text>
                        )}
                    </View>
                )
            }

            {/* INPUT FIELDS FOR BOOLEAN PROFILE AND BASELINE FACTORS */}
            {type === "boolean" && (
                    <View style = {questionnaireStyles.booleanButton}>
                        <Button
                            label = "Yes"
                            onPress = {() => onChange(field, true)}
                            size = "small"
                            style = {{flex: 1}}
                        />
                        <Button
                            label = "No"
                            onPress = {() => onChange(field, false)}
                            size = "small"
                            style = {{flex: 1}}
                        />
                    </View>
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    questionArea: {
        flex: 1,
        justifyContent: "center",
    },
    input: {
        backgroundColor: colors.surfaceLight,
        borderColor: colors.surfaceLight,
        color: colors.text,
        height: 48,
        flex: 1,
        borderRadius: 20,
        borderWidth: 1,
        paddingHorizontal: 16,
        margin: 10,
    },
});

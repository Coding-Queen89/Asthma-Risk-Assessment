import {globalStyles, colors} from "../styles/global";
import { Text, View, StyleSheet, Modal} from "react-native";
import Button from "./Button";

type MessageModalProps = {
    visible: boolean;
    title: string;
    message: string;
    details?: string;
    onClose: () => void;
    onCancel?: () => void;
    buttonLabel?: string;
    buttonLabel2?: string;
};

export default function MessageModal({visible, title, message, details, onClose, onCancel, buttonLabel, buttonLabel2}: MessageModalProps) {


    return (
        <Modal visible = {visible} transparent = {true} animationType = "fade">
            <View style = {styles.overlay}>
                <View style = {styles.messageBox}>
                    <Text style = {globalStyles.text}> {title} </Text>
                    <Text style = {globalStyles.details}> {message} </Text>

                    {/* IF YOU WANT TO ADD DETAILS TO THE MESSAGE, UNCOMMENT THIS */}
                    {/* {details && (
                        <Text style = {globalStyles.details}> {details} </Text>
                    )} */}

                    <View style = {styles.buttonContainer}>
                        {onCancel && (
                            <Button
                                label = {buttonLabel2 ?? "Cancel"}
                                onPress = {onCancel || (() => {})}
                                size = "small"
                            />
                        )}
                        <Button
                            label = {buttonLabel ?? "OK"}
                            size = "small"
                            onPress = {onClose}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    messageBox: {
        width: "80%",
        maxWidth: 400, // Fix this. It's hardcoded
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "space-between",
        alignItems: "center",
    },
});

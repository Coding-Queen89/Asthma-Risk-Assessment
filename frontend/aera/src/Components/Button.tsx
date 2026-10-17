import { Text, View, StyleSheet, Pressable} from "react-native";
import { globalStyles, colors } from "../styles/global";

type ButtonProps = {
    label: string;
    onPress: () => void;
    size?: "small" | "large";
    variant?: "primary" | "muted" | "secondary";
    style?: any;
};

export default function Button({label, onPress, size = "large", variant = "secondary", style}: ButtonProps) {
    return (
        <Pressable
            onPress = {onPress}
            style = {({pressed}) => [
                styles.buttonContainer,
                size === "small" ? styles.small : styles.large,
                variant === "primary" && styles.variantPrimary,
                variant === "muted" && styles.variantMuted,
                pressed && styles.pressed,
                style,
            ]}
        >
        <Text style = {[size === "small" ? styles.small && styles.smallLabel : styles.large && styles.largeLabel, style]}> {label} </Text>


        </Pressable>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: colors.secondary,
        // flex: 1,
        alignItems: "center",
        borderRadius: 48,
        padding: 5,
        marginTop: 10,
        marginBottom: 10,
    },
    variantPrimary: {
        backgroundColor: colors.primary,
    },
    variantMuted: {
        backgroundColor: colors.muted,
    },
    small: {
        paddingLeft: 10,
        paddingRight: 15,
        marginLeft: 10,
        marginRight: 10,
    },
    large: {
        fontSize: 20,
        paddingLeft: 20,
        paddingRight: 20,
    },
    smallLabel: {
        fontSize: 14,
        fontWeight: "bold",
        color: colors.label,
        textAlign: "center",
    },
    largeLabel: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.label,
        textAlign: "center",
    },
    pressed: {
        opacity: 0.5,
    },
});

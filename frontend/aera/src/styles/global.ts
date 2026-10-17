import {StyleSheet, Dimensions} from 'react-native';

export const colors = {
  background: '#0A0F2C',       // dunkles Marineblau
  surface: '#1A1F3A',          // Karten-Hintergrund
  surfaceLight: '#252B4A',     // sekundäre Fläche
  primary: '#4A90E2',
  secondary: "#F4f4f4",
  label: "#0A0F2C",         // Akzent
  text: '#FFFFFF',             // weißer Text
  textDark: '#0A0F2C',         // dunkler Text
  muted: '#A0A8C0',        // gedämpfter Text
  riskLow: '#22C55E',
  riskModerate: '#EAB308',
  riskHigh: '#EF4444',
  riskVeryHigh: '#A855F7',
};
export const fonts = {
  LoraRegular: "Lora-Regular",
  LoraBold: "Lora-Bold",
  LoraItalic: "Lora-Italic",
};


export const globalStyles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 10,
        paddingTop: 50,
        maxWidth: Dimensions.get("window").width,
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    mainContainer: {
        backgroundColor: colors.surface,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 26,
        marginTop: 20,
    },
    avatar: {
        width: 78,
        height: 78,
        borderRadius: 39,
        marginRight: 12,
    },
    title: {
        fontSize: 40,
        fontWeight: "bold",
        color: colors.text,
        textAlign: "left",
        fontFamily: fonts.LoraBold,
    },
    titleDark: {
        color: colors.textDark,
    },
    subTitle: {
        fontSize: 30,
        fontWeight: "bold",
        color: colors.text,
        textAlign: "center",
        margin: 10,
    },
    subTitle2: {
        fontSize: 25,
        fontWeight: "bold",
        color: colors.text,
        textAlign: "left",
    },
    text: {
        fontSize: 18,
        color: colors.text,
    },
    details: {
        fontSize: 14,
        color: "white",
        textAlign: "left",
    },
});

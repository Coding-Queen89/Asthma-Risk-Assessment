import {StyleSheet, Dimensions} from 'react-native';

export const colors = {
  mainBackground: "#0B122B",
  cardBackground: "#151F3D",
  elevatedSurface: "#243052",
  primaryBlue: "#243052",
  lightBlue: "#65A8FF",
  primaryBackgroundBlue: "#3485FF",
  textPrimary: "#65A8FF",
  textSecondary: "#A5B4D2",
  border: "#2B395C",
  mutedText: "#7183A8",
  white: "#FFFFFF",

  highRisk: "#EF4444",
  mediumRisk: "#FBBF24",
  lowRisk: "#35B978",
  negligibleRisk: "#00FF00",

  teal: "#42DCA3",
  purple: "#A855F7",
  warningSurface: "#493B2B",
};
export const fonts = {
  LoraRegular: "Lora-Regular",
  LoraBold: "Lora-Bold",
  LoraItalic: "Lora-Italic",
};


export const globalStyles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: colors.mainBackground,
        padding: 16,
        paddingTop: 50,
        maxWidth: Dimensions.get("window").width,
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    mainContainer: {
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        padding: 14,
        marginBottom: 24,
        borderColor: colors.elevatedSurface,
        borderWidth: 1,
    },
    avatar: {
        width: 78,
        height: 78,
        borderRadius: 39,
        marginRight: 12,
    },
    title: {
        fontSize: 40,
        // fontWeight: "bold",
        color: colors.white,
        textAlign: "left",
        fontFamily: fonts.LoraBold,
    },
    titleDark: {
        color: colors.textSecondary,
    },
    subTitle: {
        fontSize: 16,
        color: colors.mutedText,
    },
    subTitle2: {
        fontSize: 22,
        fontWeight: "bold",
        color: colors.textSecondary,
        textAlign: "left",
    },
    text: {
        fontSize: 18,
        color: colors.textPrimary,
    },
    smallCardHeader: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.white,
    },
    details: {
        fontSize: 14,
        color: colors.mutedText,
        textAlign: "left",
    },
    superDetails: {
        fontSize: 12,
        color: colors.mutedText,
    },
});

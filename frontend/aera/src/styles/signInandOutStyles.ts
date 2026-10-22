import { StyleSheet, Dimensions } from 'react-native';
import { colors } from "./global";

export const signInandOutStyle = StyleSheet.create({
  loginScreen: {
    flex: 1,
    backgroundColor: colors.mainBackground,
    padding: 16,
    // borderRadius: 16,
  },
  input: {
    backgroundColor: colors.elevatedSurface,
    color: colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    fontSize: 16,
  },
  buttonContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 24,
  },
});

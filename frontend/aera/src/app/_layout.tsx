import { Stack } from "expo-router";

export default function RootLayout() {
  return(
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}}/>
      <Stack.Screen name="signUp" options={{headerShown: false}}/>
      <Stack.Screen name="onBoarding" options={{headerTitle: "Onboarding"}}/>
      <Stack.Screen name="home" options={{headerShown: false}}/>
      <Stack.Screen name="dynamicQuestionnaire" options={{headerTitle: "Dynamic Questionnaire"}}/>
      <Stack.Screen name="myAssessment" options={{headerTitle: "My Assessment"}}/>
      <Stack.Screen name="riskAssessment" options={{headerTitle: "Your Short Term Risk Assessment"}}/>
      <Stack.Screen name="pastAssessments" options={{headerTitle: "My Past Assessments"}}/>
      <Stack.Screen name="myProfile" options={{headerTitle: "My Profile"}}/>
      <Stack.Screen name="editProfile" options={{headerTitle: "Edit My Profile"}}/>
    </Stack>
  );
}

import AsyncStorage from "@react-native-async-storage/async-storage";

// RETURNS THE EXISTING USERNAME FROM STORAGE
export async function getUsername(): Promise<string> {
  const username = await AsyncStorage.getItem("username");
  if (!username) {
    throw new Error("No username found.");
  }
  return username;
}
// RETURNS THE EXISTING NAME FROM STORAGE
export async function getNameOfPatient(): Promise<string> {
  const nameOfPatient = await AsyncStorage.getItem("nameOfPatient");
  if (!nameOfPatient) {
    throw new Error("Patient's name not found.");
  }
  return nameOfPatient;
}

// SETS THE NAME TO A GIVEN VALUE IN STORAGE
export async function setNameOfPatient(nameOfPatient: string): Promise<void> {
  await AsyncStorage.setItem("nameOfPatient", nameOfPatient);
}
// SETS THE USERNAME TO A GIVEN VALUE IN STORAGE
export async function setUsername(username: string): Promise<void> {
  await AsyncStorage.setItem("username", username);
}

// CLEARS USERNAME FROM STORAGE WHEN USER DELETES ACCOUNT
export async function clearUsername(): Promise<void> {
  await AsyncStorage.removeItem("username");
}
// CLEARS NAME OF PATIENT FROM STORAGE WHEN USER DELETES ACCOUNT
export async function clearNameOfPatient(): Promise<void> {
  await AsyncStorage.removeItem("nameOfPatient");
}

import {getUsername,getNameOfPatient} from "../auth/username";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

type patientDataProps = {
    username: string,
    nameOfPatient: string,
};


export default function CallingPatientDate({username, nameOfPatient}: patientDataProps) {
    const [user, setUsername] = useState("");
    const [name, setNameOfPatient] = useState("");

      useEffect(() => {
        const getPatientInfo = async () => {
          try {
            const userName = await AsyncStorage.getItem("username");
            const nameOfPatient = await AsyncStorage.getItem("nameOfPatient");
            if (!userName || !nameOfPatient) {
              throw new Error("No username found.");
            }
            setUsername(userName);
            setNameOfPatient(nameOfPatient);
            console.log(userName);
            console.log(nameOfPatient);
          } catch (error) {
            console.log("There was an error fetching the username");
          }
        };
        getPatientInfo();
      }, []);
    }

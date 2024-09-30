import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { images } from "@/constants";
import { ApiUrl } from "@/config/ServerConnection";
import { useUser } from "@clerk/clerk-expo";
import AttendanceInCalender from "@/components/attendance/AttendanceInCalender";

const Attendance = () => {
  const { user } = useUser();
  const [employeeId, setEmployeeId] = useState("");
  const [employees, setEmployees] = useState([]); // Initialize as an array
  const router = useRouter();

  useEffect(() => {
    if (user?.id) fetchEmployeeDetails();
  }, [user?.id]);

  const fetchEmployeeDetails = async () => {
    try {
      const response = await axios.get(
        `${ApiUrl}/employee/clerk/${user?.id}`
      );
      const employeeData = response.data?.employee || [];
      setEmployees(employeeData);

      if (employeeData.length > 0) {
        setEmployeeId(employeeData[0].employeeId);
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <AttendanceInCalender employeeId={employeeId} />
    </View>
  );
};

export default Attendance;

const styles = StyleSheet.create({});

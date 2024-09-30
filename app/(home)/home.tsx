import { View, Text, ScrollView, Pressable, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Icons } from "@/components/home/Icon";
import { theme } from "@/constants/Colors";
import * as Location from "expo-location";
import { useUser } from "@clerk/clerk-expo";
import { ApiUrl } from "@/config/ServerConnection";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

type Props = {};

const Home = (props: Props) => {
  const { user } = useUser();
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>({});
  const [isLocationUpdate, setIsLocationUpdate] = useState(false);
  const [employee, setEmployee] = useState<any>([]);

  useEffect(() => {
    (async () => {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      // Get the current location and update in real-time
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // Update every second
          distanceInterval: 1, // Update when user moves at least 1 meter
        },
        (loc) => {
          setLocation(loc.coords);
        }
      );

      // Clean up on component unmount
      return () => subscription.remove();
    })();
  }, []);

  useEffect(() => {
    //invoke profile fuction
    getProfileData();
  }, []);

  useEffect(() => {
    //UPDATE LOCATION
    // Function to run every 15 minutes
    const intervalId = setInterval(() => {
      console.log("Running task every 15 minutes");
      updateLocation();
    }, 15 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(
          `${ApiUrl}/employee/clerk/${user?.id}`
        );
        setEmployee(response.data.employee);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    if (user?.id) {
      fetchEmployeeDetails();
    }
  }, [user?.id]);

  const getProfileData = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/auth/me/${user?.id}`);
      setProfileData(response.data.user); // Set employees state with fetched data
    } catch (error) {
      console.log("error fetching employee data", error); // Log any errors during fetching
    }
  };

  let text = "Waiting for location...";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location?.latitude}, Longitude: ${location?.longitude}`;
  }


  const updateLocation = async () => {
    try {
      const response = await axios.put(
        `${ApiUrl}/location/update/${user?.id}`,
        {
          location: {
            latitude: location?.latitude,
            longitude: location?.longitude,
          },
        }
      );
    } catch (error) {
      console.log("error fetching employee data", error); // Log any errors during fetching
    }
  };


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Header */}
        {/* Quick Actions */}
        
        {/* Recent Activities */}
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
          Recent Activities
        </Text>
        <View
          style={{
            padding: 16,
            backgroundColor: "#f9f9f9",
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          <Text>Last Login: {employee?.lastLogin || "Not Available"}</Text>
          <Text>Pending Tasks: {employee?.pendingTasks || 0}</Text>
        </View>

        {/* KPI Section */}
        <View
          style={{ backgroundColor: "#e0f7fa", padding: 20, borderRadius: 10 }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
            Employee KPIs
          </Text>
          <Text>Total Hours Worked: {employee?.totalHoursWorked || 0} hrs</Text>
          <Text>
            Attendance Rate: {employee?.attendanceRate || "Not Available"}
          </Text>
        </View>

        {/* Upcoming Events */}
        <Text style={{ fontSize: 16, fontWeight: "bold", marginVertical: 10 }}>
          Upcoming Events
        </Text>
        <View
          style={{ padding: 16, backgroundColor: "#fff", borderRadius: 10 }}
        >
          <Text>No upcoming events</Text>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default Home;

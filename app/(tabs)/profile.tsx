import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ApiUrl } from "@/config/ServerConnection";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import moment from "moment";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

type Props = {};

const Profile = (props: Props) => {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();
  const [currentDate, setCurrentDate] = useState(moment());
  const [employee, setEmployee] = useState<any>({});

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(
          `${ApiUrl}/employee/clerk/${user?.id}`
        );
        setEmployee(response.data.employee[0] || {});
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    if (user?.id) {
      fetchEmployeeDetails();
    }
  }, [user?.id]);

  const logout = async () => {
    try {
      const response = await signOut();
      if (response) {
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingRight: 20,
          }}
        >
          <View
            style={{
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
            }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 8,
                backgroundColor: "#4b6cb7",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>
                {employee?.employeeName?.charAt(0)}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 18 }}>{employee?.employeeName}</Text>
              <Text style={{ color: "gray", fontSize: 12 }}>
                {employee?.designation} ({employee?.employeeId})
              </Text>
            </View>
          </View>
          <Ionicons name="settings-outline" size={24} color="black" />
        </View>

        {/* Employee Details Section */}
        <View style={{ padding: 16 }}>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#D0D0D0",
              borderRadius: 10,
              padding: 15,
            }}
          >
            <Text
              style={{ textAlign: "center", fontSize: 14, fontWeight: "bold" }}
            >
              Login Credential
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>Email</Text>
            <TextInput
              style={{
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
              }}
              placeholder="email"
              placeholderTextColor="black"
              value={employee?.email}
              editable={false}
            />
          </View>

          {/* Other details */}
          <View
            style={{
              borderWidth: 1,
              borderColor: "#D0D0D0",
              borderRadius: 10,
              padding: 15,
              marginTop: 20,
            }}
          >
            <Text
              style={{ textAlign: "center", fontSize: 14, fontWeight: "bold" }}
            >
              Employee Details
            </Text>

            {/* Full Name */}
            <View style={{ marginVertical: 14 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                Full Name
              </Text>
              <TextInput
                value={employee?.employeeName}
                style={{
                  padding: 10,
                  borderColor: "#D0D0D0",
                  borderWidth: 1,
                  marginTop: 10,
                  borderRadius: 5,
                }}
                placeholder="Enter your full name"
                placeholderTextColor="black"
                editable={false}
              />
            </View>

            {/* Employee Id */}
            <View>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                Employee Id
              </Text>
              <TextInput
                value={employee?.employeeId}
                style={{
                  padding: 10,
                  borderColor: "#D0D0D0",
                  borderWidth: 1,
                  marginTop: 10,
                  borderRadius: 5,
                }}
                placeholder="Employee Id"
                placeholderTextColor="black"
                editable={false}
              />
            </View>

            {/* Designation */}
            <View style={{ marginVertical: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                Designation
              </Text>
              <TextInput
                value={employee?.designation}
                style={{
                  padding: 10,
                  borderColor: "#D0D0D0",
                  borderWidth: 1,
                  marginTop: 10,
                  borderRadius: 5,
                }}
                placeholder="Designation"
                placeholderTextColor="black"
                editable={false}
              />
            </View>

            {/* Mobile Number */}
            <View>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                Mobile Number
              </Text>
              <TextInput
                value={employee?.phoneNumber}
                style={{
                  padding: 10,
                  borderColor: "#D0D0D0",
                  borderWidth: 1,
                  marginTop: 10,
                  borderRadius: 5,
                }}
                placeholder="Mobile No"
                placeholderTextColor="black"
                editable={false}
              />
            </View>

            {/* Other details */}
            <View style={{ marginVertical: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                Date of Birth
              </Text>
              <TextInput
                value={employee?.dateOfBirth}
                style={{
                  padding: 10,
                  borderColor: "#D0D0D0",
                  borderWidth: 1,
                  marginTop: 10,
                  borderRadius: 5,
                }}
                placeholder="Enter Date of Birth"
                placeholderTextColor="black"
                editable={false}
              />
            </View>

            <View style={{ marginVertical: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                Joining Date
              </Text>
              <TextInput
                value={employee?.joiningDate}
                style={{
                  padding: 10,
                  borderColor: "#D0D0D0",
                  borderWidth: 1,
                  marginTop: 10,
                  borderRadius: 5,
                }}
                placeholder="Joining Date"
                placeholderTextColor="black"
                editable={false}
              />
            </View>
            {/* 
            <View style={{ marginVertical: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>Salary</Text>
              <TextInput
                value={employee?.salary}
                style={{
                  padding: 10,
                  borderColor: "#D0D0D0",
                  borderWidth: 1,
                  marginTop: 10,
                  borderRadius: 5,
                }}
                placeholder="Enter Salary"
                placeholderTextColor="black"
                editable={false}
              />
            </View> */}

            <View>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>Address</Text>
              <TextInput
                value={employee?.address}
                style={{
                  padding: 10,
                  borderColor: "#D0D0D0",
                  borderWidth: 1,
                  marginTop: 10,
                  borderRadius: 5,
                }}
                placeholder="Enter Address"
                placeholderTextColor="black"
                editable={false}
              />
            </View>
          </View>
          <View style={{ marginTop: 50,marginBottom:100 }}>
            <Button title="Logout" onPress={() => logout()} color="red" />
          </View>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default Profile;

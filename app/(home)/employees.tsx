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

const Employees = () => {
  const [employees, setEmployees] = useState([]); // State to store employee data
  const [input, setInput] = useState(""); // State for the search input
  const router = useRouter(); // Router hook for navigation

  useEffect(() => {
    // Fetch employee data on component mount
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/employee/all`);
        setEmployees(response.data); // Set employees state with fetched data
      } catch (error) {
        console.log("error fetching employee data", error); // Log any errors during fetching
      }
    };
    fetchEmployeeData(); // Trigger the fetch function
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        {/* Search bar and add button */}
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 7,
            gap: 10,
            backgroundColor: "white",
            borderRadius: 3,
            height: 40,
            flex: 1,
          }}
        >
          <AntDesign
            style={{ marginLeft: 10 }}
            name="search1"
            size={20}
            color="black"
          />
          <TextInput
            value={input} // Search input value
            onChangeText={(text) => setInput(text)} // Update search input state
            style={{ flex: 1 }}
            placeholder="Search"
          />

          {/* Add employee button only visible when there are employees */}
          {employees.length > 0 && (
            <View>
              <Pressable onPress={() => router.push("/(home)/adddetails")}>
                <AntDesign name="pluscircle" size={30} color="#0072b1" />
              </Pressable>
            </View>
          )}
        </Pressable>
      </View>

      {/* Display search results if employees exist, otherwise show "no employees" message */}
      {employees.length > 0 ? (
        <View>
          {employees
            .filter(
              (employee) =>
                employee.employeeName
                  .toLowerCase()
                  .includes(input.toLowerCase()) // Filter based on search input
            )
            .map((employee) => (
              <Pressable
                key={employee.employeeId}
                onPress={() => router.push(`/employee/${employee._id}`)} // Navigate to employee details page on click
                style={{
                  padding: 10,
                  borderBottomWidth: 1,
                  borderColor: "#E0E0E0",
                }}
              >
                {/* Wrap employee name inside Text component */}
                <View className=" p-4 flex  flex-row items-center gap-4">
                  <View className="bg-blue-800 px-5  py-4 flex  flex-row rounded-md">
                    <Text className="text-white text-lg">
                      {employee.employeeName.charAt(0)}
                    </Text>
                  </View>
                  <View className=" flex flex-cols">
                    <Text className="text-lg">{employee.employeeName}</Text>
                    <Text className="text-gray text-sm">{employee.designation} ({employee.employeeId})</Text>
                  </View>
                </View>
              </Pressable>
            ))}
        </View>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image source={images.noResult} className="w-40 h-40" />
          <Text>No employees found</Text>
          <Text>Press on the plus button and add your Employee</Text>
          {/* Add employee button */}
          <Pressable onPress={() => router.push("/(home)/adddetails")}>
            <AntDesign
              style={{ marginTop: 30 }}
              name="pluscircle"
              size={40}
              color="black"
            />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default Employees;

const styles = StyleSheet.create({});

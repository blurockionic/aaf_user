import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  Button,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { theme } from "@/constants/Colors";
import { ApiUrl } from "@/config/ServerConnection";
import DatePicker from "react-native-date-picker";

const adddetails = () => {
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [dob, setDob] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [salary, setSalary] = useState("");
  const [address, setAddress] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const handleRegister = async() => {
    const employeeData = {
      employeeName: name,
      employeeId: employeeId,
      designation: designation,
      phoneNumber: mobileNo,
      dateOfBirth: dob,
      joiningDate: joiningDate,
      activeEmployee: true,
      salary: salary,
      address: address,
      email: email,
      password: password,
    };

    await axios
      .post(`${ApiUrl}/employee/new`, {
        employeeName: name,
        employeeId: employeeId,
        designation: designation,
        phoneNumber: mobileNo,
        dateOfBirth: dob,
        joiningDate: joiningDate,
        activeEmployee: true,
        salary: salary,
        address: address,
        email: email,
        password: password,
      })
      .then((response) => {
        Alert.alert(
          "Registration Successful",
          "You have been registered successfully"
        );
        setName("");
        setEmployeeId("");
        setDob("");
        setMobileNo("");
        setSalary("");
        setAddress("");
        setJoiningDate("");
        setDesignation("");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        Alert.alert(
          "Registration Fail",
          "An error occurred during registration"
        );
        console.log("register failed", error);
      });
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ paddingHorizontal: 20 }}>
        <Text
          style={{ fontSize: 14, fontWeight: "bold" }}
          className="text-left"
        >
          New Employee
        </Text>
        {/* Login Credential Section */}
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
            style={{ fontSize: 14, fontWeight: "bold" }}
            className="text-center"
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
            placeholderTextColor={"black"}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>Password</Text>

          <TextInput
            style={{
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            placeholder="Password"
            placeholderTextColor={"black"}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        {/* Employee Details Section */}
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
            style={{ fontSize: 14, fontWeight: "bold" }}
            className="text-center"
          >
            Employee Details
          </Text>

          <View style={{ marginVertical: 14 }}>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>Full Name</Text>
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={{
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
              }}
              placeholder="Enter your full name"
              placeholderTextColor={"black"}
            />
          </View>
          <View>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>
              Employee Id
            </Text>
            <TextInput
              value={employeeId}
              onChangeText={(text) => setEmployeeId(text)}
              style={{
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
              }}
              placeholder="Employee Id"
              placeholderTextColor={"black"}
            />
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>
              Designation
            </Text>
            <TextInput
              value={designation}
              onChangeText={(text) => setDesignation(text)}
              style={{
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
              }}
              placeholder="Designation"
              placeholderTextColor={"black"}
            />
          </View>

          <View>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>
              Mobile Number
            </Text>
            <TextInput
              value={mobileNo}
              onChangeText={(text) => setMobileNo(text)}
              style={{
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
              }}
              placeholder="Mobile No"
              placeholderTextColor={"black"}
            />
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>
              Date of Birth
            </Text>
            <TextInput
              value={dob}
              onChangeText={(text) => setDob(text)}
              style={{
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
              }}
              placeholder="Enter Date of Birth"
              placeholderTextColor={"black"}
            />
            {/* <View>
              <Button title="Open Date Picker" onPress={() => setOpen(true)} />
              <DatePicker
                modal
                open={open}
                date={date}
                onConfirm={(selectedDate) => {
                  setOpen(false);
                  setDate(selectedDate);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            </View> */}
          </View>

          <View>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>
              Joining Date
            </Text>
            <TextInput
              value={joiningDate}
              onChangeText={(text) => setJoiningDate(text)}
              style={{
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
              }}
              placeholder="Joining Date"
              placeholderTextColor={"black"}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Text>Active Employee</Text>
            <Text>True</Text>
          </View>
          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>Salary</Text>
            <TextInput
              value={salary}
              onChangeText={(text) => setSalary(text)}
              style={{
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
              }}
              placeholder="Enter Salary"
              placeholderTextColor={"black"}
            />
          </View>

          <View>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>Address</Text>
            <TextInput
              value={address}
              onChangeText={(text) => setAddress(text)}
              style={{
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
              }}
              placeholder="Enter Address"
              placeholderTextColor={"black"}
            />
          </View>
        </View>

        <Pressable
          onPress={handleRegister}
          style={{
            backgroundColor: theme.colors.primary,
            padding: 10,
            marginTop: 20,
            marginBottom: 50,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
          }}
        >
          <Text style={{ fontWeight: "bold", color: "white" }}>
            Add Employee
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default adddetails;

const styles = StyleSheet.create({});

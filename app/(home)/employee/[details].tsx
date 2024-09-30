import {
  View,
  Text,
  Pressable,
  ScrollView,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ApiUrl } from "@/config/ServerConnection";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import moment from "moment";
import { DataTable } from "react-native-paper";
import Modal from "react-native-modal";
import AttendanceInCalender from "@/components/attendance/AttendanceInCalender";

type Props = {};

interface EmployeeDetails {
  employeeId: string;
  employeeName: string;
}

interface ApiResponse {
  data: {
    status: number;
    message?: string;
  };
}

const EmployeeDetails = (props: Props) => {
  const { details } = useLocalSearchParams();
  const [currentDate, setCurrentDate] = useState(moment());
  const [employeeId, setEmployeeId] = useState("");
  // State to track which section is expanded
  const [selectedTab, setSelectedTab] = useState(null); // State to track selected tab

  const [employee, setEmployee] = useState<any>([]);
  const [attendance, setAttendance] = useState<any>([]);
  const [advanceOrLoan, setAdvanceOrLoan] = useState<any>([]);
  const [extraBonus, setExtraBonus] = useState<any>([]);
  const [advanceAmount, setAdvanceAmount] = useState<any>(0);
  const [extraBonusAmount, setExtraBonusAmount] = useState<any>(0);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isExtrBonusModelOpen, setIsExtrBonusModelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [totalAdvanceAmount, setTotalAdvanceAmount] = useState(0);

  // Function to fetch employee details
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/employee/${details}`); // Use the id to fetch employee data
        setEmployee(response.data.employee);
        setEmployeeId(response.data.employee.employeeId);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    const fetchAttendanceReoportById = async () => {
      try {
        const response = await axios.get(
          `${ApiUrl}/attendance/report/${employeeId}`,
          {
            params: {
              month: currentDate.month() + 1,
              year: 2024,
            },
          }
        );
        setAttendance(response.data.report);
      } catch (error) {
        console.error("Error fetching attendance report:", error);
      }
    };
    const fetchAttendanceReoportAdvanceOrLoan = async () => {
      try {
        const response = await axios.get(
          `${ApiUrl}/attendance/advance/${employeeId}`
        );
        // Filter out the details and set the advance or loan
        const advance = response.data.advance.filter((item: any) =>
          item.hasOwnProperty("advanceOrLoan")
        );
        const extraBonus = response.data.advance.filter((item: any) =>
          item.hasOwnProperty("extraBonus")
        );

        setAdvanceOrLoan(advance);
        setExtraBonus(extraBonus);
      } catch (error) {
        console.error("Error fetching attendance report:", error);
      }
    };
    const fetchLoanAndAdvance = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/advance/${details}`);
        // Filter out the details and set the advance or loan
        const advance = response.data.advance.filter((item: any) =>
          item.hasOwnProperty("advanceAmount")
        );
        const extraBonus = response.data.advance.filter((item: any) =>
          item.hasOwnProperty("extraBonus")
        );

        const totalAdvanceAmount = advance.reduce(
          (acc: any, item: any) => acc + item.advanceAmount,
          0
        );

        // console.log("totalADvanceAmount", totalAdvanceAmount);
        setTotalAdvanceAmount(totalAdvanceAmount);

        setAdvanceOrLoan(advance);
        setExtraBonus(extraBonus);
      } catch (error) {
        console.error("Error fetching attendance report:", error);
      }
    };

    if (details) {
      fetchEmployeeDetails();
      fetchLoanAndAdvance();
    }
    if (employeeId) {
      fetchAttendanceReoportById();
      // fetchAttendanceReoportAdvanceOrLoan();
    }
  }, [details, employeeId, isLoading]);

  if (!employee) {
    return <Text>Loading...</Text>;
  }

  // Toggle section expansion

  const toggleTab = (tabName: any) => {
    // If the same tab is clicked, toggle it off, else set the new tab
    setSelectedTab((prevTab) => (prevTab === tabName ? null : tabName));
  };

  // Toggle modal
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleModalExtraBonus = () => {
    setIsExtrBonusModelOpen(!isExtrBonusModelOpen);
  };

  // Handle submit on advance
  const handleSubmitOnAdvance = async () => {
    setIsLoading(true);
    setIsClicked(true);
    setModalVisible(!isModalVisible);

    // Validation
    if (!advanceAmount) {
      Alert.alert("Please enter advance or loan amount");
      setIsClicked(false); // Make sure to set this in case of error
      return;
    }

    try {
      // Make the API call to submit the advance or loan amount
      const response = await axios.post<ApiResponse>(`${ApiUrl}/advance/new`, {
        employeeId: details, // Ensure you are passing the correct field
        advanceAmount: advanceAmount,
        date: moment().format("MMMM D, YYYY"),
      });

      // Check if the response status is 201 (Created)
      if (response?.data) {
        Alert.alert(
          `Advance submitted successfully for ${employee?.employeeName}`
        );
      } else {
        // Handle cases where the status is not 201
        Alert.alert("Failed to submit advance");
      }

      setAdvanceAmount(0);

      setIsClicked(false);
      setIsLoading(false);
    } catch (error) {
      setIsClicked(false);
      setIsLoading(false);
      console.log("Error submitting advance", error);

      // Handle different error scenarios
      if (axios.isAxiosError(error)) {
        Alert.alert("Network error", error.message);
      } else {
        Alert.alert("An unexpected error occurred");
      }
    }
  };

  const handleSubmitOnExtraBonus = async () => {
    setIsClicked(true);
    setIsLoading(true);
    setIsExtrBonusModelOpen(!isExtrBonusModelOpen);

    // Validation
    if (!extraBonusAmount) {
      Alert.alert("Please enter bonus amount");
      setIsClicked(false); // Make sure to set this in case of error
      return;
    }

    try {
      // Make the API call to submit the advance or loan amount
      const response = await axios.post<ApiResponse>(`${ApiUrl}/advance/new`, {
        employeeId: details, // Ensure you are passing the correct field
        extraBonus: extraBonusAmount,
        date: moment().format("MMMM D, YYYY"),
      });

      // Check if the response status is 201 (Created)
      if (response?.data) {
        Alert.alert(
          `Advance submitted successfully for ${employee?.employeeName}`
        );
      } else {
        // Handle cases where the status is not 201
        Alert.alert("Failed to submit advance");
      }

      setExtraBonusAmount(0);
      setIsClicked(false);
      setIsLoading(false);
    } catch (error) {
      setIsClicked(false);
      setIsLoading(false);
      console.log("Error submitting advance", error);

      // Handle different error scenarios
      if (axios.isAxiosError(error)) {
        Alert.alert("Network error", error.message);
      } else {
        Alert.alert("An unexpected error occurred");
      }
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView>
        <View className="flex flex-row items-center justify-between pr-5">
          <View className=" p-4 flex  flex-row items-center gap-4">
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 8,
                padding: 10,
                backgroundColor: "#4b6cb7",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>
                {employee?.employeeName?.charAt(0)}
              </Text>
            </View>
            <View className=" flex flex-cols">
              <Text className="text-lg">{employee.employeeName}</Text>
              <Text className="text-gray text-sm">
                {employee.designation} ({employee.employeeId})
              </Text>
            </View>
          </View>
          <Ionicons name="settings-outline" size={24} color="black" />
        </View>
        {/* details of employee  */}
        <View>
          {/* Top Tab Section */}
          <View className="mb-5 p-5 flex flex-row justify-between items-center bg-gray-200 mx-5 rounded-b-md">
            <Pressable onPress={() => toggleTab("Detail")}>
              <View className="flex flex-cols items-center">
                <Ionicons name="list-outline" size={24} color="black" />
                <Text className="text-xs">Detail</Text>
              </View>
            </Pressable>

            <Pressable onPress={() => toggleTab("Attendance")}>
              <View className="flex flex-cols items-center">
                <Ionicons name="stats-chart-outline" size={24} color="black" />
                <Text className="text-xs">Attendance</Text>
              </View>
            </Pressable>

            <Pressable onPress={() => toggleTab("Advance")}>
              <View className="flex flex-cols items-center">
                <Ionicons name="card-outline" size={24} color="black" />
                <Text className="text-xs">Advance</Text>
              </View>
            </Pressable>

            <Pressable onPress={() => toggleTab("Location")}>
              <View className="flex flex-cols items-center">
                <Ionicons name="locate-outline" size={24} color="black" />
                <Text className="text-xs">Location</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => toggleTab("Salary")}>
              <View className="flex flex-cols items-center">
                <Ionicons name="wallet-outline" size={24} color="black" />
                <Text className="text-xs">Salary</Text>
              </View>
            </Pressable>
          </View>

          {/* Toggleable Content */}
          {selectedTab === "Detail" && (
            <View className="mb-52 mx-5 p-4 bg-white rounded-md shadow-md">
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
                  value={employee.email}
                  editable={false} // Making the field non-editable
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
                className="mb-10"
              >
                <Text
                  style={{ fontSize: 14, fontWeight: "bold" }}
                  className="text-center"
                >
                  Employee Details
                </Text>

                <View style={{ marginVertical: 14 }}>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Full Name
                  </Text>
                  <TextInput
                    value={employee.employeeName}
                    style={{
                      padding: 10,
                      borderColor: "#D0D0D0",
                      borderWidth: 1,
                      marginTop: 10,
                      borderRadius: 5,
                    }}
                    placeholder="Enter your full name"
                    placeholderTextColor={"black"}
                    editable={false} // Making the field non-editable
                  />
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Employee Id
                  </Text>
                  <TextInput
                    value={employee.employeeId}
                    style={{
                      padding: 10,
                      borderColor: "#D0D0D0",
                      borderWidth: 1,
                      marginTop: 10,
                      borderRadius: 5,
                    }}
                    placeholder="Employee Id"
                    placeholderTextColor={"black"}
                    editable={false} // Making the field non-editable
                  />
                </View>

                <View style={{ marginVertical: 10 }}>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Designation
                  </Text>
                  <TextInput
                    value={employee.designation}
                    style={{
                      padding: 10,
                      borderColor: "#D0D0D0",
                      borderWidth: 1,
                      marginTop: 10,
                      borderRadius: 5,
                    }}
                    placeholder="Designation"
                    placeholderTextColor={"black"}
                    editable={false} // Making the field non-editable
                  />
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Mobile Number
                  </Text>
                  <TextInput
                    value={employee.phoneNumber}
                    style={{
                      padding: 10,
                      borderColor: "#D0D0D0",
                      borderWidth: 1,
                      marginTop: 10,
                      borderRadius: 5,
                    }}
                    placeholder="Mobile No"
                    placeholderTextColor={"black"}
                    editable={false} // Making the field non-editable
                  />
                </View>

                <View style={{ marginVertical: 10 }}>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Date of Birth
                  </Text>
                  <TextInput
                    value={employee.dateOfBirth}
                    style={{
                      padding: 10,
                      borderColor: "#D0D0D0",
                      borderWidth: 1,
                      marginTop: 10,
                      borderRadius: 5,
                    }}
                    placeholder="Enter Date of Birth"
                    placeholderTextColor={"black"}
                    editable={false} // Making the field non-editable
                  />
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Joining Date
                  </Text>
                  <TextInput
                    value={employee.joiningDate}
                    style={{
                      padding: 10,
                      borderColor: "#D0D0D0",
                      borderWidth: 1,
                      marginTop: 10,
                      borderRadius: 5,
                    }}
                    placeholder="Joining Date"
                    placeholderTextColor={"black"}
                    editable={false} // Making the field non-editable
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
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Salary
                  </Text>
                  <TextInput
                    value={employee.salary}
                    style={{
                      padding: 10,
                      borderColor: "#D0D0D0",
                      borderWidth: 1,
                      marginTop: 10,
                      borderRadius: 5,
                    }}
                    placeholder="Enter Salary"
                    placeholderTextColor={"black"}
                    editable={false} // Making the field non-editable
                  />
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Address
                  </Text>
                  <TextInput
                    value={employee.address}
                    style={{
                      padding: 10,
                      borderColor: "#D0D0D0",
                      borderWidth: 1,
                      marginTop: 10,
                      borderRadius: 5,
                    }}
                    placeholder="Enter Address"
                    placeholderTextColor={"black"}
                    editable={false} // Making the field non-editable
                  />
                </View>
              </View>
            </View>
          )}

          {/* attendance  */}
          {selectedTab === "Attendance" && (
            <>
              <AttendanceInCalender employeeId={employeeId} />
              <View className="mx-5 p-4 bg-white rounded-md shadow-md mb-10">
                <Text className="text-md font-bold">Summary</Text>
                <View style={{ marginHorizontal: 5 }}>
                  {attendance?.map((item, index) => (
                    <View key={index} style={{ marginVertical: 2 }}>
                      <View
                        style={{
                          marginTop: 15,
                          margin: 5,
                          padding: 5,

                          borderRadius: 5,
                        }}
                      >
                        <View className="flex flex-row justify-between items-center w-full">
                          <Text className="text-center  bg-green-200 text-lg px-6 py-4 rounded-md">
                            {item?.present}
                          </Text>
                          <Text className="text-center  bg-red-300 text-lg px-6 py-4 rounded-md">
                            {item?.absent}
                          </Text>
                          <Text className="text-center  bg-yellow-300 text-lg px-6 py-4 rounded-md">
                            {item?.halfday}
                          </Text>
                        </View>
                        <View className="flex flex-row items-center justify-end mt-4">
                          <Ionicons
                            name="information-circle-outline"
                            size={20}
                            color={"#6B7280"}
                            className="text-gray-300"
                          />
                          <View className="flex flex-row justify-end items-center">
                            <Text className="p-2 text-green-700 text-xs">
                              Present
                            </Text>
                            <Text className="p-2 text-red-700 text-xs">
                              Absent
                            </Text>
                            <Text className="p-2 text-yellow-700 text-xs">
                              Half Day
                            </Text>
                          </View>
                        </View>

                        {/* <DataTable>
                        <DataTable.Header>
                          <DataTable.Title>P</DataTable.Title>
                          <DataTable.Title>A</DataTable.Title>
                          <DataTable.Title>HD</DataTable.Title>
                          <DataTable.Title>H</DataTable.Title>
                        </DataTable.Header>
                        <DataTable.Row className="flex flex-row justify-between">
                          <DataTable.Cell>{item?.present}</DataTable.Cell>
                          <DataTable.Cell>{item?.absent}</DataTable.Cell>
                          <DataTable.Cell>{item?.halfday}</DataTable.Cell>
                          <DataTable.Cell>1</DataTable.Cell>
                          <DataTable.Cell>8</DataTable.Cell>
                        </DataTable.Row>
                      </DataTable> */}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}

          {/* //advance section  */}
          {selectedTab === "Advance" && (
            <>
              <View className="mx-5 p-4 bg-white rounded-md shadow-md mb-5">
                <View className="flex flex-row items-center justify-between mb-5">
                  <Text className="text-lg font-bold ">Advance</Text>
                  <Pressable
                    onPress={() => {
                      toggleModal();
                    }}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={30}
                      color="#4b6cb7"
                    />
                    {/* <View className="flex flex-row items-center  px-2 py-1 gap-2 bg-white mb-2 rounded-full">
                  </View> */}
                  </Pressable>
                </View>
                {advanceOrLoan.length > 0 ? (
                  advanceOrLoan.map((item, index) => (
                    <View
                      key={index}
                      style={{ marginVertical: 2 }}
                      className="p-2 border-b border-gray-100"
                    >
                      {item?.advanceOrLoan !== 0 ? (
                        <>
                          <View className="flex flex-row items-center justify-between">
                            <Text>{`₹${item?.advanceAmount}`}</Text>
                            <Text>{item?.date}</Text>
                          </View>
                        </>
                      ) : (
                        <Text>No loan or advance</Text>
                      )}
                    </View>
                  ))
                ) : (
                  <Text>No Advance</Text>
                )}
              </View>
              <View className="mx-5 p-4 bg-white rounded-md shadow-md mb-10">
                <View className="flex flex-row items-center justify-between mb-5">
                  <Text className="text-lg font-bold ">Extra Bonus</Text>
                  <Pressable onPress={() => toggleModalExtraBonus()}>
                    <Ionicons
                      name="add-circle-outline"
                      size={30}
                      color="#4b6cb7"
                    />
                    {/* <View className="flex flex-row items-center  px-2 py-1 gap-2 bg-white mb-2 rounded-full">
                  </View> */}
                  </Pressable>
                </View>
                {extraBonus.length > 0 ? (
                  extraBonus.map((item, index) => (
                    <View
                      key={index}
                      style={{ marginVertical: 2 }}
                      className="p-2 border-b border-gray-100"
                    >
                      {item?.extraBonus !== 0 ? (
                        <>
                          <View className="flex flex-row items-center justify-between">
                            <Text>{`₹${item?.extraBonus}`}</Text>
                            <Text>{item?.date}</Text>
                          </View>
                        </>
                      ) : (
                        <Text>No loan or advance</Text>
                      )}
                    </View>
                  ))
                ) : (
                  <Text>No Advance</Text>
                )}
              </View>
            </>
          )}

          {selectedTab === "Location" && (
            <View className="mx-5 p-4 bg-white rounded-md shadow-md">
              <Text>
                Location: Here you can show employee location or tracking
                information.
              </Text>
            </View>
          )}

          {/* //salary  */}
          {selectedTab === "Salary" && (
            <View className="mx-5 p-4 bg-white rounded-md shadow-md">
              <View className=" bg-white rounded-lg shadow">
                <View className="flex flex-row items-center justify-between mb-4">
                  <Text className="text-lg font-bold mb-3">Salary Details</Text>
                  {/* Table Row: Base Salary */}
                  <View className="flex flex-cols items-center justify-center py-2">
                    <Text>Base Salary</Text>
                    <Text>₹ {attendance[0].salary || "----"}</Text>
                  </View>
                </View>

                {/* Table Header */}
                <View className="flex flex-row justify-between mb-2">
                  <Text className="font-bold">Description</Text>
                  <Text className="font-bold">Value/Amt.</Text>
                </View>

                {/* Table Row: Number of Working Days */}
                <View className="flex flex-row justify-between border-b border-gray-200 py-2">
                  <Text>Number of Working Days</Text>
                  <Text>{attendance[0].present}</Text>
                </View>

                {/* Table Row: Current Salary */}
                <View className="flex flex-row justify-between border-b border-gray-200 py-2">
                  <Text>Salary payable</Text>
                  <Text>
                    ₹ {(attendance[0].present * attendance[0].salary) / 30}
                  </Text>
                </View>

                {/* Table Row: Advance Amount */}
                <View className="flex flex-row justify-between border-b border-gray-200 py-2">
                  <Text>Advance Amount</Text>
                  <Text>₹ {totalAdvanceAmount || "----"}</Text>
                </View>

                {/* Table Row: Due Amount */}
                <View className="flex flex-row justify-between py-2">
                  <Text>Due Amount</Text>
                  <Text>
                    ₹{" "}
                    {(totalAdvanceAmount >= attendance[0].salary
                      ? attendance[0].salary - totalAdvanceAmount
                      : 0) || "----"}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* //modal for add advance  */}
          <Modal isVisible={isModalVisible}>
            <View
              style={{
                justifyContent: "center",
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
              }}
            >
              <View className="w-full flex flex-row items-center justify-between px-2 mb-3">
                <Text style={{ fontSize: 18, marginBottom: 10 }}>
                  Advance or Loan
                </Text>
                <Ionicons
                  name="close-circle"
                  size={30}
                  color="#F05252"
                  onPress={toggleModal}
                />
              </View>

              <Text
                style={{ fontSize: 14, marginBottom: 5 }}
                className="text-start"
              >
                Enter Advance or Loan
              </Text>

              <TextInput
                placeholder="Enter amount"
                value={advanceAmount}
                onChangeText={(text) => setAdvanceAmount(text)}
                keyboardType="numeric"
                style={{
                  width: "100%",
                  padding: 10,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                  marginBottom: 20,
                }}
              />

              <TouchableOpacity
                onPress={handleSubmitOnAdvance}
                disabled={isClicked}
              >
                {isClicked ? (
                  <Ionicons
                    name="reload-outline"
                    size={30}
                    color="#4b6cb7"
                    className="animate-spin"
                  />
                ) : (
                  <Text
                    style={{
                      backgroundColor: "#4b6cb7",
                      padding: 10,
                      borderRadius: 5,
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    Submit
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </Modal>

          {/* model for extra bonus  */}
          <Modal isVisible={isExtrBonusModelOpen}>
            <View
              style={{
                justifyContent: "center",
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
              }}
            >
              <View className="w-full flex flex-row items-center justify-between px-2 mb-3">
                <Text style={{ fontSize: 18, marginBottom: 10 }}>
                  Extra bonus
                </Text>
                <Ionicons
                  name="close-circle"
                  size={30}
                  color="#F05252"
                  onPress={toggleModalExtraBonus}
                />
              </View>

              <Text
                style={{ fontSize: 14, marginBottom: 5 }}
                className="text-start"
              >
                Enter extra bonus amount
              </Text>

              <TextInput
                placeholder="Enter amount"
                value={extraBonusAmount}
                onChangeText={(text) => setExtraBonusAmount(text)}
                keyboardType="numeric"
                style={{
                  width: "100%",
                  padding: 10,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                  marginBottom: 20,
                }}
              />

              <TouchableOpacity
                onPress={handleSubmitOnExtraBonus}
                disabled={isClicked}
              >
                {isClicked ? (
                  <Ionicons
                    name="reload-outline"
                    size={30}
                    color="#4b6cb7"
                    className="animate-spin"
                  />
                ) : (
                  <Text
                    style={{
                      backgroundColor: "#4b6cb7",
                      padding: 10,
                      borderRadius: 5,
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    Submit
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default EmployeeDetails;

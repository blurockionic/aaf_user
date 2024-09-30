import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import { ApiUrl } from "@/config/ServerConnection";
import axios from "axios";
import moment from "moment";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";

const AttendanceInCalender = ({ employeeId }: { employeeId: string }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [status, setStatus] = useState("present");
  const [attendance, setAttendance] = useState<any>([]);
  const [currentDate, setCurrentDate] = useState(moment());
  const [changeMonth, setChangeMonth] = useState(new Date().getMonth() + 1);
  const [changeYear, setChangeYear] = useState(new Date().getFullYear());
  const [isMonthChanged, setIsMonthChanged] = useState(false);

  useEffect(() => {
    // Fetch get attendance data
    if (employeeId) {
      getAttendance();
      fetchAttendanceReoportById();
    }
  }, [status, isMonthChanged, employeeId]);

  // console.log("date data", new Date().toLocaleString("en-US", { month: "long" }));

  const fetchAttendanceReoportById = async () => {
    try {
      const response = await axios.get(
        `${ApiUrl}/attendance/report/${employeeId}`,
        {
          params: {
            month: changeMonth,
            year: changeYear,
          },
        }
      );
      setAttendance(response.data.report);
      setIsMonthChanged(false);
    } catch (error) {
      setIsMonthChanged(false);
      console.error("Error fetching attendance report:", error);
    }
  };

  const getAttendance = async () => {
    try {
      const response = await axios.get(
        `${ApiUrl}/attendance/employee/${employeeId}`
      );

      if (status === "present") {
        const present = response?.data?.attendance.filter(
          (item: any) => item?.status === "present"
        );
        const markedDates: { [key: string]: any } = present.reduce(
          (acc: { [key: string]: any }, item: any) => {
            const formattedDate = moment(item?.date, "MMMM D, YYYY").format(
              "YYYY-MM-DD"
            );

            // Mark the date as selected and marked
            acc[formattedDate] = {
              selected: true,
              marked: true,
              selectedColor: "#0E9F6E",
            };
            return acc;
          },
          {}
        );

        // Set the marked dates
        setAttendanceStatus(markedDates);
      }

      if (status === "absent") {
        const absent = response?.data?.attendance.filter(
          (item: any) => item?.status === "absent"
        );

        const markedDates: { [key: string]: any } = absent.reduce(
          (acc: { [key: string]: any }, item: any) => {
            const formattedDate = moment(item?.date, "MMMM D, YYYY").format(
              "YYYY-MM-DD"
            );

            // Mark the date as selected and marked
            acc[formattedDate] = {
              selected: true,
              marked: true,
              selectedColor: "#F05252",
            };
            return acc;
          },
          {}
        );

        // Set the marked dates
        setAttendanceStatus(markedDates);
      }
      if (status === "halfday") {
        const halfDay = response?.data?.attendance.filter(
          (item: any) => item?.status === "halfday"
        );
        //   console.log(present);

        const markedDates: { [key: string]: any } = halfDay.reduce(
          (acc: { [key: string]: any }, item: any) => {
            const formattedDate = moment(item?.date, "MMMM D, YYYY").format(
              "YYYY-MM-DD"
            );

            // Mark the date as selected and marked
            acc[formattedDate] = {
              selected: true,
              marked: true,
              selectedColor: "#C27803",
            };
            return acc;
          },
          {}
        );

        // Set the marked dates
        setAttendanceStatus(markedDates);
      }
    } catch (error) {
      console.error("Error fetching attendance report:", error);
    }
  };

  const handleOnStatusChange = (status: string) => {
    setStatus(status);
  };

  return (
    <>
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          {/* Header Text */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Attendance</Text>
            <RNPickerSelect
              onValueChange={(value) => handleOnStatusChange(value)}
              placeholder={{ label: "Select Status", value: null }}
              items={[
                { label: "Present", value: "present" },
                { label: "Absent", value: "absent" },
                { label: "Half Day", value: "halfday" },
              ]}
              style={{
                inputIOS: styles.picker,
                inputAndroid: styles.picker,
              }}
            />
          </View>

          {/* Basic Calendar Component */}
          <Calendar
            // Initially visible month. Default = Date()
            // current={"2024-09-17"}
            current={moment(Date.now()).format("YYYY-MM-DD")}
            // Handler which gets executed on day press. Default = undefined
            onDayPress={(day: any) => {
              console.log("selected day", day);
              setSelectedDate(day.dateString);
            }}
            //   Marking a single date as selected
            markedDates={attendanceStatus}
            //on month change while scrolling. Default = undefined
            onMonthChange={(month: any) => {
              setChangeMonth(month.month);
              setChangeYear(month.year);
              setIsMonthChanged(true);
            }}
            // Theme customization
            theme={{
              selectedDayBackgroundColor: "green",
              todayTextColor: "red",
              arrowColor: "orange",
              monthTextColor: "blue",
            }}
          />

          <Text style={styles.selectedText}>
            Date: {moment(Date.now()).format("YYYY-MM-DD")}
          </Text>
        </View>
      </View>
      <View className="mx-5 p-4 bg-white rounded-md shadow-md mb-10">
        <Text className="text-md font-bold">Summary</Text>
        <View style={{ marginHorizontal: 5 }}>
          {/* attendance status */}
          {attendance.length > 0 ? (
            attendance?.map((item, index) => (
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
                      <Text className="p-2 text-red-700 text-xs">Absent</Text>
                      <Text className="p-2 text-yellow-700 text-xs">
                        Half Day
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text className="text-center p-4 bg-gray-100 mt-2 rounded-sm">
              No Summary found
            </Text>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
  },
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  headerText: {
    fontSize: 18,
    marginBottom: 10,
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
  },
  picker: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    color: "black",
    backgroundColor: "#fff",
    width: 150, // Adjust width as necessary
  },
});

export default AttendanceInCalender;

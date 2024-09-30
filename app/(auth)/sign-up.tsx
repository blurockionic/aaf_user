import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, ScrollView, Image, Alert } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import ReactNativeModal from "react-native-modal";
import axios from "axios";
import * as Location from "expo-location";
import { ApiUrl } from "@/config/ServerConnection";
import InputField from "@/components/input/InputField";
import CustomButton from "@/components/button/CustomButton";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);

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

  const createLocation = async ({
    fullName,
    email,
    clerk_id,
  }: {
    fullName: string;
    email: string;
    clerk_id: any;
  }) => {
    try {
      const response = await axios.post(`${ApiUrl}/location/create`, {
        fullName,
        email,
        clerk_id,
        location: {
          latitude: location?.latitude,
          longitude: location?.longitude,
        },
      });
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

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      try {
        //check email added by owner or not
        const response = await axios.post(`${ApiUrl}/employee/email`, {
          email: form.email,
        });
        Alert.alert(response.data.message);

        // Create the user and assign a role
        await signUp.create({
          emailAddress: form.email,
          password: form.password,
        });

        // Prepare email address verification
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        setVerification((prev) => ({
          ...prev,
          state: "pending",
        }));
      } catch (error: any) {
        console.error(
          "Error saving user data:",
          error.response?.data?.message || error.message
        );
        Alert.alert(error.response?.data?.message);
        return;
      }
    } catch (err: any) {
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      // Attempt email address verification
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (completeSignUp.status === "complete") {
        // Save data in user collection
        try {
          const response = await axios.post(`${ApiUrl}/auth/signup`, {
            fullName: form.name,
            email: form.email,
            clerk_id: completeSignUp.createdUserId,
            password: form.password,
          });

          await createLocation({
            fullName: form.name,
            email: form.email,
            clerk_id: completeSignUp.createdUserId,
          });

          Alert.alert("erverthing updated");
        } catch (error: any) {
          console.error(
            "Error saving user data:",
            error.response?.data?.message || error.message
          );
          Alert.alert(error.response?.data?.message);
        }

        // Set the active session
        await setActive({ session: completeSignUp.createdSessionId });

        // Update verification state
        setVerification((prev) => ({
          ...prev,
          state: "success",
        }));

        // Redirect or navigate (Uncomment as needed)
        // router.replace("/");
      } else {
        // Handle verification failure
        setVerification((prev) => ({
          ...prev,
          error: "Verification failed!",
          state: "failed",
        }));
      }
    } catch (err) {
      // Handle unexpected errors
      setVerification((prev) => ({
        ...prev,
        error: err.errors?.[0]?.longMessage || "An unexpected error occurred.",
        state: "failed",
      }));
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpImg} className="z-0 h-[250px] w-full" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Create Your Account
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Enter your name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) =>
              setForm((prev) => ({
                ...prev,
                name: value,
              }))
            }
          />
          <InputField
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) =>
              setForm((prev) => ({
                ...prev,
                email: value,
              }))
            }
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            value={form.password}
            secureTextEntry={true}
            onChangeText={(value) =>
              setForm((prev) => ({
                ...prev,
                password: value,
              }))
            }
          />
          <CustomButton
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-6"
          />
          {/* <OAuth /> */}
          <Link
            href="/sign-in"
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text>Already have an account? </Text>
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>
        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onModalHide={() => {
            if (verification.state === "success") setShowSuccessModal(true);
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-2xl font-JakartaExtraBold mb-2">
              Verification
            </Text>
            <Text className="font-Jakarta mb-5">
              We've sent a verification code to {form.email}
            </Text>
            <InputField
              label="Code"
              icon={icons.lock}
              placeholder="12345"
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification((prev) => ({
                  ...prev,
                  code,
                }))
              }
            />
            {verification.error && (
              <Text className="text-red-500">{verification.error}</Text>
            )}
            <CustomButton
              title="Verify Email"
              onPress={onPressVerify}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-JakartaBold text-center">
              Verified
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              You have successfully verified your account.
            </Text>
            <CustomButton
              title="Browse Home"
              className="mt-5"
              onPress={() => {
                setShowSuccessModal(false);
                router.push("/(tabs)/profile");
              }}
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;

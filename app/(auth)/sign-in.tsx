
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { Link, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Text, View, ScrollView, Image, Alert } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import InputField from "@/components/input/InputField";
import CustomButton from "@/components/button/CustomButton";

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        Alert.alert("Error", "error during sign in");
      }
    } catch (err: any) {
      Alert.alert("Error", err.errors[0].longMessage);
    }
  }, [isLoaded, form.email, form.password, router, setActive, signIn]);
  return (
    <>
      <ScrollView className="flex-1 bg-white">
        <View className="flex-1 bg-white">
          <View className="relative w-full h-[250px]">
            <Image source={images.signUpImg} className="z-0 h-[250px] w-full" />
            <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
              Welcome to AAF
            </Text>
          </View>
          <View className="p-5">
            <InputField
              label={"Email"}
              placeholder="Enter your email"
              icon={icons.email}
              value={form.email}
              onChangeText={(value) =>
                setForm({
                  ...form,
                  email: value,
                })
              }
            />
            <InputField
              label={"Password"}
              placeholder="Enter your password"
              icon={icons.lock}
              value={form.password}
              secureTextEntry={true}
              onChangeText={(value) =>
                setForm({
                  ...form,
                  password: value,
                })
              }
            />
            <CustomButton
              title="Sign In"
              onPress={onSignInPress}
              className="mt-6"
            />
            {/*oauth*/}
            {/* <OAuth /> */}
            <Link
              href="/sign-up"
              className="text-lg text-center text-general-200 mt-10"
            >
              <Text>Don't have an account? </Text>
              <Text className="text-primary-500">Sign Up</Text>
            </Link>
          </View>
          {/*verification model*/}
        </View>
      </ScrollView>
    </>
  );
};

export default SignIn;

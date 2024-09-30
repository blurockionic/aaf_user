import { Stack } from "expo-router";
import "react-native-reanimated";

const Layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="employees" options={{ headerShown: false }} />
      <Stack.Screen name="adddetails" options={{ headerShown: false }} />
      <Stack.Screen name="markattendance" options={{ headerShown: false }} />
      <Stack.Screen name="[user]" options={{ headerShown: false }} />
      <Stack.Screen name="[details]" options={{ headerShown: false }} />
      <Stack.Screen name="summary" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;

import { Redirect } from "expo-router";
import { useAuth } from '@clerk/clerk-expo'

const Home = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href="/(tabs)/attendance" />;
  }
  
  return <Redirect href="/(auth)/welcome" />;
};

export default Home;

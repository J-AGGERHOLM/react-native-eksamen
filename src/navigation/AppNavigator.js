import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginPage } from "../screens/LoginScreen";
import { NavBar } from "../components/layout/NavbarContainer";
import { GoalDetailsScreen } from "../screens/GoalDetailsScreen";
import { SignUpPage } from "../screens/SignUpPage";

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="LoginPage" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginPage" component={LoginPage} />
      <Stack.Screen name="SignUpPage" component={SignUpPage} />
      <Stack.Screen name="MainTabs" component={NavBar} />
      <Stack.Screen name="GoalDetailsPage" component={GoalDetailsScreen} />
    </Stack.Navigator>
  );
}

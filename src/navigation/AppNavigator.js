import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginPage } from "../screens/LoginScreen";
import { NavBar } from "../navigation/Navbar";
import { GoalDetailsScreen } from "../screens/GoalDetailsScreen";
import { SignUpPage } from "../screens/SignUpPage";

const Stack = createNativeStackNavigator();

// AppNavigator — handles the top-level routing,
// specifically keeping LoginPage outside the tabs (you don't want a bottom tab bar on the login screen)
// and GoalDetailsPage as a drill-down screen that slides over the tabs.

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

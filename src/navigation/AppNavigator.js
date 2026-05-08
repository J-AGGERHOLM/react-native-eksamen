import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginPage } from "../screens/LoginScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { HistoryScreen } from "../screens/HistoryScreen";
import { GoalOverviewScreen } from "../screens/GoalOverviewScreen";
import { GoalDetailsScreen } from "../screens/GoalDetailsScreen";

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="LoginPage" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="LoginPage" component={LoginPage} />
      <Stack.Screen name="HomePage" component={HomeScreen}></Stack.Screen>
      <Stack.Screen name="HistoryPage" component={HistoryScreen}></Stack.Screen>
      <Stack.Screen name="GoalOverviewPage" component={GoalOverviewScreen}></Stack.Screen>
      <Stack.Screen name="GoalDetailsPage" component={GoalDetailsScreen}></Stack.Screen>
    </Stack.Navigator>
  );
}

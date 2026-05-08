import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { HomeScreen } from "../../screens/HomeScreen";
import { HistoryScreen } from "../../screens/HistoryScreen";
import { GoalOverviewScreen } from "../../screens/GoalOverviewScreen";

const Tab = createBottomTabNavigator();


//MainTabs — this is your navbar now. It defines the three bottom tabs and is what replaced your old NavBar component.
export function NavBar() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="HomePage" component={HomeScreen} />
      <Tab.Screen name="HistoryPage" component={HistoryScreen} />
      <Tab.Screen name="GoalOverviewPage" component={GoalOverviewScreen} />
    </Tab.Navigator>
  );
}
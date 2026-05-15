import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

import { HomeScreen } from "../../screens/HomeScreen";
import { HistoryScreen } from "../../screens/HistoryScreen";
import { MileStoneScreen } from "../../screens/MileStoneScreen";
const Tab = createBottomTabNavigator();

export function NavBar() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tab.Screen
        // name is the internal route name.
        name="HomePage"
        // component is the actual screen/page that should be shown
        // when the user presses this tab.
        component={HomeScreen}
        // options controls how this tab looks and behaves in the navbar.
        options={{
          title: "Home",
          // tabBarIcon lets us render an icon above/next to the label.
          // React Navigation automatically gives us color and size.
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="HistoryPage"
        component={HistoryScreen}
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="history" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="MileStonePage"
        component={MileStoneScreen}
        options={{
          title: "Mile Stones",
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="bullseye" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 85,
    paddingTop: 8,
    paddingBottom: 10,
  },

  tabBarLabel: {
    marginTop: 4,
  },
});

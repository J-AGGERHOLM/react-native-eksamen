import { useNavigation } from "@react-navigation/native";
import { View, Pressable, Text } from "react-native";

export function NavBar() {
  const navigation = useNavigation();

  return (
    <View>
      <Pressable onPress={() => navigation.navigate("HomePage")}>
        <Text>Home</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("HistoryPage")}>
        <Text>History</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("GoalOverviewPage")}>
        <Text>Goals</Text>
      </Pressable>
    </View>
  );
}

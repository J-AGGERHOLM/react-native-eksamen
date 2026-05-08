import { View, Text, Pressable } from "react-native";

export function LoginPage({ navigation }) {
  return (
    <View>
      <Text>this is a landing page</Text>
      <Pressable onPress={() => navigation.navigate("HomePage")}>
        <Text>login</Text>
      </Pressable>
    </View>
  );
}

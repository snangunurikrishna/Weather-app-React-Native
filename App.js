// import { StatusBar } from 'expo-status-bar';
// import { Text, View } from 'react-native';
// import { NativeWindStyleSheet } from "nativewind";

// export default function App() {
//   return (
//     <View className="flex-1 items-center justify-center bg-white">
//       <Text className="text-green-500">Open up App.2222 to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "./screens/Home";
import { View, Text } from "react-native";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // <View className="flex-1 items-center justify-center bg-white">
    //   <Text className="text-green-500">
    //     Open up App.22223 to start working on your app!
    //   </Text>
    //   <Text className="text-yellow-500">Hello man</Text>
    // </View>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{headerShown:false}} component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

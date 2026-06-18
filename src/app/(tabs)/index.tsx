import { Link } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/shared/ui";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 items-center justify-center gap-3 px-6">
        <ThemedText type="title">Expo Boilerplate</ThemedText>
        <ThemedText type="subtitle">FSD · NativeWind · Biome</ThemedText>
        <ThemedText style={{ textAlign: "center" }}>
          Edit src/app/(tabs)/index.tsx to start building.
        </ThemedText>
        <Link href="/modal">
          <ThemedText type="link">Open modal</ThemedText>
        </Link>
      </View>
    </SafeAreaView>
  );
}

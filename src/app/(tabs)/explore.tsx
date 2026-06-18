import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/shared/ui";

export default function ExploreScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 items-center justify-center gap-3 px-6">
        <ThemedText type="title">Explore</ThemedText>
        <ThemedText style={{ textAlign: "center" }}>
          Add features under src/features, entities under src/entities, and shared UI under
          src/shared.
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}

import { Link } from "expo-router";
import { View } from "react-native";

import { ThemedText } from "@/shared/ui";

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center p-5">
      <ThemedText type="title">This is a modal</ThemedText>
      <Link href="/" dismissTo>
        <View className="mt-4 py-4">
          <ThemedText type="link">Go to home screen</ThemedText>
        </View>
      </Link>
    </View>
  );
}

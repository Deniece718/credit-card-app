import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
      <SafeAreaProvider>
          <Stack>
            <Stack.Screen name="index" options={{ title: "Dashboard" }} />
            <Stack.Screen name="support" options={{ title: "Support" }} />
            <Stack.Screen name="cards/[cardId]/cardDetail" options={{ title: "Card Image" }} />
            <Stack.Screen name="cards/[cardId]/invoice" options={{ title: "Card Invoice" }} />
            <Stack.Screen name="cards/[cardId]/spendingLimit" options={{ title: "Card Spending Limit" }} />
            <Stack.Screen name="cards/[cardId]/transaction" options={{ title: "Transaction" }} />
            <Stack.Screen name="companies/[companyId]/invoice" options={{ title: "Company Invoice" }} />
        </Stack>
      </SafeAreaProvider>
  );
}
  

import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { API_BASE } from "../..";
import { styles } from "../../../utils/styles";
import { CardInfo } from "../../../utils/types";

export default function SpendingLimitScreen() {
  const { cardId } = useLocalSearchParams();
  const [cardLimit, setCardLimit] = useState<number | null>(null);
  const [newLimit, setNewLimit] = useState("");
  const router = useRouter();
  
  useEffect(() => {
    axios
        .get<{data: CardInfo}>(`${API_BASE}/cards/${cardId}`)
        .then((res) => {
            const limit = res.data.data.creditLimit;
            setCardLimit(limit);
        })
        .catch(console.error);
  }, [cardId]);
  
  const handleNumberChange = (limit: string) => {
    setNewLimit(limit);
  }

  function updateLimit() {
    const newLimitNumber = Number(newLimit);
    axios
        .patch<{data: CardInfo}>(`${API_BASE}/cards/${cardId}/limit`, {newLimit: newLimitNumber})
        .then((res) => {
          router.push('/');
        })
        .catch(console.error);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.content}>
          <Text>Current Limit: {cardLimit}</Text>

          <TextInput
            keyboardType="numeric"
            value={newLimit}
            placeholder="New Spending Limit"
            onChangeText={handleNumberChange}
          />

          <Button mode="contained" style={styles.button} onPress={() => updateLimit()}>
              Submit
          </Button>

      </View>
  </KeyboardAvoidingView>
  );
};

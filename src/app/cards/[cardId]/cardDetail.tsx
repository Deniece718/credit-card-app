
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { API_BASE } from "../..";
import { styles } from "../../../utils/styles";
import { CardInfo } from "../../../utils/types";

export default function CardDetailScreen() {
  const { cardId } = useLocalSearchParams();
  const [cardData, setCardData] = useState<CardInfo | null>(null);

  useEffect(() => {
    axios.get<{data: CardInfo}>(`${API_BASE}/cards/${cardId}`)
    .then((res) => {
      setCardData(res.data.data);
    })
     .catch(console.error);
  }, [cardId])

  return (
    <View style={styles.container}>
      <View style={{alignItems: "center"}}>
        <Image source={require("../../../../assets/images/credit-card-1.png")} resizeMode="contain" />
      </View>

      {cardData && (
        <View style={styles.cardBox}>
          <Text style={styles.cardText}>Card Status: {cardData.isActivated ? "Acitve" : "Inactive"}</Text>
          <Text style={styles.cardText}>Card Id: {cardData._id}</Text>
          <Text style={styles.cardText}>Card Number: {cardData.cardNumber}</Text>
          <Text style={styles.cardText}>Expired Date: {new Date(cardData.expirationDate).toISOString().slice(0,10)}</Text>
        </View>
      )}
    </View>
  );
};
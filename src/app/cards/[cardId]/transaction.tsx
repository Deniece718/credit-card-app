
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { API_BASE } from "../..";
import { styles } from "../../../utils/styles";
import { Transaction } from "../../../utils/types";

type TransactionWithID = Omit<Transaction, 'id'> & {_id: string};

export default function TransactionScreen() {
  const { cardId } = useLocalSearchParams();
  const [transactions, setTransactions] = useState<TransactionWithID[]>([])

  useEffect(() => {
    axios
        .get<{data: TransactionWithID}>(`${API_BASE}/cards/${cardId}/transactions`)
        .then((res) => {
            const list = Array.isArray(res.data?.data) ? res.data.data : [];
            setTransactions(list);
        })
        .catch(console.error);
  }, [cardId]);

  return (
      <View style={styles.container}>
        <Text style={styles.text}>Transactions for Company Card:</Text>
        <Text style={styles.text}>{cardId}</Text>
        {transactions && transactions.length > 0 && (
          <View style={styles.card}>
            <FlatList
              data={transactions}
              keyExtractor={(item) => item._id.toString()}
              ListHeaderComponent={() => (
                <View style={styles.transaction}>
                  <Text style={styles.longText}>Date</Text>
                  <Text style={styles.longText}>Description</Text>
                  <Text style={styles.longText}>Amount</Text>
                </View>
              )}
              renderItem={({ item }) => (
                <View style={styles.transaction}>
                  <Text style={styles.longText}>{new Date(item.date).toISOString().slice(0,10)}</Text>
                  <Text style={styles.longText}>{item.description}</Text>
                  <Text style={styles.longText}>{item.amount}</Text>
                </View>
              )}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false} 
            />
          </View>
        )}
      </View>
    );
  };

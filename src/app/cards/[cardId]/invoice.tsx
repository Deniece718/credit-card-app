
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { API_BASE } from "../..";
import { styles } from "../../../utils/styles";
import { Invoice } from "../../../utils/types";

export default function InvoiceScreen() {
  const { cardId } = useLocalSearchParams();
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    return () => {
      setInvoices([]);
    };
  }, []);

  useEffect(() => {
    axios
      .get<{data: Invoice[]}>(`${API_BASE}/cards/${cardId}/invoices`)
      .then((res) => {
          const list = Array.isArray(res.data?.data) ? res.data.data : [];
          setInvoices(list);
      })
      .catch(console.error);
  }, [cardId]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Invoices for Company Card: </Text>
      <Text style={styles.text}>{cardId}</Text>
      {invoices.length === 0 && (
        <Text style={[styles.title, styles.text]}>There is no invoice for your card!</Text>
      )}
      {invoices && invoices.length > 0 && (
        <View style={styles.card}>
          <FlatList
            data={invoices}
            keyExtractor={(item) => item._id.toString()}
            ListHeaderComponent={() => {
              return <View style={styles.invoice}>
                <Text style={styles.longText}>Year-Month</Text>
                <Text style={styles.longText}>Amount</Text>
                <Text style={styles.longText}>Status</Text>
              </View>
            }}
            renderItem={({ item }) => (
              <View style={styles.invoice}>
                <Text style={styles.longText}> {new Date(item.dueDate).toISOString().slice(2,10)} </Text>
                <Text style={styles.longText}> {item.amount} </Text>
                <Text style={styles.longText}> {item.isPaid ? 'Paid': 'Unpaid'} </Text>
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

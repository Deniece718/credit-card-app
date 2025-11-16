/*
  TODO: Split the whole DashboardScreen into separate components, e.g. Header, Company Picker, to make the index file clean
*/

import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Image, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { styles } from "../utils/styles";
import { Card, Company } from "../utils/types";

export const API_BASE = "http://localhost:3000/api";

export default function DashboardScreen() {
    const [menuVisible, setMenuVisible] = useState(false);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [companiesOpen, setCompaniesOpen] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
    const [cards, setCards] = useState<Card[]>([]);
    const [cardsOpen, setCardsOpen] = useState(false);
    const [selectedCardId, setselectedCardId] = useState<string>("");
    const [cardData, setCardData] = useState<Card | null>(null);
    const [isActivated, setIsActivated] = useState(false);

    const router = useRouter();
    useEffect(() => {
      axios
        .get<{data: Company[]}>(`${API_BASE}/companies`)
        .then((res) => {
            const list = Array.isArray(res.data?.data) ? res.data.data : [];
            setCompanies(list);
        })
        .catch(console.error);
    }, []);

    useEffect(() => {
      setselectedCardId("");
      setCardData(null);
      if (!selectedCompanyId) return;
      axios
        .get<{data: Card[]}>(`${API_BASE}/companies/${selectedCompanyId}/cards/allData`)
        .then((res) => {
          const list = Array.isArray(res.data?.data) ? res.data.data : [];
          setCards(list);
        })
        .catch(console.error);
    }, [selectedCompanyId]);

    useEffect(() => {
      if (!selectedCardId) return;
      const card = cards.find((c) => c.id === selectedCardId);
      setCardData(card ?? null);
      setIsActivated(card ? card.isActivated : false);
    }, [selectedCardId, cards]);

    const companyItems = useMemo(
      () => companies.map((c) => ({ label: c.companyName, value: c._id })),
      [companies]
    )

    const cardItems = useMemo(
      () => cards.map((c) => ({ label: c.cardNumber, value: c.id })),
      [cards]
    )

    function updateCardState (cardId: string) {
      const newState = !cardData?.isActivated;
      axios.patch<{data: Card}>(`${API_BASE}/cards/${cardId}/state?isActivated=${newState}`).then((res) => {
        cards.map((card) => {
          if (card.id === cardId){
            card.isActivated = newState;
          }
        })
        setCards(cards);
        setIsActivated(res.data.data.isActivated)
        })
        .catch(console.error);
    }

    return (
      <ScrollView 
        style={styles.container}
        nestedScrollEnabled={true}
      >
        {/* Header */}
        <View style={styles.header}>
          {/* <Text style={styles.box}>Logo</Text> */}
          <Image source={require("../../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Text style={styles.menuText}>☰</Text>
          </TouchableOpacity>

          <Modal
            transparent
            animationType="fade"
            visible={menuVisible}
            onRequestClose={() => setMenuVisible(false)}
          >
            <TouchableOpacity
              style={styles.overlay}
              activeOpacity={1}
              onPressOut={() => setMenuVisible(false)}
            >
              <View style={styles.menuContainer}>
                <TouchableOpacity
                  style={styles.menuItem}
                >
                  <Text style={styles.menuItemText}>Sign out</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>

        {/* Company picker */}
        <View style={{zIndex: 2}}>
          <DropDownPicker
            open={companiesOpen}
            value={selectedCompanyId}
            items={companyItems}
            setOpen={setCompaniesOpen}
            setValue={setSelectedCompanyId}
            placeholder="Select a company"
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            listMode="SCROLLVIEW"
          />
        </View>
        
        {/* Card picker */}
        {cards.length > 0 && (
          <View style={{zIndex: 1}}>
            <DropDownPicker
            open={cardsOpen}
            value={selectedCardId}
            items={cardItems}
            setOpen={setCardsOpen}
            setValue={setselectedCardId}
            placeholder="Select a card"
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            listMode="SCROLLVIEW"
          />
          </View>
      )}

        <View style={styles.card}>
          {/* Invoice due*/}
          <View style={styles.overlapping}>
            <View style={styles.invoiceDueBox}>
              <TouchableOpacity 
                style={styles.row}
                onPress={() => {
                  if(selectedCompanyId && !selectedCardId) {
                    router.push(`/companies/${selectedCompanyId}/invoice`)
                  } else if (selectedCardId) {
                    router.push(`/cards/${selectedCardId}/invoice`)
                  }
                }}
              >
              <Text style={styles.labelText}>Invoice due</Text>
              <Ionicons name="chevron-forward" size={20} />
            </TouchableOpacity>
          </View>
          </View>
          
          {/* Card image */}
          <View >
            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                if (selectedCardId) {
                  router.push(`/cards/${selectedCardId}/cardDetail`)
                }
              }}
            > 
              <View style={{alignItems: "center", width: "90%"}}>
                <Image source={require("../../assets/images/credit-card.png")} resizeMode="contain"/>
              </View>
              <Ionicons name="chevron-forward" size={20} />
            </TouchableOpacity>
          </View>
        </View>
        

        {/* Remaining spend */}
        <View style={styles.card}>
          <Text style={styles.title}>Remaining spend</Text>
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              if (cardData?.isActivated) {
                router.push(`/cards/${selectedCardId}/spendingLimit`)
              }
            }}
          >
            <Text style={styles.labelText}>
              {cardData?.isActivated && cardData?.remainingSpend?.used || 0} / {cardData?.isActivated && cardData?.remainingSpend?.limit || 0} kr
            </Text>
            <Ionicons name="chevron-forward" size={20} />
          </TouchableOpacity>
          <Text style={styles.subtext}>based on your set limit</Text>
        </View>

        {/* Latest transactions */}
        <View style={styles.card}>
          <Text style={styles.title}>Latest transactions</Text>
          {cardData && cardData.transactions?.length > 0 && (
            <FlatList
              data={cardData.transactions.slice(0, 3)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.transaction}>
                  <Text>{item.description}</Text>
                  <Text>{item.amount}</Text>
                </View>
              )}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          )}
        </View>

        {/* More transactions */}
        {cardData && cardData.transactions && cardData.transactions.length > 3 && (
          <View style={styles.whiteCard}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => router.push(`/cards/${selectedCardId}/transaction`)}
              activeOpacity={0.7}
            >
              <Text style={styles.labelText}>
                {cardData.transactions.length - 3} more items in transaction view
              </Text>
              <Ionicons name="chevron-forward" size={20} />
            </TouchableOpacity>
          </View>
        )}

        {/* Buttons */}
        <TouchableOpacity 
          style={[styles.button, styles.primary]} 
          onPress={() => {
            if (cardData) {
              updateCardState(cardData.id);
            }
          }
        }>
          <Text style={styles.buttonText}>{isActivated ? 'Deactivate card' : 'Activate card' } </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.secondary]}
          onPress={() => router.push('/support')}
        >
          <Text style={styles.secondaryText}>Contact Qred’s support</Text>
        </TouchableOpacity>
      </ScrollView>
  );
};


import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import SwipeCards from 'react-native-swipe-cards';

const cards = [
  { id: 1, text: 'Card 1' },
  { id: 2, text: 'Card 2' },
  { id: 3, text: 'Card 3' },
];

const SwipingCardScreen = () => {
  const [data, setData] = useState(cards);

  const handleYup = (card) => {
    console.log(`Yup for ${card.text}`);
  };

  const handleNope = (card) => {
    console.log(`Nope for ${card.text}`);
  };    
  const renderCard = (card) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>{card.text}</Text>
    </View>
  );

  const renderNoMoreCards = () => (
    <View style={styles.card}>
      <Text style={styles.cardText}>No More Cards</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <SwipeCards
        cards={data}
        renderCard={renderCard}
        renderNoMoreCards={renderNoMoreCards}
        handleYup={handleYup}
        handleNope={handleNope}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').height * 0.6,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SwipingCardScreen;

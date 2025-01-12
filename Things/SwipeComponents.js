import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-deck-swiper';

const SwipeComponent = ({ cards }) => {
  const renderCard = (card) => (
    <View style={styles.card}>
      <Image source={{ uri: card.image }} style={styles.image} />
      <Text style={styles.name}>{card.name}</Text>
    </View>
  );

  return (
    <Swiper
      cards={cards}
      renderCard={renderCard}
      stackSize={3}
      backgroundColor="transparent"
      cardIndex={0}
      showSecondCard
      verticalSwipe={false}
      onSwiped={(cardIndex) => console.log(`Card swiped: ${cardIndex}`)}
      onSwipedAll={() => console.log('All cards swiped!')}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    margin: 10,
    padding: 10,
  },
  image: {
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').height * 0.5,
    borderRadius: 10,
  },
  name: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SwipeComponent;

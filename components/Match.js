import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, FlatList, ScrollView, ActivityIndicator } from 'react-native'
import BottomNavbar from '../Things/BottomNavbar'
import { SvgXml } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MatchFilterTooltip from './MatchFilterTooltip';

const filterIconSvg = `
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect opacity="0.2" x="0.75" y="0.75" width="46.5" height="46.5" rx="23.25" stroke="#4B164C" stroke-width="1.5"/>
<g clip-path="url(#clip0_1354_445)">
<path d="M27 22C28.6569 22 30 20.6569 30 19C30 17.3431 28.6569 16 27 16C25.3431 16 24 17.3431 24 19C24 20.6569 25.3431 22 27 22Z" stroke="#4B164C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 19H24" stroke="#4B164C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M30 19L32 19" stroke="#4B164C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M21 32C22.6569 32 24 30.6569 24 29C24 27.3431 22.6569 26 21 26C19.3431 26 18 27.3431 18 29C18 30.6569 19.3431 32 21 32Z" stroke="#4B164C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 29H18" stroke="#4B164C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M24 29L32 29" stroke="#4B164C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_1354_445">
<rect width="24" height="24" fill="white" transform="translate(12 12)"/>
</clipPath>
</defs>
</svg>
`

const Match = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const response = await fetch('http://15.206.127.132:8000/matches/', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }

      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setError('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={64} color="#4B164C" style={styles.loadingIndicator} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Heading */}
        <Text style={styles.heading}>Matches</Text>

        {/* Filter Icon */}
        <TouchableOpacity 
          style={[styles.iconContainer, styles.filterIconPosition]}
          onPress={() => setShowFilterModal(true)}
        >
          <SvgXml xml={filterIconSvg} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        {/* Story Section */}
        <FlatList
          data={matches}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.storySection}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.storyItem}>
              <View style={styles.storyRing}>
                <ImageBackground 
                  source={{ uri: 'https://i.pinimg.com/736x/d0/ed/47/d0ed476d90044123b73da39291c05549.jpg' }} 
                  style={styles.storyImage} 
                  imageStyle={{ borderRadius: 28 }}
                >
                  <View style={styles.imageOverlay} />
                </ImageBackground>
              </View>
              <Text style={styles.userName}>{item.name}</Text>
            </View>
          )}
        />

        {/* "Your Matches" Text */}
        <Text style={styles.subHeading}>
          <Text style={styles.youMatchText}>Your Matches</Text> {matches.length}
        </Text>

        {/* Boxes Section */}
        <View style={styles.boxesContainer}>
          {matches.map((match) => (
            <View key={match.id} style={styles.box}>
              <LinearGradient
                colors={['#4B164C', '#4B164C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradient}
              >
                <ImageBackground 
                  source={{ uri: 'https://i.pinimg.com/736x/d0/ed/47/d0ed476d90044123b73da39291c05549.jpg' }} 
                  style={styles.boxImage} 
                  imageStyle={{ borderRadius: 22 }}
                >
                  <View style={styles.boxOverlay} />
                </ImageBackground>
              </LinearGradient>
              <View style={styles.locationTag}>
                <Text style={styles.locationText}>Lulu, Kochi</Text>
              </View>
              <Text style={styles.boxUserName}>{match.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Filter Tooltip */}
      <MatchFilterTooltip
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        sortBy={sortBy}
        onSortChange={setSortBy}
        matches={matches}
        setMatches={setMatches}
      />

      {/* Bottom Navbar */}
      <View style={styles.bottomNavbarContainer}>
        <BottomNavbar currentScreen="match" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf7fd',
    width: '100%',
  },
  locationTag: {
    position: 'absolute',
    bottom: 46,
    left: '56%',
    transform: [{ translateX: -50 }],
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 32,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.2,
    borderColor: '#FFFFFF',
  },
  locationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: '#FFFFFF',
    lineHeight: 14,
  },
  spotedPlaceText: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: '#FFFFFF',
    lineHeight: 14,
  },
  boxUserName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    lineHeight: 22,
    position: 'absolute',
    bottom: 17,
    left: '45%',
    transform: [{ translateX: -50 }],
    textAlign: 'center',
  },
  scrollViewContent: {
    paddingBottom: 80,
  },
  header: {
    height: 110,
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'absolute',
    top: 58,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIconPosition: {
    right: 24,
  },
  icon: {
    width: 24,
    height: 24,
  },
  heading: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#22172A',
    position: 'absolute',
    left: 140,
    top: 63,
  },
  storySection: {
    marginTop: 25,
    paddingHorizontal: 5,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  storyRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#DD88CF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#DD88CF',
    opacity: 0.2,
    borderRadius: 28,
  },
  userName: {
    marginTop: 4,
    fontSize: 13,
    color: '#22172A',
    fontFamily: 'Inter-Regular',
  },
  subHeading: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#DD88CF',
    marginTop: 40,
    marginLeft: 16,
  },
  youMatchText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    lineHeight: 24,
    color: '#4B164C',
  },
  boxesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 16,
  },
  box: {
    width: '48%',
    height: 224,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#DD88CF',
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  gradient: {
    flex: 1,
  },
  boxImage: {
    width: '100%',
    height: '100%',
  },
  boxOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#4B164C',
    opacity: 0.5,
  },
  bottomNavbarContainer: {
    position: 'absolute',
    zIndex: 10,
    left: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF0000',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default Match;
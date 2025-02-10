import { View, Text ,TouchableOpacity ,StyleSheet, ImageBackground , FlatList} from 'react-native'
import BottomNavbar from '../Things/BottomNavbar'
import { SvgXml } from 'react-native-svg';


const users = [
  { id: '1', name: 'Alice', image: require('../assets/lulu.jpg') },
  { id: '2', name: 'Bob', image: require('../assets/lulu.jpg') },
  { id: '3', name: 'Charlie', image: require('../assets/lulu.jpg') },
  { id: '4', name: 'David', image: require('../assets/lulu.jpg')}, { id: '1', name: 'Alice', image: require('../assets/lulu.jpg') },
  { id: '2', name: 'Bob', image: require('../assets/lulu.jpg') },
  { id: '3', name: 'Charlie', image: require('../assets/lulu.jpg') },
  { id: '4', name: 'David', image: require('../assets/lulu.jpg')},
];



const backIcon = `<svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect opacity="0.08" x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="#22172A"/>
<g clip-path="url(#clip0_1473_352)">
<path d="M23 14L17 20L23 26" stroke="#22172A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_1473_352">
<rect width="24" height="24" fill="white" transform="translate(8 8)"/>
</clipPath>
</defs>
</svg>
`

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
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Back Icon */}
        <TouchableOpacity style={[styles.iconContainer, styles.backIconPosition]}>
          <SvgXml xml={backIcon} style={styles.icon} />
        </TouchableOpacity>

        {/* Heading */}
        <Text style={styles.heading}>Matches</Text>

        {/* Filter Icon */}
        <TouchableOpacity style={[styles.iconContainer, styles.filterIconPosition]}>
          <SvgXml xml={filterIconSvg} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={users}
        horizontal
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.storySection}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.storyItem}>
            <View style={styles.storyRing}>
              {/* Use ImageBackground to blend image and color */}
              <ImageBackground source={item.image} style={styles.storyImage} imageStyle={{ borderRadius: 28 }}>
                <View style={styles.imageOverlay} />
              </ImageBackground>
            </View>
            <Text style={styles.userName}>{item.name}</Text>
          </View>
        )}
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

  // Header Wrapper
  header: {
    position: 'relative', // Allows absolute positioning inside
    height: 80, // Enough space for icons and title
    justifyContent: 'center',
  },

  // Back & Filter Icon Container
  iconContainer: {
    position: 'absolute',
    top: 58, // Matches Figma's Y = 58
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Specific Positioning
  backIconPosition: {
    left: 24, // X = 24
  },
  filterIconPosition: {
    left: 319, // X = 319
  },

  // Back & Filter Icon (Same size)
  icon: {
    width: 24,
    height: 24,
  },

  // Heading
  heading: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#22172A',
    position: 'absolute',
    left: 136, // Adjusted for center alignment
    top: 63, // Matches Figma's Y = 66
  },

    // Story Section
    storySection: {
      marginTop: 45,
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
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: '#DD88CF',
      opacity: 0.2, // This will blend with the image
      borderRadius: 28,
    },
    userName: {
      marginTop: 4,
      fontSize: 13,
      color: '#22172A',
      fontFamily: 'Inter-Regular',
    },
  // Bottom Navbar
  bottomNavbarContainer: {
    position: 'absolute',
    zIndex: 10,
    left: 8,
  },
});

export default Match;
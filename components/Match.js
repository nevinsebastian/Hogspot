import { View, Text ,StyleSheet} from 'react-native'
import BottomNavbar from '../Things/BottomNavbar'
const Match = () => {
  return (
    <View>
      <Text>Match</Text>
      <View style={styles.bottomNavbarContainer}>
        <BottomNavbar currentScreen="match" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavbarContainer: {
    position: 'absolute',
        zIndex: 10, 
      
          left:8, // Set left position to 0

      },
})

export default Match
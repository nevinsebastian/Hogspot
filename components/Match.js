import { View, Text ,TouchableOpacity ,StyleSheet} from 'react-native'
import BottomNavbar from '../Things/BottomNavbar'
import { SvgXml } from 'react-native-svg';


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
      <TouchableOpacity style={styles.backIconContainer}>
        <SvgXml xml={backIcon} style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.heading}>Matches</Text>
      <TouchableOpacity style={styles.filterIconContainer}>
      <SvgXml xml={filterIconSvg} style={styles.filterIconSvg} />

      </TouchableOpacity>
      <View style={styles.bottomNavbarContainer}>
        <BottomNavbar currentScreen="match" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fdf7fd',
    width: '100%',
  },

  backIconContainer: {
    position: 'absolute',
    left: 24,  
    top: 58,   
    width: 40,
    height: 40, 
    justifyContent: 'center',
    alignItems: 'center',
  },

  backIcon: {
    width: 24, 
    height: 24,
  },
  heading: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#22172A',
    position: 'absolute',
    left: 136,
    top:66,
  }, 
  filterIconContainer: {
    position: 'absolute',
    left: 319,  
    top: 58,   
    width: 40,
    height: 40, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIconSvg:{
    width: 24, 
    height: 24,
  },
  bottomNavbarContainer: {
    position: 'absolute',
    zIndex: 10,
    left: 8,
  },
});

export default Match;
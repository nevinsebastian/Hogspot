import { View,Text, StyleSheet,TouchableOpacity } from 'react-native'
import BottomNavbar from '../Things/BottomNavbar'
import { SvgXml } from 'react-native-svg';


const backIcon = `<svg width="38" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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



const Chat = () => {
  return (
    <View style={styles.container}>
       <View style={styles.header}>
              {/* Back Icon */}
              <TouchableOpacity style={[styles.iconContainer, styles.backIconPosition]}>
                <SvgXml xml={backIcon} style={styles.icon} />
              </TouchableOpacity>
      
              {/* Heading */}
              <Text style={styles.heading}>Messages</Text>
      
              {/* Filter Icon */}
             
            </View>
        <BottomNavbar currentScreen="chat" />
        </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf7fd',
    width: '100%',
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
  icon: {
    width: 24,
    height: 24,
  },
  backIconPosition: {
    left: 24,
  }, heading: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#22172A',
    position: 'absolute',
    left: 136,
    top:63,},
  
  bottomNavbarContainer: {
    position: 'absolute',
    zIndex: 10,
    left: 8,
  },
});


export default Chat
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { faker } from '@faker-js/faker';

const users = Array.from({ length: 10 }, (_, id) => ({
  id,
  name: faker.person.fullName(),
  lastMessage: faker.lorem.sentence(),
  time: faker.date.recent().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  unread: faker.datatype.boolean(),
  profileImage: faker.image.avatar(),
}));


const backIcon = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect opacity="0.08" x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="white"/>
<g clip-path="url(#clip0_1494_140)">
<path d="M23 14L17 20L23 26" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_1494_140">
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
      </View>

      {/* Scrollable Chat List */}
      <View style={styles.chatListContainer}>
        <ScrollView contentContainerStyle={styles.chatList} showsVerticalScrollIndicator={false}>
          {users.slice(0, users.length - 3).map(user => (
            <View key={user.id} style={styles.chatItem}>
              <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
              <View style={styles.chatInfo}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.lastMessage}>{user.lastMessage}</Text>
              </View>
              <View style={styles.chatMeta}>
                <Text style={styles.time}>{user.time}</Text>
                {user.unread && <View style={styles.unreadDot} />}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B164C',
    width: '100%',
  }, bottomNavbar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4, // For Android shadow effect
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
  },
  heading: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    position: 'absolute',
    left: 136,
    top: 63,
  },
  chatListContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    flex: 1,
    marginTop: 16,
  },
  chatList: {
    paddingVertical: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  chatMeta: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#DD88CF',
    marginTop: 4,
  },
});

export default Chat;



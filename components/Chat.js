import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useState, useEffect, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image as ExpoImage } from 'expo-image';


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
  const navigation = useNavigation();
  const [conversations, setConversations] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchConversations = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch both conversations and matches in parallel
      const [conversationsResponse, matchesResponse] = await Promise.all([
        fetch('http://18.207.241.126/chat/conversations', {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch('http://18.207.241.126/matches/', {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }),
      ]);

      if (!conversationsResponse.ok) {
        throw new Error('Failed to fetch conversations');
      }

      if (!matchesResponse.ok) {
        throw new Error('Failed to fetch matches');
      }

      const conversationsData = await conversationsResponse.json();
      const matchesData = await matchesResponse.json();

      setConversations(conversationsData || []);
      setMatches(matchesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Refetch conversations when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchConversations();
    }, [])
  );

  const onRefresh = useCallback(() => {
    fetchConversations(true);
  }, []);

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleConversationPress = (conversation) => {
    navigation.navigate('ChatDetail', {
      conversationId: conversation.id,
      otherUserId: conversation.other_user_id,
      otherUserName: conversation.other_user_name,
      otherUserImage: conversation.other_user_image,
    });
  };

  const handleMatchPress = (match) => {
    // Get priority 1 image or first image
    const getImageUrl = () => {
      if (match.images && match.images.length > 0) {
        const priorityOneImage = match.images.find(img => img.priority === 1);
        return priorityOneImage?.image_url || match.images[0]?.image_url;
      }
      return null;
    };

    navigation.navigate('ChatDetail', {
      conversationId: null, // No conversation yet
      otherUserId: match.id,
      otherUserName: match.name,
      otherUserImage: getImageUrl(),
    });
  };

  // Get matched users who don't have conversations yet
  const getMatchesWithoutConversations = () => {
    if (!matches || matches.length === 0) return [];
    
    const conversationUserIds = new Set(
      conversations.map(conv => conv.other_user_id)
    );
    
    return matches.filter(match => !conversationUserIds.has(match.id));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>Messages</Text>
        </View>
        <View style={[styles.chatListContainer, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#4B164C" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>Messages</Text>
        </View>
        <View style={[styles.chatListContainer, styles.errorContainer]}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchConversations()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Heading */}
        <Text style={styles.heading}>Messages</Text>
      </View>

      {/* Scrollable Chat List */}
      <View style={styles.chatListContainer}>
        {conversations.length === 0 && getMatchesWithoutConversations().length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No conversations yet</Text>
            <Text style={styles.emptySubtext}>Start swiping to find matches!</Text>
          </View>
        ) : (
          <ScrollView 
            contentContainerStyle={styles.chatList} 
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#4B164C']}
                tintColor="#4B164C"
              />
            }
          >
            {/* Conversations */}
            {conversations.map(conversation => (
              <TouchableOpacity
                key={`conv-${conversation.id}`}
                style={styles.chatItem}
                onPress={() => handleConversationPress(conversation)}
                activeOpacity={0.7}
              >
                <ExpoImage
                  source={conversation.other_user_image 
                    ? { uri: conversation.other_user_image } 
                    : require('../assets/profileava.jpg')
                  }
                  style={styles.profileImage}
                  contentFit="cover"
                  transition={200}
                  cachePolicy="memory-disk"
                  placeholder={require('../assets/profileava.jpg')}
                />
                <View style={styles.chatInfo}>
                  <Text style={styles.name}>
                    {conversation.other_user_name 
                      ? conversation.other_user_name.charAt(0).toUpperCase() + conversation.other_user_name.slice(1).toLowerCase()
                      : 'Unknown'
                    }
                  </Text>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {conversation.last_message || 'No messages yet'}
                  </Text>
                </View>
                <View style={styles.chatMeta}>
                  <Text style={styles.time}>
                    {formatTime(conversation.last_message_at)}
                  </Text>
                  {conversation.unread_count > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadCount}>
                        {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}

            {/* Matches without conversations */}
            {getMatchesWithoutConversations().map(match => {
              // Get priority 1 image or first image
              const getImageUrl = () => {
                if (match.images && match.images.length > 0) {
                  const priorityOneImage = match.images.find(img => img.priority === 1);
                  return priorityOneImage?.image_url || match.images[0]?.image_url;
                }
                return null;
              };

              return (
                <TouchableOpacity
                  key={`match-${match.id}`}
                  style={styles.chatItem}
                  onPress={() => handleMatchPress(match)}
                  activeOpacity={0.7}
                >
                  <ExpoImage
                    source={getImageUrl() 
                      ? { uri: getImageUrl() } 
                      : require('../assets/profileava.jpg')
                    }
                    style={styles.profileImage}
                    contentFit="cover"
                    transition={200}
                    cachePolicy="memory-disk"
                    placeholder={require('../assets/profileava.jpg')}
                  />
                  <View style={styles.chatInfo}>
                    <Text style={styles.name}>
                      {match.name 
                        ? match.name.charAt(0).toUpperCase() + match.name.slice(1).toLowerCase()
                        : 'Unknown'
                      }
                    </Text>
                    <Text style={[styles.lastMessage, styles.newMatchText]} numberOfLines={1}>
                      Start chatting
                    </Text>
                  </View>
                  <View style={styles.chatMeta}>
                    <View style={styles.newMatchBadge}>
                      <Text style={styles.newMatchBadgeText}>New</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
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
  unreadBadge: {
    backgroundColor: '#DD88CF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginTop: 4,
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4B164C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B164C',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  newMatchText: {
    color: '#DD88CF',
    fontStyle: 'italic',
  },
  newMatchBadge: {
    backgroundColor: '#DD88CF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  newMatchBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Chat;



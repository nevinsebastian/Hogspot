import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Dimensions, Platform, ActivityIndicator, Linking, Modal, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import BottomNavbar from '../Things/BottomNavbar';
import MapView, { Marker, Polygon } from 'react-native-maps';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

const openMaps = async (hotspot) => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // Calculate center point of the hotspot
    const centerLat = hotspot.coordinates.reduce((sum, coord) => sum + coord[0], 0) / hotspot.coordinates.length;
    const centerLon = hotspot.coordinates.reduce((sum, coord) => sum + coord[1], 0) / hotspot.coordinates.length;

    const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${centerLat},${centerLon}&travelmode=driving`;

    Linking.openURL(url);
  } catch (error) {
    console.log('Error opening maps:', error);
  }
};


const locationSvg = `
<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1354_463)">
<rect opacity="0.01" width="12" height="12" fill="white"/>
<path d="M5.9998 11.4002C6.66255 11.4002 7.1998 10.863 7.1998 10.2002C7.1998 9.5375 6.66255 9.00024 5.9998 9.00024C5.33706 9.00024 4.7998 9.5375 4.7998 10.2002C4.7998 10.863 5.33706 11.4002 5.9998 11.4002Z" fill="#DD88CF"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.00019 9.29237C5.49882 9.29237 5.09238 9.69881 5.09238 10.2002C5.09238 10.7015 5.49882 11.108 6.00019 11.108C6.50155 11.108 6.90799 10.7015 6.90799 10.2002C6.90799 9.69881 6.50155 9.29237 6.00019 9.29237ZM4.5 10.2002C4.5 9.37177 5.17157 8.7002 6 8.7002C6.82842 8.7002 7.5 9.37177 7.5 10.2002C7.5 11.0286 6.82842 11.7002 6 11.7002C5.17157 11.7002 4.5 11.0286 4.5 10.2002Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.69971 6.58545H6.29971V9.58545H5.69971V6.58545Z" fill="#DD88CF"/>
<path d="M6 6.90015C7.65684 6.90015 9 5.55702 9 3.90015C9 2.2433 7.65684 0.900146 6 0.900146C4.34315 0.900146 3 2.2433 3 3.90015C3 5.55702 4.34315 6.90015 6 6.90015Z" fill="#DD88CF"/>
<path d="M6.00009 4.80024C6.49714 4.80024 6.9001 4.39728 6.9001 3.90024C6.9001 3.40319 6.49714 3.00024 6.00009 3.00024C5.50304 3.00024 5.1001 3.40319 5.1001 3.90024C5.1001 4.39728 5.50304 4.80024 6.00009 4.80024Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_1354_463">
<rect width="12" height="12" fill="white"/>
</clipPath>
</defs>
</svg>
`;

const otherIconSvg = `
<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1354_475)">
<path d="M3 4.5L6 7.5L9 4.5" stroke="#DD88CF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_1354_475">
<rect width="12" height="12" fill="white"/>
</clipPath>
</defs>
</svg>
`;

const searchIconSvg = `
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect opacity="0.2" x="0.75" y="0.75" width="46.5" height="46.5" rx="23.25" stroke="#4B164C" stroke-width="1.5"/>
<circle cx="23.7664" cy="23.7666" r="8.98856" stroke="#4B164C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M30.0181 30.4851L33.5421 34" stroke="#4B164C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

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
`;
const customMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#523735"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c9b2a6"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#dcd2be"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ae9e90"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93817c"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a5b076"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#447530"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fdfcf8"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f8c967"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#e9bc62"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e98d58"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#db8555"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#806b63"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8f7d77"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#b9d3c2"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#92998d"
      }
    ]
  }
];

const hogspots = [
  { id: 1, image: require('../assets/lulu.jpg') },
  { id: 2, image: require('../assets/lulu.jpg') },
  { id: 3, image: require('../assets/lulu.jpg') },
  { id: 4, image: require('../assets/lulu.jpg') },
  { id: 5, image: require('../assets/lulu.jpg') },
  { id: 6, image: require('../assets/lulu.jpg') },
  // Add more hogspots as needed
];

const Discover = () => {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState('');
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapRegion, setMapRegion] = useState(null);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Function to calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return Math.round(distance);
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  // Function to calculate map region based on nearest hotspot
  const calculateMapRegion = (spots) => {
    if (!spots || spots.length === 0) return null;

    // Find the nearest hotspot
    const nearestHotspot = spots.reduce((nearest, current) => {
      return current.distance < nearest.distance ? current : nearest;
    });

    // Get coordinates of the nearest hotspot
    const coordinates = nearestHotspot.coordinates;
    
    let minLat = Number.MAX_VALUE;
    let maxLat = Number.MIN_VALUE;
    let minLon = Number.MAX_VALUE;
    let maxLon = Number.MIN_VALUE;

    coordinates.forEach(coord => {
      minLat = Math.min(minLat, coord[0]);
      maxLat = Math.max(maxLat, coord[0]);
      minLon = Math.min(minLon, coord[1]);
      maxLon = Math.max(maxLon, coord[1]);
    });

    const centerLat = (minLat + maxLat) / 2;
    const centerLon = (minLon + maxLon) / 2;
    const latDelta = (maxLat - minLat) * 2.5;
    const lonDelta = (maxLon - minLon) * 2.5;

    return {
      latitude: centerLat,
      longitude: centerLon,
      latitudeDelta: latDelta,
      longitudeDelta: lonDelta,
    };
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        
        let geocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
        
        if (geocode && geocode.length > 0) {
          setCity(geocode[0].city || geocode[0].subregion || 'Unknown location');
        }

        // Fetch hotspots
        const response = await fetch('http://15.206.127.132:8000/hotspot/all');
        const data = await response.json();
        
        // Calculate distances and add to hotspot data
        const hotspotsWithDistance = data.map(hotspot => {
          const centerLat = hotspot.coordinates.reduce((sum, coord) => sum + coord[0], 0) / hotspot.coordinates.length;
          const centerLon = hotspot.coordinates.reduce((sum, coord) => sum + coord[1], 0) / hotspot.coordinates.length;
          
          const distance = calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            centerLat,
            centerLon
          );

          return {
            ...hotspot,
            distance
          };
        });

        setHotspots(hotspotsWithDistance);
        setMapRegion(calculateMapRegion(hotspotsWithDistance));
        setLoading(false);
      } catch (error) {
        console.log('Error:', error);
        setLoading(false);
      }
    })();
  }, []);

  const handleMarkerPress = (hotspot) => {
    setSelectedHotspot(hotspot);
    setShowModal(true);
  };

  const handleNavigation = async () => {
    if (selectedHotspot) {
      await openMaps(selectedHotspot);
      setShowModal(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4B164C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SvgXml xml={locationSvg} style={styles.locationIcon} />
        <Text style={styles.locationText}>{city || 'Loading...'}</Text>
        <SvgXml xml={otherIconSvg} style={styles.otherIcon} />
      </View>
      <View style={styles.mainTextContainer}>
        <Text style={styles.mainText}>Discover</Text>
        <View style={styles.iconContainer}>
          <SvgXml xml={searchIconSvg} style={styles.searchIcon} />
          <SvgXml xml={filterIconSvg} style={styles.filterIcon} />
        </View>
      </View>
      <Text style={styles.subText}>
        <Text style={styles.hogspotText}>Hogspot </Text>
        <Text style={styles.nearYouText}>near you</Text>
      </Text>
      <ScrollView
        horizontal
        style={styles.hogspotScroll}
        contentContainerStyle={styles.hogspotScrollContent}
        showsHorizontalScrollIndicator={false}
      >
        {hotspots.map(hotspot => (
          <View key={hotspot.id} style={styles.hogspotItem}>
            <ImageBackground source={require('../assets/lulu.jpg')} style={styles.hogspotImage}>
              <View style={styles.gradientOverlay} />
              <View style={styles.hotspotTag}>
                <Text style={styles.hotspotText}>Hot️‍️‍🔥</Text>
              </View>
              <View style={styles.distanceTag}>
                <Text style={styles.distanceText}>{hotspot.distance} km away</Text>
              </View>
              <Text style={styles.hogspotTitle} numberOfLines={1}>
                {hotspot.name.split(' ')[0].substring(0, 12)}
              </Text>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>
      <Text style={styles.aroundMeText}>Around me</Text>
      <Text style={styles.nearbySparksText}>
        <Text style={styles.hogspotSparksText}>"Hogspot"</Text> Sparks Await Nearby
      </Text>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          customMapStyle={customMapStyle}
          initialRegion={mapRegion || {
            latitude: location?.coords?.latitude || 10.0258,
            longitude: location?.coords?.longitude || 76.3083,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {hotspots.map((hotspot) => {
            const centerLat = hotspot.coordinates.reduce((sum, coord) => sum + coord[0], 0) / hotspot.coordinates.length;
            const centerLon = hotspot.coordinates.reduce((sum, coord) => sum + coord[1], 0) / hotspot.coordinates.length;

            const polygonCoordinates = hotspot.coordinates.map(coord => ({
              latitude: coord[0],
              longitude: coord[1]
            }));

            return (
              <React.Fragment key={hotspot.id}>
                <Polygon
                  coordinates={polygonCoordinates}
                  strokeColor="rgba(221, 136, 207, 0.8)"
                  fillColor="rgba(221, 136, 207, 0.2)"
                  strokeWidth={2}
                />
                <Marker
                  coordinate={{
                    latitude: centerLat,
                    longitude: centerLon,
                  }}
                  title={hotspot.name}
                  description={hotspot.description}
                  onPress={() => handleMarkerPress(hotspot)}
                >
                  <View style={styles.markerContainer}>
                    <View style={styles.markerContent}>
                      <Text style={styles.markerText}>{hotspot.name}</Text>
                    </View>
                  </View>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapView>
      </View>

      <View style={styles.bottomNavbarContainer}>
        <BottomNavbar currentScreen="discover" />
      </View>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Navigate to {selectedHotspot?.name}?</Text>
            <Text style={styles.modalDescription}>{selectedHotspot?.description}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.navigateButton]} 
                onPress={handleNavigation}
              >
                <Text style={styles.navigateButtonText}>Navigate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  mapContainer: {
    width: width - 32, // Adjust width based on screen width
    height: height * 0.45, // Adjust height based on screen height
    borderRadius: 24, // Rounded corners
    overflow: 'hidden', // Clip content to rounded corners
    marginTop:15,
    ...Platform.select({
      android: {
        elevation: 4, // Add shadow for Android
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
    }),
  },
  map: {
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 48,
  },
  locationIcon: {
    width: 6,
    height: 10.8,
    marginRight: 2,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#22172A',
    marginRight: 10,
  },
  otherIcon: {
    width: 12,
    height: 12,
  },
  mainTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  mainText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#22172A',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  searchIcon: {
    width: 24,
    marginRight: 16,
    marginTop: -13
  },
  filterIcon: {
    width: 24,
    height: 24,
    marginTop: -13
  },
  subText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    lineHeight: 16.25,
    marginTop: -5,
  },
  hogspotText: {
    color: '#DD88CF',
  },
  nearYouText: {
    color: '#626262',
  },
  hogspotScroll: {
    marginTop: 32,
    maxHeight: 180,
    width: '100%'
  },
  hogspotScrollContent: {
    paddingHorizontal: 0,
  },
  hogspotItem: {
    width: 105,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#DD88CF',
  },
  hogspotImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(75, 22, 76, 0.6)',
  },
  hotspotTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#4B164C',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DD88CF'
  },
  hotspotText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
    color: '#DD88CF',
    lineHeight: 14,
  },
  distanceTag: {
    position: 'absolute',
    bottom: 40,
    left: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 32,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  distanceText: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: '#FFFFFF',
    lineHeight: 14,
  },
  hogspotTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: '#FFFFFF',
    lineHeight: 14,
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    textAlign: 'center',
    paddingRight: 10,
    numberOfLines: 1,
  },
  aroundMeText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    lineHeight: 24,
    color: '#22172A',
    marginTop: 0,
  },
  nearbySparksText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 21,
    color: '#6C727F',
    marginTop: 6,
  },
  hogspotSparksText: {
    fontFamily: 'Inter-Medium',
    color: '#DD88CF',
  },
  bottomNavbarContainer: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    position: 'absolute',
    zIndex: 10,
    left: 8,
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#DD88CF',
  },
  markerText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#4B164C',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#4B164C',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#626262',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  navigateButton: {
    backgroundColor: '#4B164C',
  },
  cancelButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#626262',
  },
  navigateButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default Discover;
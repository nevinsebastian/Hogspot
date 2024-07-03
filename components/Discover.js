import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';

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

const Discover = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SvgXml xml={locationSvg} style={styles.locationIcon} />
        <Text style={styles.locationText}>Kochi</Text>
        <SvgXml xml={otherIconSvg} style={styles.otherIcon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 45,
  },
  locationIcon: {
    width: 6,
    height: 10.8,
    marginRight: 10,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#22172A',
    marginRight: 20,
  },
  otherIcon: {
    width: 12,
    height: 12,
  },
  
});

export default Discover;

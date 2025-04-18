import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Modal, Pressable, Dimensions } from 'react-native';
import { SvgXml } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const newestIconSvg = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 8V12L15 15" stroke="#4B164C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4B164C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const oldestIconSvg = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 8V12L15 15" stroke="#4B164C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4B164C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const nearestIconSvg = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="#4B164C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 11.5C13.3807 11.5 14.5 10.3807 14.5 9C14.5 7.61929 13.3807 6.5 12 6.5C10.6193 6.5 9.5 7.61929 9.5 9C9.5 10.3807 10.6193 11.5 12 11.5Z" stroke="#4B164C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const checkmarkSvg = `
<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 3L4.5 8.5L2 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const MatchFilterTooltip = ({ 
  visible, 
  onClose, 
  sortBy, 
  onSortChange, 
  matches, 
  setMatches 
}) => {
  if (!visible) return null;

  const sortMatches = (matches, sortType) => {
    switch (sortType) {
      case 'newest':
        return [...matches].sort((a, b) => b.id - a.id);
      case 'oldest':
        return [...matches].sort((a, b) => a.id - b.id);
      case 'nearest':
        return [...matches].sort((a, b) => a.distance - b.distance);
      default:
        return matches;
    }
  };

  const handleSortChange = (sortType) => {
    onSortChange(sortType);
    setMatches(sortMatches(matches, sortType));
    onClose();
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable 
        style={styles.backdrop} 
        onPress={onClose}
      >
        <View style={styles.backdropOverlay} />
        <Pressable 
          style={styles.tooltipContainer}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.tooltipArrow} />
          <View style={styles.tooltipContent}>
            <View style={styles.filterOptions}>
              <TouchableOpacity 
                style={[
                  styles.filterOption,
                  sortBy === 'newest' && styles.selectedFilterOption
                ]}
                onPress={() => handleSortChange('newest')}
              >
                <View style={styles.filterOptionContent}>
                  <SvgXml xml={newestIconSvg} style={styles.filterOptionIcon} />
                  <Text style={[
                    styles.filterOptionText,
                    sortBy === 'newest' && styles.selectedFilterOptionText
                  ]}>Newest</Text>
                </View>
                {sortBy === 'newest' && (
                  <View style={styles.checkmark}>
                    <SvgXml xml={checkmarkSvg} style={styles.checkmarkIcon} />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.filterOption,
                  sortBy === 'oldest' && styles.selectedFilterOption
                ]}
                onPress={() => handleSortChange('oldest')}
              >
                <View style={styles.filterOptionContent}>
                  <SvgXml xml={oldestIconSvg} style={styles.filterOptionIcon} />
                  <Text style={[
                    styles.filterOptionText,
                    sortBy === 'oldest' && styles.selectedFilterOptionText
                  ]}>Oldest</Text>
                </View>
                {sortBy === 'oldest' && (
                  <View style={styles.checkmark}>
                    <SvgXml xml={checkmarkSvg} style={styles.checkmarkIcon} />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.filterOption,
                  sortBy === 'nearest' && styles.selectedFilterOption
                ]}
                onPress={() => handleSortChange('nearest')}
              >
                <View style={styles.filterOptionContent}>
                  <SvgXml xml={nearestIconSvg} style={styles.filterOptionIcon} />
                  <Text style={[
                    styles.filterOptionText,
                    sortBy === 'nearest' && styles.selectedFilterOptionText
                  ]}>Nearest</Text>
                </View>
                {sortBy === 'nearest' && (
                  <View style={styles.checkmark}>
                    <SvgXml xml={checkmarkSvg} style={styles.checkmarkIcon} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  tooltipContainer: {
    position: 'absolute',
    top: 115,
    right: 16,
    zIndex: 1000,
  },
  tooltipArrow: {
    position: 'absolute',
    top: -8,
    right: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#DBD2DA',
  },
  tooltipContent: {
    backgroundColor: '#DBD2DA',
    borderRadius: 12,
    padding: 12,
    minWidth: 200,
    ...Platform.select({
      android: {
        elevation: 16,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
    }),
  },
  filterOptions: {
    gap: 6,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F0E6F0',
  },
  selectedFilterOption: {
    backgroundColor: '#AC8FA3',
  },
  filterOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterOptionIcon: {
    width: 16,
    height: 16,
  },
  filterOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#666666',
  },
  selectedFilterOptionText: {
    color: '#4B164C',
  },
  checkmark: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4B164C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkIcon: {
    width: 8,
    height: 8,
  },
});

export default MatchFilterTooltip; 
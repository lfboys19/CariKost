import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

export const FilterBadge = ({
  label,
  active = false,
  onPress,
  icon,
  count,
  accessibilityLabel,
  accessibilityHint,
  size = 'medium',
}) => {
  const isInteractive = !!onPress;

  const content = (
    <View
      style={[
        styles.badge,
        styles[`size_${size}`],
        active ? styles.badgeActive : styles.badgeInactive,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={size === 'small' ? 14 : 16}
          color={active ? '#FFFFFF' : Colors.textSecondary}
          style={{ marginRight: 5 }}
        />
      )}
      <Text
        style={[
          styles.text,
          styles[`textSize_${size}`],
          active ? styles.textActive : styles.textInactive,
        ]}
      >
        {label}
      </Text>
      {count !== undefined && count > 0 && (
        <View
          style={[
            styles.countDot,
            active ? styles.countDotActive : styles.countDotInactive,
          ]}
        >
          <Text
            style={[
              styles.countText,
              active ? styles.countTextActive : styles.countTextInactive,
            ]}
          >
            {count}
          </Text>
        </View>
      )}
    </View>
  );

  if (isInteractive) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        accessible={true}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: active }}
        accessibilityLabel={accessibilityLabel || `Filter ${label}`}
        accessibilityHint={accessibilityHint || `Ketuk untuk ${active ? 'menonaktifkan' : 'mengaktifkan'} filter ${label}`}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel || label}
    >
      {content}
    </View>
  );
};

export const GenderBadge = ({ type }) => {
  let bg = Colors.campurLight;
  let text = Colors.campur;
  let label = 'Campur';

  if (type === 'Putri') {
    bg = Colors.putriLight;
    text = Colors.putri;
    label = 'Khusus Putri';
  } else if (type === 'Putra') {
    bg = Colors.putraLight;
    text = Colors.putra;
    label = 'Khusus Putra';
  }

  return (
    <View
      style={[styles.tagContainer, { backgroundColor: bg }]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`Tipe kos ${label}`}
    >
      <Text style={[styles.tagText, { color: text }]}>{label}</Text>
    </View>
  );
};

export const AvailabilityBadge = ({ status, availableRooms }) => {
  const isAvailable = status === 'Tersedia' && (availableRooms === undefined || availableRooms > 0);
  const isLow = isAvailable && availableRooms === 1;

  let bg = Colors.successLight;
  let color = Colors.successDark;
  let label = availableRooms ? `Tersedia (${availableRooms} Kamar)` : 'Tersedia';

  if (!isAvailable) {
    bg = Colors.dangerLight;
    color = Colors.dangerDark;
    label = 'Kamar Penuh';
  } else if (isLow) {
    bg = Colors.warningLight;
    color = '#B45309';
    label = 'Sisa 1 Kamar!';
  }

  return (
    <View
      style={[styles.tagContainer, { backgroundColor: bg }]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`Status ketersediaan: ${label}`}
    >
      <Ionicons
        name={!isAvailable ? 'close-circle' : isLow ? 'flame' : 'checkmark-circle'}
        size={12}
        color={color}
        style={{ marginRight: 3 }}
      />
      <Text style={[styles.tagText, { color, fontWeight: '700' }]}>{label}</Text>
    </View>
  );
};

export const ProConTag = ({ text, type = 'pro' }) => {
  const isPro = type === 'pro';
  return (
    <View
      style={[
        styles.proConBadge,
        isPro ? styles.proBadge : styles.conBadge,
      ]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${isPro ? 'Keunggulan' : 'Catatan/Kekurangan'}: ${text}`}
    >
      <Ionicons
        name={isPro ? 'checkmark-circle' : 'alert-circle'}
        size={14}
        color={isPro ? Colors.successDark : Colors.dangerDark}
        style={{ marginRight: 5, marginTop: 1 }}
      />
      <Text
        style={[
          styles.proConText,
          isPro ? styles.proText : styles.conText,
        ]}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  size_small: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  size_medium: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  badgeInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.border,
  },
  badgeActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  text: {
    fontWeight: '600',
  },
  textSize_small: {
    fontSize: 12,
  },
  textSize_medium: {
    fontSize: 13,
  },
  textInactive: {
    color: Colors.textSecondary,
  },
  textActive: {
    color: '#FFFFFF',
  },
  countDot: {
    marginLeft: 6,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  countDotInactive: {
    backgroundColor: Colors.surface,
  },
  countDotActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
  },
  countTextInactive: {
    color: Colors.textSecondary,
  },
  countTextActive: {
    color: '#FFFFFF',
  },

  // Tags
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Pros & Cons
  proConBadge: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  proBadge: {
    backgroundColor: Colors.successLight,
  },
  conBadge: {
    backgroundColor: Colors.dangerLight,
  },
  proConText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  proText: {
    color: '#065F46',
  },
  conText: {
    color: '#991B1B',
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

export const RatingStars = ({
  rating = 0,
  maxStars = 5,
  size = 16,
  showNumber = false,
  showCount = false,
  count = 0,
  interactive = false,
  onRate,
  color = Colors.secondary,
}) => {
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    let iconName = 'star-outline';
    if (rating >= i) {
      iconName = 'star';
    } else if (rating >= i - 0.5) {
      iconName = 'star-half';
    }

    if (interactive) {
      stars.push(
        <TouchableOpacity
          key={i}
          activeOpacity={0.7}
          onPress={() => onRate && onRate(i)}
          style={{ padding: 2 }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Beri rating ${i} dari ${maxStars} bintang`}
          accessibilityHint={`Ketuk untuk memilih ${i} bintang`}
        >
          <Ionicons name={iconName} size={size} color={color} />
        </TouchableOpacity>
      );
    } else {
      stars.push(
        <Ionicons
          key={i}
          name={iconName}
          size={size}
          color={color}
          style={{ marginRight: 2 }}
        />
      );
    }
  }

  return (
    <View
      style={styles.container}
      accessible={!interactive}
      accessibilityRole="text"
      accessibilityLabel={`Rating ${rating.toFixed(1)} dari ${maxStars} bintang`}
    >
      <View style={styles.starsRow}>{stars}</View>
      {showNumber && (
        <Text style={[styles.ratingNumber, { fontSize: size * 0.9 }]}>
          {rating.toFixed(1)}
        </Text>
      )}
      {showCount && (
        <Text style={[styles.countText, { fontSize: size * 0.8 }]}>
          ({count})
        </Text>
      )}
    </View>
  );
};

export const RatingBreakdownBar = ({ label, score, icon }) => {
  const percentage = Math.min(100, Math.max(0, (score / 5) * 100));

  return (
    <View
      style={styles.breakdownRow}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`Kategori ${label}, skor ${score.toFixed(1)} dari 5`}
    >
      <View style={styles.labelCol}>
        {icon && (
          <Ionicons
            name={icon}
            size={16}
            color={Colors.primary}
            style={{ marginRight: 6 }}
          />
        )}
        <Text style={styles.breakdownLabel}>{label}</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${percentage}%` }]} />
      </View>

      <Text style={styles.scoreText}>{score.toFixed(1)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingNumber: {
    fontWeight: '700',
    color: Colors.textPrimary,
    marginLeft: 5,
  },
  countText: {
    color: Colors.textMuted,
    marginLeft: 4,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  labelCol: {
    width: 105,
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: 4,
  },
  scoreText: {
    width: 28,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'right',
  },
});

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
}) => {
  const getContainerStyle = () => {
    const base = [styles.button, styles[`size_${size}`]];
    if (variant === 'primary') base.push(styles.primary);
    if (variant === 'secondary') base.push(styles.secondary);
    if (variant === 'outline') base.push(styles.outline);
    if (variant === 'ghost') base.push(styles.ghost);
    if (variant === 'danger') base.push(styles.danger);
    if (variant === 'success') base.push(styles.success);
    if (disabled || loading) base.push(styles.disabled);
    return base;
  };

  const getTextStyle = () => {
    const base = [styles.text, styles[`textSize_${size}`]];
    if (variant === 'primary') base.push(styles.primaryText);
    if (variant === 'secondary') base.push(styles.secondaryText);
    if (variant === 'outline') base.push(styles.outlineText);
    if (variant === 'ghost') base.push(styles.ghostText);
    if (variant === 'danger') base.push(styles.dangerText);
    if (variant === 'success') base.push(styles.successText);
    if (disabled) base.push(styles.disabledText);
    return base;
  };

  const iconColor =
    variant === 'primary' || variant === 'danger' || variant === 'success'
      ? Colors.textLight
      : variant === 'secondary'
      ? Colors.textPrimary
      : Colors.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[getContainerStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      accessible={true}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint || `Ketuk untuk ${title}`}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : Colors.primary}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>
              {typeof icon === 'string' ? (
                <Ionicons name={icon} size={size === 'small' ? 16 : 20} color={iconColor} />
              ) : (
                icon
              )}
            </View>
          )}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>
              {typeof icon === 'string' ? (
                <Ionicons name={icon} size={size === 'small' ? 16 : 20} color={iconColor} />
              ) : (
                icon
              )}
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },

  // Sizes
  size_small: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    minHeight: 36,
  },
  size_medium: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    minHeight: 48,
  },
  size_large: {
    paddingVertical: 15,
    paddingHorizontal: 24,
    minHeight: 54,
  },

  // Variants
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.surface,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: Colors.danger,
  },
  success: {
    backgroundColor: Colors.success,
  },
  disabled: {
    backgroundColor: Colors.border,
    borderColor: Colors.border,
    opacity: 0.7,
  },

  // Texts
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  textSize_small: {
    fontSize: 13,
  },
  textSize_medium: {
    fontSize: 15,
  },
  textSize_large: {
    fontSize: 16,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: Colors.textPrimary,
  },
  outlineText: {
    color: Colors.primary,
  },
  ghostText: {
    color: Colors.primary,
  },
  dangerText: {
    color: '#FFFFFF',
  },
  successText: {
    color: '#FFFFFF',
  },
  disabledText: {
    color: Colors.textMuted,
  },
});

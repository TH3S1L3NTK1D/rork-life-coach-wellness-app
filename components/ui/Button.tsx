import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface ButtonProps {
  title: string;
  onPress: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'outline' | 'transparent' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  testID
}) => {
  const { theme } = useTheme();
  
  const getBackgroundColor = () => {
    if (disabled) return 'rgba(0, 0, 0, 0.2)';
    
    switch (variant) {
      case 'primary':
        return theme.primary;
      case 'secondary':
        return theme.secondary;
      case 'outline':
      case 'transparent':
      case 'ghost':
        return 'transparent';
      default:
        return theme.primary;
    }
  };
  
  const getBorderColor = () => {
    if (disabled) return 'rgba(0, 0, 0, 0.1)';
    
    switch (variant) {
      case 'outline':
        return theme.primary;
      case 'transparent':
      case 'ghost':
        return 'transparent';
      default:
        return 'transparent';
    }
  };
  
  const getTextColor = () => {
    if (disabled) return 'rgba(0, 0, 0, 0.4)';
    
    switch (variant) {
      case 'outline':
        return theme.primary;
      case 'transparent':
        return theme.text;
      case 'ghost':
        return theme.textSecondary;
      default:
        return '#FFFFFF';
    }
  };
  
  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 24 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 20 };
    }
  };
  
  const getTextSize = (): TextStyle => {
    switch (size) {
      case 'small':
        return { fontSize: 14 };
      case 'large':
        return { fontSize: 18 };
      default:
        return { fontSize: 16 };
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        getSizeStyles(),
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          opacity: disabled ? 0.7 : 1
        },
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <React.Fragment>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              styles.text,
              getTextSize(),
              { color: getTextColor() },
              textStyle
            ]}
          >
            {title}
          </Text>
        </React.Fragment>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.2
  },
  iconContainer: {
    marginRight: 8
  }
});
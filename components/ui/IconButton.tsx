import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  ViewStyle 
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'transparent';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style
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
        return 'transparent';
      case 'transparent':
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
      default:
        return 'transparent';
    }
  };
  
  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return { width: 32, height: 32 };
      case 'large':
        return { width: 56, height: 56 };
      default:
        return { width: 44, height: 44 };
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
      disabled={disabled}
      activeOpacity={0.8}
    >
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  }
});
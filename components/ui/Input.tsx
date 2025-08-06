import React from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TextInputProps,
  ViewStyle
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  containerStyle,
  ...props
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: theme.text }]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        { 
          borderColor: error ? '#ef4444' : theme.border,
          backgroundColor: theme.background === '#000000' ? '#111827' : theme.background
        }
      ]}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            { 
              color: theme.text,
              paddingLeft: leftIcon ? 8 : 16
            }
          ]}
          placeholderTextColor={theme.textSecondary}
          {...props}
        />
      </View>
      
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
    maxWidth: 400
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden'
  },
  iconContainer: {
    paddingLeft: 16,
    height: '100%',
    justifyContent: 'center'
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 16,
    fontSize: 16
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4
  }
});
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { User, Lock } from 'lucide-react-native';
import { StatusBar } from '@/components/ui/StatusBar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

export default function AuthScreen() {
  const { login, register } = useAuth();
  const { theme } = useTheme();
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  
  const [registerForm, setRegisterForm] = useState({
    username: '',
    password: '',
    name: ''
  });

  const handleLogin = async () => {
    if (!loginForm.username || !loginForm.password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const success = await login(loginForm.username, loginForm.password);
      if (success) {
        router.replace('/(tabs)');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerForm.username || !registerForm.password || !registerForm.name) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const success = await register(registerForm.username, registerForm.name);
      if (success) {
        router.replace('/(tabs)');
      } else {
        setError('Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar time={currentTime} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <View style={[styles.logo, { borderColor: '#d97706' }]}>
            <Text style={styles.logoText}>LC</Text>
          </View>
          <Text style={[styles.appName, { color: theme.text }]}>LifeCoach</Text>
          <Text style={[styles.tagline, { color: theme.textSecondary }]}>
            Your Personal Wellness Journey
          </Text>
          <View style={styles.themeIndicator}>
            <View style={[styles.themeIndicatorDot, { backgroundColor: theme.accent }]} />
            <Text style={[styles.themeIndicatorText, { color: theme.accent }]}>
              {theme.name}
            </Text>
          </View>
        </View>

        {!isRegistering ? (
          <View style={styles.formContainer}>
            <Input
              placeholder="Username"
              value={loginForm.username}
              onChangeText={(text) => setLoginForm({...loginForm, username: text})}
              leftIcon={<User size={18} color={theme.textSecondary} />}
              autoCapitalize="none"
              style={styles.inputField}
            />
            
            <Input
              placeholder="Password"
              value={loginForm.password}
              onChangeText={(text) => setLoginForm({...loginForm, password: text})}
              leftIcon={<Lock size={18} color={theme.textSecondary} />}
              secureTextEntry
              keyboardType="default"
              onSubmitEditing={handleLogin}
              style={styles.inputField}
            />
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              style={styles.button}
            />
            
            <TouchableOpacity
              onPress={() => {
                setIsRegistering(true);
                setError('');
              }}
              style={styles.switchModeButton}
            >
              <Text style={[styles.switchModeText, { color: theme.accent }]}>
                Don't have an account? Create One
              </Text>
            </TouchableOpacity>
            
            <Text style={[styles.demoText, { color: theme.textSecondary }]}>
              Demo: victoria_doe / password123
            </Text>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Input
              placeholder="Full Name"
              value={registerForm.name}
              onChangeText={(text) => setRegisterForm({...registerForm, name: text})}
              leftIcon={<User size={18} color={theme.textSecondary} />}
              style={styles.inputField}
            />
            
            <Input
              placeholder="Username"
              value={registerForm.username}
              onChangeText={(text) => setRegisterForm({...registerForm, username: text})}
              leftIcon={<User size={18} color={theme.textSecondary} />}
              autoCapitalize="none"
              style={styles.inputField}
            />
            
            <Input
              placeholder="Password"
              value={registerForm.password}
              onChangeText={(text) => setRegisterForm({...registerForm, password: text})}
              leftIcon={<Lock size={18} color={theme.textSecondary} />}
              secureTextEntry
              keyboardType="default"
              style={styles.inputField}
            />
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              style={styles.button}
            />
            
            <TouchableOpacity
              onPress={() => {
                setIsRegistering(false);
                setError('');
              }}
              style={styles.switchModeButton}
            >
              <Text style={[styles.switchModeText, { color: theme.accent }]}>
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30
  },
  logo: {
    width: 60,
    height: 60,
    backgroundColor: 'black',
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 8
      }
    })
  },
  logoText: {
    fontSize: 32,
    color: '#fbbf24',
    fontWeight: 'bold'
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4
  },
  tagline: {
    fontSize: 14,
    marginBottom: 4
  },
  themeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  themeIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8
  },
  themeIndicatorText: {
    fontSize: 14
  },
  formContainer: {
    width: '100%',
    maxWidth: 350,
    alignSelf: 'center'
  },
  inputField: {
    height: 45,
    marginBottom: 12
  },
  button: {
    marginTop: 8,
    height: 45,
    borderRadius: 10
  },
  switchModeButton: {
    marginTop: 15,
    alignItems: 'center',
    padding: 10
  },
  switchModeText: {
    fontSize: 14
  },
  demoText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10
  },
  errorText: {
    color: '#ef4444',
    marginVertical: 8,
    textAlign: 'center'
  }
});
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable, Text, TextInput, View, Platform, Image } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export default function SignIn() {
  const [value, setValue] = React.useState({
    email: '',
    password: '',
    error: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleSignInAvailable, setIsGoogleSignInAvailable] = useState(false);

  useEffect(() => {
    checkPlayServices();
  }, []);

  const checkPlayServices = async () => {
    if (Platform.OS === 'android') {
      try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: false });
        setIsGoogleSignInAvailable(true);
      } catch (error: any) {
        if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          setValue((prevValue) => ({ ...prevValue, error: 'Google Play Services are required for Google Sign-In but are not available on this device.' }));
        } else {
          setValue((prevValue) => ({ ...prevValue, error: 'An error occurred checking Google Play Services.' }));
        }
        setIsGoogleSignInAvailable(false);
      }
    } else {
      // On iOS, Play Services are not needed, so assume it's available
      setIsGoogleSignInAvailable(true);
    }
  };
  const resetFields = () => {
    setValue({
      email: '',
      password: '',
      error: ''
    });
  };

  async function signIn() {
    setValue((currentValue) => {
      if (!currentValue.email || !currentValue.password) {
        return { ...currentValue, error: 'Please enter both email and password.' };
      }

      signInWithEmailAndPassword(auth, currentValue.email, currentValue.password)
        .then((userCredential) => {
          if (userCredential.user.emailVerified) {
            router.replace('/(screens)/home');
          } else {
            router.replace('/(auth)/verify-email');
          }
        })
        .catch(() => {
          setValue((prevValue) => ({ ...prevValue, error: 'Invalid email or password. Please try again.' }));
        });

      // Return the current value without changes
      return currentValue;
    });
  }

  async function resetPassword() {
    setValue(currentValue => {
      if (currentValue.email === '') {
        return { ...currentValue, error: 'Please enter your email to reset password' };
      }

      sendPasswordResetEmail(auth, currentValue.email)
        .then(() => {
          setValue({ ...currentValue, error: 'Password reset email sent!' });
        })
        .catch(() => {
          setValue((prevValue) => ({ ...prevValue, error: 'Invalid email. Please try again.' }));
        });

      return currentValue;
    });
  }

  async function signInWithGoogle() {
    if (!isGoogleSignInAvailable) {
      setValue((prevValue) => ({ ...prevValue, error: 'Google Sign-In is not available on this device.' }));
      checkPlayServices(); // Re-check just in case
      return;
    }

    try {
      // Check again right before sign-in attempt
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Get the user info containing the ID token
      const userInfo = await GoogleSignin.signIn();

      // Ensure idToken is present
      if (!userInfo || !userInfo.data || !userInfo.data.idToken) {
        console.error("Google Sign-In Error: ID Token is missing from response. Check webClientId configuration.", userInfo);
        setValue((prevValue) => ({ ...prevValue, error: 'Failed to retrieve Google ID Token. Ensure the webClientId is correctly configured.' }));
        return;
      }

      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(userInfo.data.idToken);

      // Sign-in the user with the credential
      const userCredential = await signInWithCredential(auth, googleCredential);

      if (userCredential.user) {
        router.replace('/(screens)/home');
      } else {
        router.replace('/(auth)/verify-email');
      }

    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled the login flow
        setValue((prevValue) => ({ ...prevValue, error: '' })); // Clear previous errors
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // Operation (e.g. sign in) is in progress already
        setValue((prevValue) => ({ ...prevValue, error: 'Sign-in is already in progress.' }));
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // Play services not available or outdated
        setValue((prevValue) => ({ ...prevValue, error: 'Google Play Services is not available or outdated.' }));
        setIsGoogleSignInAvailable(false);
      } else {
        // Some other error happened
        console.error("Google Sign-In Error:", error);
        setValue((prevValue) => ({ ...prevValue, error: 'An error occurred during Google Sign-In. Please try again.' }));
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      {!!value.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{value.error}</Text>
        </View>
      )}

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={24} color="gray" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={value.email}
            onChangeText={(text) => setValue((prevValue) => ({ ...prevValue, email: text }))}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="key-outline" size={24} color="gray" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={value.password}
            onChangeText={(text) => setValue((prevValue) => ({ ...prevValue, password: text }))}
            secureTextEntry={!showPassword}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="gray"
            />
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [styles.signInButton, pressed && styles.buttonPressed]}
          onPress={signIn}
        >
          {({ pressed }) => (
            <Text style={[styles.buttonText, pressed && styles.textPressed]}>
              Sign in
            </Text>
          )}
        </Pressable>

        <Pressable
          style={styles.resetPasswordButton}
          onPress={resetPassword}
        >
          {({ pressed }) => (
            <Text style={[styles.linkText, pressed && styles.textPressed]}>
              Reset your password
            </Text>
          )}
        </Pressable>

        <Link href="/signup" asChild>
          <Pressable
            style={styles.signUpButton}
            onPress={resetFields}>
            {({ pressed }) => (
              <Text style={[styles.linkText, pressed && styles.textPressed]}>
                Sign up
              </Text>
            )}
          </Pressable>
        </Link>

        <Pressable
          style={({ pressed }) => [
            styles.googleButtonContainer,
            !isGoogleSignInAvailable && styles.disabledButton,
            pressed && isGoogleSignInAvailable && styles.googleButtonPressed
          ]}
          onPress={signInWithGoogle}
          disabled={!isGoogleSignInAvailable}
        >
          {isGoogleSignInAvailable ? (
            <Image 
              source={require('../../assets/images/google-signin.png')} 
              style={styles.googleButtonImage}
              resizeMode="contain"
            />
          ) : (
            <Text style={[
              styles.buttonText,
              styles.disabledButtonText
            ]}>
              Google Sign-In Unavailable
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  errorContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#EF4444',
    borderRadius: 4,
  },
  errorText: {
    color: 'white',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    paddingVertical: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  signInButton: {
    backgroundColor: '#15803D',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonPressed: {
    backgroundColor: '#166534',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  resetPasswordButton: {
    marginTop: 16,
  },
  signUpButton: {
    marginTop: 16,
  },
  linkText: {
    textAlign: 'center',
    color: '#4B5563',
  },
  textPressed: {
    opacity: 0.75,
  },
  googleButtonContainer: {
    marginTop: 16,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    alignSelf: 'center',
    width: '100%',
  },
  googleButtonImage: {
    width: '100%',
    height: 48,
  },
  googleButtonPressed: {
    opacity: 0.8,
    backgroundColor: 'transparent',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
    opacity: 0.7,
  },
  disabledButtonText: {
    color: '#E5E7EB',
  },
});

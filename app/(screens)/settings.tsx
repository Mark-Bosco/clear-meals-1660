import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert, StyleSheet, TextInput, Modal, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { signOut, deleteUser, EmailAuthProvider, reauthenticateWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../contexts/AuthContext';
import { deleteUserData } from '@/backend/firestore';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const Settings = () => {
    const { user } = useAuth();
    const [image, setImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    // Fetch profile image if previously uploaded
    useEffect(() => {
        const fetchProfileImage = async () => {
            if (!user) return;
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                const data = userDoc.data();
                if (data?.profilePictureUrl) {
                    setImage(data.profilePictureUrl);
                }
            } catch (error) {
                // No image found
            }
        };

        fetchProfileImage();
    }, [user]);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permission Denied", "We need camera roll permissions to upload a profile picture.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            if (asset?.uri && user?.uid) {
                const downloadURL = await uploadProfilePicture(user.uid, asset.uri);
                await saveProfileImageUrl(user.uid, downloadURL);
                setImage(downloadURL); //update profile image on change
            }
        }
    };
    async function saveProfileImageUrl(userId: string, downloadUrl: string): Promise<void> {
        try {
          const userRef = doc(db, 'users', userId); // Reference to the user's Firestore document
      
          await updateDoc(userRef, {
            profilePictureUrl: downloadUrl, // Save the URL to Firestore
          });
      
        } catch (error: any) {
          console.error('Failed to save profile picture URL:', error.message || error);
        }
      }
    async function uploadProfilePicture(userId: string, uri: string): Promise<string> {
        try {
            //console.log("user:", user?.uid);
            const response = await fetch(uri);
            const blob = await response.blob();
        
            const filename = `${userId}_${Date.now()}.jpg`; // unique filename
            const storage = getStorage();
            const storageRef = ref(storage, `profile_pictures/${filename}`);
        
            await uploadBytes(storageRef, blob);
            const downloadUrl = await getDownloadURL(storageRef);
            return downloadUrl;
          } catch (error: any) {
            console.error("Upload failed:", JSON.stringify(error, null, 2));
            throw error;
          }
      }

    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [password, setPassword] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleSignOut = async () => {
        try {
            // Check if the user signed in with Google
            const isGoogleUser = user?.providerData.some(
                (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID
            );

            if (isGoogleUser) {
                // Sign out from Google first
                await GoogleSignin.signOut();
            }

            // Then sign out from Firebase
            await signOut(auth);
            router.replace('/(auth)/signin');
        } catch (error) {
            console.error('Error signing out:', error);
            Alert.alert('Error', 'Failed to sign out. Please try again.');
        }
    };

    const reauthenticate = async (password: string) => {
        if (!user || !user.email) return false;

        const credential = EmailAuthProvider.credential(user.email, password);
        try {
            await reauthenticateWithCredential(user, credential);
            return true;
        } catch (error) {
            console.error('Error reauthenticating:', error);
            return false;
        }
    };

    const handleDeleteAccount = async () => {
        if (!user) return;

        setIsDeleting(true);
        try {
            const isGoogleUser = user?.providerData.some(
                (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID
            );

            // Only reauthenticate if it's an email/password user
            if (!isGoogleUser) {
                const isReauthenticated = await reauthenticate(password);
                if (!isReauthenticated) {
                    Alert.alert('Error', 'Failed to reauthenticate. Please check your password and try again.');
                    setIsDeleting(false); // Stop loading indicator
                    return; // Exit early if reauthentication fails
                }
            }

            // Proceed with deletion for both Google and reauthenticated email/password users
            // First, delete the user's Firestore data
            await deleteUserData(user.uid);

            // Then, delete the user account
            await deleteUser(user);

            router.replace('/(auth)/signin');
        } catch (error) {
            console.error('Error deleting account:', error);
            Alert.alert('Error', 'Failed to delete account. Please try again.');
        } finally {
            setPassword("");
            setIsDeleting(false);
            setIsModalVisible(false);
        }
    };

    const confirmDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone and will delete all your data.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: () => {
                        const isGoogleUser = user?.providerData.some(
                            (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID
                        );
                        if (isGoogleUser) {
                            // Skip password modal for Google users
                            handleDeleteAccount();
                        } else {
                            // Show password modal for email/password users
                            setIsModalVisible(true);
                        }
                    },
                    style: 'destructive'
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            {user && (
                <View style={styles.profileContainer}>
                    {uploading ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <Image
                            source={image ? { uri: image } : require('../../assets/images/icon.png')}
                            style={styles.profileImage}
                        />
                    )}
                    <Pressable onPress={pickImage} style={styles.uploadButton}>
                        <Text style={styles.buttonText}>Change Profile Picture</Text>
                    </Pressable>
                </View>
            )}
            {user && user.email && (
                <View style={styles.emailContainer}>
                    <Text style={styles.emailLabel}>Logged in as:</Text>
                    <Text style={styles.emailText}>{user.email}</Text>
                </View>
            )}

            <Pressable onPress={handleSignOut} style={({ pressed }) => [
                styles.button,
                pressed && styles.pressedButton
            ]}>
                <Text style={styles.buttonText}>Log Out</Text>
            </Pressable>

            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    styles.deleteButton,
                    pressed && styles.pressedButton
                ]}
                onPress={confirmDeleteAccount}
                disabled={isDeleting}
            >
                <Text style={styles.buttonText}>
                    {isDeleting ? 'Deleting...' : 'Delete Account'}
                </Text>
            </Pressable>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Enter your password to confirm account deletion:</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Password"
                        />
                        <View style={styles.modalButtons}>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.button,
                                    styles.cancelButton,
                                    pressed && styles.pressedButton
                                ]}
                                onPress={() => {
                                    setIsModalVisible(false);
                                    setPassword('');
                                }}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.button,
                                    styles.deleteButton,
                                    pressed && styles.pressedButton
                                ]}
                                onPress={handleDeleteAccount}
                            >
                                <Text style={styles.buttonText}>Delete</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingBottom: 20,
        paddingHorizontal: 20,
        marginTop: 40,
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
        backgroundColor: '#e5e7eb'
    },
    uploadButton: {
        backgroundColor: '#2563eb',
        padding: 8,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    pressedButton: {
        opacity: .6
    },
    emailContainer: {
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#f3f4f6',
        paddingBottom: 15,
        borderRadius: 10,
        width: '100%',
    },
    emailLabel: {
        fontSize: 16,
        color: '#4b5563',
        marginBottom: 5,
    },
    emailText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
    },
    title: {
        fontSize: 40,
        fontWeight: '800',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#15803D',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    deleteButton: {
        backgroundColor: '#bc2f2f',
    },
    cancelButton: {
        backgroundColor: '#6b7280',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        height: 40,
        width: 200,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        width: '50%'
    },
});

export default Settings;

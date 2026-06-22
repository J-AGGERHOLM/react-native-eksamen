 import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebaseConfig";

// Uploads a selected goal image to Firebase Storage.
export async function uploadGoalImage(uri) {
    // Returns null if no image was selected.
    if (!uri) {
        return null;
    }

    // Fetches the local image file from the device.
    const response = await fetch(uri);

    // Converts the local image file to a blob.
    const blob = await response.blob();

    // Creates a unique file path for the image in Firebase Storage.
    const imageName = `goals/${Date.now()}.jpg`;

    // Creates a Firebase Storage reference for the image.
    const imageRef = ref(storage, imageName);

    // Uploads the image blob to Firebase Storage.
    await uploadBytes(imageRef, blob);

    // Gets the public download URL for the uploaded image.
    const downloadUrl = await getDownloadURL(imageRef);

    // Returns the URL so it can be saved on the goal.
    return downloadUrl;
}

// Opens the user's image library and returns the selected image uri.
export async function pickImage() {
    // Opens the image library and allows the user to crop the image.
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
    });

    // Returns null if the user cancels image selection.
    if (result.canceled) {
        return null;
    }

    // Returns null if no image data was returned.
    if (!result.assets || result.assets.length === 0) {
        return null;
    }

    // Returns the local uri of the selected image.
    return result.assets[0].uri;
}
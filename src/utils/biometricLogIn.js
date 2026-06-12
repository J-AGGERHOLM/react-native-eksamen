//importing everything from the authentication package, so we can use the methods
import * as LocalAuthentication from "expo-local-authentication";

//asynchronous function for logging in with fingerprint:
export async function biometricLogin() {
  //Checks if the device, supports biometric login:
  const hasHardware = await LocalAuthentication.hasHardwareAsync();

  //are fingerprints or faceId registered on the device?
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  //if the device does not support biometrics, the button press on login recieves a message
  //for an alert, that let's the user know that the device does not support that feature
  if (!hasHardware) {
    return {
      success: false,
      message: "This device does not have biometric hardware.",
    };
  }

  //if biometrics are not registered on the device, sends message data to the login page
  //telling the user that they haven't registered their fingerprint on the device.
  if (!isEnrolled) {
    return {
      success: false,
      message: "No fingerprint is set up on this device.",
    };
  }

  //this is where we actuallt open the biometrics scanner
  //it can return JSON, with the parameter success: true/false, depending on
  //how the authentication goes.
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Log in with biometrics",
    // fallbackLabel controlls fallback option.
    // If biometrics fail, the user may use their phone passcode instead
    fallbackLabel: "Use passcode",
  });

  return result;
}

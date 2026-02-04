// Haptic feedback utility for mobile devices
export const haptic = (ms = 20) => {
  if ("vibrate" in navigator) {
    try {
      // Check if vibration is supported and allowed
      navigator.vibrate(ms);
    } catch (error) {
      // Silent fail - haptics not supported
    }
  }
};

// Different haptic patterns
export const hapticLight = () => haptic(10);
export const hapticMedium = () => haptic(25);
export const hapticHeavy = () => haptic(50);
export const hapticSuccess = () => haptic([20, 20, 20]);
export const hapticError = () => haptic([50, 100, 50]);
export const hapticSelect = () => haptic(15);
export const hapticDelete = () => haptic(40);
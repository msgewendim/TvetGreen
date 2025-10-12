import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="language" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="voice-setup" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
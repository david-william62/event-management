import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function ProfileScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Profile' }} />
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-2xl font-bold">Profile Page</Text>
      </View>
    </>
  );
}

/* eslint-disable prettier/prettier */
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomePage from '../views/HomePage'
import TranslateOptionsPage from '../views/TranslateOptionsPage'
import TranslatorPage from '../views/TranslatorPage'
import AboutPage from '../views/AboutPage'
import HelpPage from '../views/HelpPage'
import AboutDetailPage from '../views/AboutDetailPage'
import AboutKeiDetailPage from '../views/AboutKeiDetailPage'
import DayMonthNamePage from '../views/DayMonthNamePage'

export type RootStackParamList = {
  HomePage: any;
  TranslateOptionsPage: any
  DayMonthNamePage: any
  TranslatorPage: any
  AboutPage: any
  HelpPage: any
  AboutDetailPage: any
  AboutKeiDetailPage: any
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="TranslateOptionsPage" component={TranslateOptionsPage} />
      <Stack.Screen name="DayMonthNamePage" component={DayMonthNamePage} />
      <Stack.Screen name="TranslatorPage" component={TranslatorPage} />
      <Stack.Screen name="AboutPage" component={AboutPage} />
      <Stack.Screen name="AboutDetailPage" component={AboutDetailPage} />
      <Stack.Screen name="AboutKeiDetailPage" component={AboutKeiDetailPage} />
      <Stack.Screen name="HelpPage" component={HelpPage} />
    </Stack.Navigator>
  );
};

export default StackNavigator;

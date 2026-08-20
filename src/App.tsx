import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { LanguageSelectScreen } from './screens/LanguageSelectScreen';
import { MenuScreen } from './screens/MenuScreen';
import { CharacterCreationScreen } from './screens/CharacterCreationScreen';
import { CareerHubScreen } from './screens/CareerHubScreen';
import { EventScreen } from './screens/EventScreen';
import { InteractiveMatch } from './components/match/InteractiveMatch';
import { MatchScreen } from './screens/MatchScreen';
import { SeasonSummaryScreen } from './screens/SeasonSummaryScreen';
import { WorldsBracketScreen } from './screens/WorldsBracketScreen';
import { RetirementScreen } from './screens/RetirementScreen';
import { DailyChallengeScreen } from './screens/DailyChallengeScreen';
import { StatToast } from './components/ui/StatToast';

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export default function App() {
  const phase = useGameStore(s => s.phase);
  const notifications = useGameStore(s => s.notifications) || [];

  const renderScreen = () => {
    switch (phase) {
      case 'LANGUAGE_SELECT':    return <LanguageSelectScreen />;
      case 'MENU':               return <MenuScreen />;
      case 'CHARACTER_CREATION': return <CharacterCreationScreen />;
      case 'CAREER_HUB':         return <CareerHubScreen />;
      case 'EVENT':              return <EventScreen />;
      case 'INTERACTIVE_MATCH':  return <InteractiveMatch />;
      case 'MATCH':              return <MatchScreen />;
      case 'SEASON_SUMMARY':     return <SeasonSummaryScreen />;
      case 'PLAYOFF_BRACKET':    return <WorldsBracketScreen />;
      case 'WORLDS_BRACKET':     return <WorldsBracketScreen />;
      case 'INTERNATIONAL':      return <WorldsBracketScreen />;
      case 'RETIREMENT':         return <RetirementScreen />;
      case 'DAILY_CHALLENGE':    return <DailyChallengeScreen />;
      default:                   return <MenuScreen />;
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div key={phase} {...pageTransition} className="min-h-screen">
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      {/* Global Animated Stat & Notification Toasts */}
      <StatToast notifications={notifications} />
    </>
  );
}

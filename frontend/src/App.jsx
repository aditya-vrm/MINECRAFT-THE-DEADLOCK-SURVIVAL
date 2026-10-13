import { useState, useCallback } from 'react';
import MainMenu from './components/menu/MainMenu';
import StoryMode from './components/presentation/StoryMode';
import SurvivalMode from './components/simulator/SurvivalMode';
import ThankYou from './components/menu/ThankYou';
import LoadingScreen from './components/ui/LoadingScreen';
import './index.css';

/**
 * Screen states
 */
const SCREEN = {
  MENU: 'menu',
  LOADING: 'loading',
  STORY: 'story',
  SURVIVAL: 'survival',
  THANKYOU: 'thankyou',
};

const LOADING_MESSAGES = {
  story: 'Loading presentation slides...',
  survival: 'Initializing Banker\'s Algorithm lab...',
  thankyou: 'Opening acknowledgments...',
};

export default function App() {
  const [screen, setScreen] = useState(SCREEN.MENU);
  const [loadingTarget, setLoadingTarget] = useState(null);

  const navigateTo = useCallback((target) => {
    setLoadingTarget(target);
    setScreen(SCREEN.LOADING);
  }, []);

  const onLoadingComplete = useCallback(() => {
    setScreen(loadingTarget);
  }, [loadingTarget]);

  const backToMenu = useCallback(() => {
    setScreen(SCREEN.MENU);
    setLoadingTarget(null);
  }, []);

  return (
    <div id="app-root">
      {/* Loading overlay */}
      {screen === SCREEN.LOADING && (
        <LoadingScreen
          message={LOADING_MESSAGES[loadingTarget] || 'Loading...'}
          onComplete={onLoadingComplete}
        />
      )}

      {/* Main Menu */}
      {screen === SCREEN.MENU && (
        <MainMenu
          onStoryMode={() => navigateTo(SCREEN.STORY)}
          onSurvivalMode={() => navigateTo(SCREEN.SURVIVAL)}
          onThankYou={() => navigateTo(SCREEN.THANKYOU)}
        />
      )}

      {/* Story Mode — The Presentation */}
      {screen === SCREEN.STORY && (
        <StoryMode onBack={backToMenu} />
      )}

      {/* Survival Mode — The Simulator */}
      {screen === SCREEN.SURVIVAL && (
        <SurvivalMode onBack={backToMenu} />
      )}

      {/* Thank You — Cherry Blossom Cinematic */}
      {screen === SCREEN.THANKYOU && (
        <ThankYou onBack={backToMenu} />
      )}
    </div>
  );
}

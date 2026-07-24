import React from 'react';
import { AboutPage } from './AboutPage';

interface LandingPageProps {
  onLaunchApp: () => void;
  onGoToPrivacy?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp, onGoToPrivacy }) => {
  return <AboutPage onLaunchApp={onLaunchApp} onGoToPrivacy={onGoToPrivacy || (() => {})} />;
};

export default LandingPage;

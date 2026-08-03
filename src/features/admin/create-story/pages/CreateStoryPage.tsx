/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCreateStory } from '../hooks/useCreateStory';
import CreatorFlow from '../components/CreatorFlow';

interface CreateStoryPageProps {
  onNavigate?: (view: string) => void;
}

export default function CreateStoryPage({ onNavigate }: CreateStoryPageProps) {
  const formState = useCreateStory();

  const handleGoBack = () => {
    if (onNavigate) {
      onNavigate('archive');
    } else {
      formState.setActiveStep(1);
    }
  };

  return (
    <CreatorFlow
      onGoBack={handleGoBack}
      onNavigate={onNavigate}
      formState={formState}
    />
  );
}

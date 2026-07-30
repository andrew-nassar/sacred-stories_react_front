/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCreateStory } from '../hooks/useCreateStory';
import CreatorFlow from '../components/CreatorFlow';

export default function CreateStoryPage() {
  const formState = useCreateStory();

  return (
    <CreatorFlow
      onGoBack={() => formState.setActiveStep(1)}
      formState={formState}
    />
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthGuard } from '../hooks/useAuthGuard';
import { useCreateStoryForm } from '../hooks/useCreateStoryForm';
import { FORM_STEPS } from '../constants';

// Sections
import { StoryInfoSection } from '../components/StoryInfoSection';
import { BurialPlaceSection } from '../components/BurialPlaceSection';
import { TimelineSection } from '../components/TimelineSection';
import { GallerySection } from '../components/GallerySection';
import { ReviewSection } from '../components/ReviewSection';
import { ConfirmLeaveModal } from '../components/ConfirmLeaveModal';
import { SuccessModal } from '../components/SuccessModal';

// Icons
import {
  Compass,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Loader2,
  AlertCircle,
  ShieldAlert,
  BookOpen,
  MapPin,
  Calendar,
  Image,
  CheckCircle2,
  X
} from 'lucide-react';

export default function CreateStoryPage() {
  const navigate = useNavigate();
  const { isAuthenticated, redirectToLogin } = useAuthGuard();

  const {
    formData,
    updateField,
    updateBurialField,

    // Timeline
    addTimelineItem,
    updateTimelineItem,
    deleteTimelineItem,
    moveTimelineItem,

    // Gallery
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    replaceGalleryImage,

    // Story types & states
    storyTypes,
    isLoadingTypes,
    validationErrors,
    isSubmitting,
    submitError,
    isSuccess,
    isDirty,

    // Navigation
    activeStep,
    setActiveStep,
    goToStep,
    showConfirmLeave,
    setShowConfirmLeave,
    resetForm,
    handleSubmit
  } = useCreateStoryForm();

  // If not authenticated, render login prompt card
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-canvas text-white flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full glass-panel border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-400 mx-auto border border-amber-500/20">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-white">Authentication Required</h2>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Please sign in to your user account to submit a new sacred story to the archival registry.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={redirectToLogin}
              className="w-full py-3 rounded-xl bg-gold-accent text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-gold-accent/90 transition-all cursor-pointer shadow-lg shadow-gold-accent/20"
            >
              Sign In to Continue
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-mono text-xs transition-colors cursor-pointer"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Icon getter helper for step headers
  const getStepIcon = (id: number) => {
    switch (id) {
      case 1:
        return <BookOpen className="w-4 h-4" />;
      case 2:
        return <MapPin className="w-4 h-4" />;
      case 3:
        return <Calendar className="w-4 h-4" />;
      case 4:
        return <Image className="w-4 h-4" />;
      case 5:
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setShowConfirmLeave(true);
    } else {
      navigate('/');
    }
  };

  const handleConfirmDiscard = () => {
    setShowConfirmLeave(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-canvas text-white/90 selection:bg-gold-accent/30 selection:text-white pb-32">
      {/* Top Header */}
      <header className="sticky top-0 z-30 w-full glass-panel bg-[#090b0f]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancelClick}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-gold-accent/40 transition-all cursor-pointer"
            title="Back / Exit"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-1.5 text-gold-accent text-xs font-mono font-semibold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Public Submission Portal</span>
            </div>
            <h1 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
              Submit a Sacred Story
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCancelClick}
            className="hidden sm:inline-flex px-3.5 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-gold-accent text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-gold-accent/90 transition-all cursor-pointer shadow-md shadow-gold-accent/15 disabled:opacity-50 flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <span>Submit Story</span>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Step Navigation Bar */}
        <div className="glass-panel border border-white/10 rounded-2xl p-2 sm:p-3 overflow-x-auto scrollbar-none">
          <div className="flex items-center justify-between min-w-[550px] sm:min-w-0">
            {FORM_STEPS.map((step) => {
              const isActive = activeStep === step.id;
              const isCompleted = activeStep > step.id;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => goToStep(step.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl font-mono text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gold-accent text-black font-bold shadow-md shadow-gold-accent/20'
                      : isCompleted
                      ? 'bg-white/10 text-gold-accent hover:bg-white/15 font-semibold'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      isActive ? 'bg-black text-gold-accent' : isCompleted ? 'bg-gold-accent/20 text-gold-accent' : 'bg-white/10'
                    }`}
                  >
                    {step.id}
                  </span>
                  <span className="truncate">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Submit Error Banner */}
        {submitError && (
          <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm">
              <span className="font-semibold block mb-0.5">Submission Notice</span>
              <p>{submitError}</p>
            </div>
          </div>
        )}

        {/* Step Section Content Card */}
        <div className="glass-panel border border-white/10 rounded-2xl p-5 sm:p-8 space-y-6 shadow-xl">
          {activeStep === 1 && (
            <StoryInfoSection
              formData={formData}
              storyTypes={storyTypes}
              isLoadingTypes={isLoadingTypes}
              errors={validationErrors}
              onChangeField={updateField}
            />
          )}

          {activeStep === 2 && (
            <BurialPlaceSection
              burialPlace={formData.burialPlace}
              errors={validationErrors}
              onChangeBurialField={updateBurialField}
            />
          )}

          {activeStep === 3 && (
            <TimelineSection
              timeline={formData.timeline}
              errors={validationErrors}
              onAddEvent={addTimelineItem}
              onUpdateEvent={updateTimelineItem}
              onDeleteEvent={deleteTimelineItem}
              onMoveEvent={moveTimelineItem}
            />
          )}

          {activeStep === 4 && (
            <GallerySection
              gallery={formData.sacredGallery}
              errors={validationErrors}
              onAddImage={addGalleryItem}
              onUpdateImage={updateGalleryItem}
              onDeleteImage={deleteGalleryItem}
              onReplaceImage={replaceGalleryImage}
            />
          )}

          {activeStep === 5 && (
            <ReviewSection
              formData={formData}
              storyTypes={storyTypes}
              errors={validationErrors}
              onJumpToStep={(step) => setActiveStep(step)}
            />
          )}

          {/* Stepper Footer Controls */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
              disabled={activeStep === 1}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider transition-all disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {activeStep < 5 ? (
              <button
                type="button"
                onClick={() => goToStep(activeStep + 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold-accent text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-gold-accent/90 transition-all cursor-pointer shadow-md shadow-gold-accent/10"
              >
                <span>Next Section</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gold-accent text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-gold-accent/90 transition-all cursor-pointer shadow-lg shadow-gold-accent/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Submit</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Bar for Mobile */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 glass-panel bg-[#090b0f]/95 border-t border-white/10 z-40 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleCancelClick}
          className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white/70 text-xs font-mono uppercase tracking-wider"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 py-2.5 rounded-xl bg-gold-accent text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting</span>
            </>
          ) : (
            <span>Submit Sacred Story</span>
          )}
        </button>
      </div>

      {/* Modals */}
      <ConfirmLeaveModal
        isOpen={showConfirmLeave}
        onConfirmLeave={handleConfirmDiscard}
        onCancel={() => setShowConfirmLeave(false)}
      />

      <SuccessModal
        isOpen={isSuccess}
        onReset={resetForm}
        storyTitle={formData.name}
      />
    </div>
  );
}

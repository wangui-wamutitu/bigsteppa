import { Challenge, ChallengeStatus, CreateChallengeData, UpdateChallengeData } from '@/types';
import { challengeAPI } from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ChallengeState {
  challenges: Challenge[];
  filteredChallenges: Challenge[];
  currentFilter: ChallengeStatus | 'All';
  isLoading: boolean;
  error: string | null;
  
  fetchChallenges: () => Promise<void>;
  getChallenge: (id: string) => Challenge | undefined;
  createChallenge: (data: CreateChallengeData) => Promise<void>;
  updateChallenge: (id: string, data: UpdateChallengeData) => Promise<void>;
  deleteChallenge: (id: string) => Promise<void>;
  pauseChallenge: (id: string) => Promise<void>;
  resumeChallenge: (id: string) => Promise<void>;
  restartChallenge: (id: string) => Promise<void>;
  filterChallenges: (status: ChallengeStatus | 'All') => void;
  clearError: () => void;
}

export const useChallengeStore = create<ChallengeState>()(
  persist(
    (set, get) => ({
      challenges: [],
      filteredChallenges: [],
      currentFilter: 'All',
      isLoading: false,
      error: null,
      
      fetchChallenges: async () => {
        try {
          set({ isLoading: true, error: null });
          const challenges = await challengeAPI.getAllChallenges();
          set({ 
            challenges, 
            filteredChallenges: challenges, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to fetch challenges' 
          });
        }
      },
      
      getChallenge: (id) => {
        return get().challenges.find(challenge => challenge.id === id);
      },
      
      createChallenge: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const newChallenge = await challengeAPI.createChallenge(data);
          set(state => ({ 
            challenges: [...state.challenges, newChallenge],
            filteredChallenges: state.currentFilter === 'All' || newChallenge.status === state.currentFilter 
              ? [...state.filteredChallenges, newChallenge] 
              : state.filteredChallenges,
            isLoading: false 
          }));
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to create challenge' 
          });
        }
      },
      
      updateChallenge: async (id, data) => {
        try {
          set({ isLoading: true, error: null });
          const updatedChallenge = await challengeAPI.updateChallenge(id, data);
          set(state => {
            const updatedChallenges = state.challenges.map(challenge => 
              challenge.id === id ? updatedChallenge : challenge
            );
            
            return { 
              challenges: updatedChallenges,
              filteredChallenges: state.currentFilter === 'All' 
                ? updatedChallenges 
                : updatedChallenges.filter(c => c.status === state.currentFilter),
              isLoading: false 
            };
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to update challenge' 
          });
        }
      },
      
      deleteChallenge: async (id) => {
        try {
          set({ isLoading: true, error: null });
          await challengeAPI.deleteChallenge(id);
          set(state => ({ 
            challenges: state.challenges.filter(challenge => challenge.id !== id),
            filteredChallenges: state.filteredChallenges.filter(challenge => challenge.id !== id),
            isLoading: false 
          }));
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to delete challenge' 
          });
        }
      },
      
      pauseChallenge: async (id) => {
        try {
          set({ isLoading: true, error: null });
          await get().updateChallenge(id, { 
            isPaused: true, 
            status: ChallengeStatus.Stalled 
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to pause challenge' 
          });
        }
      },
      
      resumeChallenge: async (id) => {
        try {
          set({ isLoading: true, error: null });
          await get().updateChallenge(id, { 
            isPaused: false, 
            status: ChallengeStatus.Ongoing 
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to resume challenge' 
          });
        }
      },
      
      restartChallenge: async (id) => {
        try {
          set({ isLoading: true, error: null });
          const challenge = get().getChallenge(id);
          if (!challenge) throw new Error('Challenge not found');
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          await get().updateChallenge(id, {
            startDate: today.toISOString(),
            isPaused: false,
            status: ChallengeStatus.Ongoing
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to restart challenge' 
          });
        }
      },
      
      filterChallenges: (status) => {
        set(state => ({
          currentFilter: status,
          filteredChallenges: status === 'All' 
            ? state.challenges 
            : state.challenges.filter(challenge => challenge.status === status)
        }));
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'challenge-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
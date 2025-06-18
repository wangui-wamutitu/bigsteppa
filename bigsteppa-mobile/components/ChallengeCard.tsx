import { colors } from '@/constants/colors';
import { Challenge, ChallengeStatus } from '@/types';
import { useRouter } from 'expo-router';
import { AlertCircle, Calendar, Clock } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ChallengeCardProps {
  challenge: Challenge;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  const router = useRouter();
  
  const getStatusColor = (status: ChallengeStatus) => {
    switch (status) {
      case ChallengeStatus.SetToHappen:
        return colors.status.upcoming;
      case ChallengeStatus.Ongoing:
        return colors.status.info;
      case ChallengeStatus.Completed:
        return colors.status.success;
      case ChallengeStatus.Stalled:
        return colors.status.paused;
      default:
        return colors.text.tertiary;
    }
  };
  
  const getStatusText = (status: ChallengeStatus) => {
    switch (status) {
      case ChallengeStatus.SetToHappen:
        return 'Upcoming';
      case ChallengeStatus.Ongoing:
        return 'In Progress';
      case ChallengeStatus.Completed:
        return 'Completed';
      case ChallengeStatus.Stalled:
        return 'Paused';
      default:
        return 'Unknown';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  const handlePress = () => {
    router.push(`/challenge/${challenge.id}`);
  };
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{challenge.name}</Text>
        <View 
          style={[
            styles.statusBadge, 
            { backgroundColor: getStatusColor(challenge.status) }
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(challenge.status)}</Text>
        </View>
      </View>
      
      {challenge.description && (
        <Text style={styles.description} numberOfLines={2}>
          {challenge.description}
        </Text>
      )}
      
      <View style={styles.footer}>
        <View style={styles.infoItem}>
          <Calendar size={16} color={colors.text.tertiary} />
          <Text style={styles.infoText}>
            {formatDate(challenge.startDate)}
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Clock size={16} color={colors.text.tertiary} />
          <Text style={styles.infoText}>
            {challenge.durationValue} {challenge.durationUnit.toLowerCase()}
          </Text>
        </View>
        
        {challenge.isPaused && (
          <View style={styles.infoItem}>
            <AlertCircle size={16} color={colors.status.paused} />
            <Text style={[styles.infoText, { color: colors.status.paused }]}>
              Paused
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
});
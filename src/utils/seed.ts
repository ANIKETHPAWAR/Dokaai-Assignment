import {
  groupPreferenceRepository,
  notificationGroupRepository,
  notificationTopicRepository,
  organizationRepository,
  topicPreferenceRepository,
  userRepository,
} from '../container';
import { NotificationChannel } from '../models/notificationTopic';

interface SeedOptions {
  force?: boolean;
}

const now = () => new Date();

const base = <T extends { id: string }>(entity: T) => ({
  ...entity,
  createdAt: now(),
  updatedAt: now(),
});

const defaultTopicChannels = (channels: NotificationChannel[]) => channels;

export const seedDemoData = ({ force = false }: SeedOptions = {}) => {
  if (!force && organizationRepository.findAll().length > 0) {
    return;
  }

  const organizations = [
    base({
      id: 'org-acme',
      name: 'Acme Corp',
      description: 'Enterprise collaboration tools',
      metadata: { tier: 'enterprise' },
    }),
    base({
      id: 'org-zen',
      name: 'Zen Industries',
      description: 'IoT solutions',
      metadata: { tier: 'growth' },
    }),
  ];

  organizationRepository.seed(organizations);

  const users = [
    base({
      id: 'user-alice',
      organizationId: 'org-acme',
      email: 'alice@acme.com',
      phone: '+1234567890',
      timezone: 'America/New_York',
      isActive: true,
      metadata: { role: 'admin' },
    }),
    base({
      id: 'user-bob',
      organizationId: 'org-acme',
      email: 'bob@acme.com',
      phone: '+1234567891',
      timezone: 'Europe/London',
      isActive: true,
      metadata: { role: 'manager' },
    }),
    base({
      id: 'user-carol',
      organizationId: 'org-zen',
      email: 'carol@zen.io',
      phone: '+1987654321',
      timezone: 'Asia/Singapore',
      isActive: true,
      metadata: { role: 'product' },
    }),
  ];

  userRepository.seed(users);

  const groups = [
    base({
      id: 'group-product',
      organizationId: 'org-acme',
      key: 'product-updates',
      name: 'Product Updates',
      description: 'Release notes and roadmap',
      isMandatory: false,
    }),
    base({
      id: 'group-security',
      organizationId: 'org-acme',
      key: 'security-alerts',
      name: 'Security Alerts',
      description: 'Critical security information',
      isMandatory: true,
    }),
    base({
      id: 'group-iot',
      organizationId: 'org-zen',
      key: 'device-health',
      name: 'Device Health',
      description: 'Monitoring and device statuses',
      isMandatory: false,
    }),
  ];

  notificationGroupRepository.seed(groups);

  const topics = [
    base({
      id: 'topic-release',
      organizationId: 'org-acme',
      groupId: 'group-product',
      key: 'release-announcements',
      name: 'Release Announcements',
      description: 'Major release announcements',
      defaultChannels: defaultTopicChannels(['email', 'push']),
      isCritical: false,
    }),
    base({
      id: 'topic-roadmap',
      organizationId: 'org-acme',
      groupId: 'group-product',
      key: 'roadmap-updates',
      name: 'Roadmap Updates',
      description: 'Quarterly roadmap snapshots',
      defaultChannels: defaultTopicChannels(['email']),
      isCritical: false,
    }),
    base({
      id: 'topic-security',
      organizationId: 'org-acme',
      groupId: 'group-security',
      key: 'security-incidents',
      name: 'Security Incidents',
      description: 'Critical incident communication',
      defaultChannels: defaultTopicChannels(['email', 'sms']),
      isCritical: true,
    }),
    base({
      id: 'topic-device-down',
      organizationId: 'org-zen',
      groupId: 'group-iot',
      key: 'device-downtime',
      name: 'Device Downtime',
      description: 'Notifications for device downtime',
      defaultChannels: defaultTopicChannels(['email', 'push']),
      isCritical: true,
    }),
  ];

  notificationTopicRepository.seed(topics);

  const groupPreferences = [
    base({
      id: 'grp-pref-alice-product',
      userId: 'user-alice',
      groupId: 'group-product',
      isEnabled: true,
    }),
    base({
      id: 'grp-pref-bob-product',
      userId: 'user-bob',
      groupId: 'group-product',
      isEnabled: false,
    }),
    base({
      id: 'grp-pref-carol-iot',
      userId: 'user-carol',
      groupId: 'group-iot',
      isEnabled: true,
    }),
  ];

  groupPreferenceRepository.seed(groupPreferences);

  const topicPreferences = [
    base({
      id: 'topic-pref-alice-release-email',
      userId: 'user-alice',
      topicId: 'topic-release',
      channel: 'email',
      isEnabled: true,
    }),
    base({
      id: 'topic-pref-alice-release-push',
      userId: 'user-alice',
      topicId: 'topic-release',
      channel: 'push',
      isEnabled: false,
    }),
    base({
      id: 'topic-pref-bob-roadmap-email',
      userId: 'user-bob',
      topicId: 'topic-roadmap',
      channel: 'email',
      isEnabled: false,
    }),
    base({
      id: 'topic-pref-carol-device-push',
      userId: 'user-carol',
      topicId: 'topic-device-down',
      channel: 'push',
      isEnabled: true,
    }),
  ];

  topicPreferenceRepository.seed(topicPreferences);
};


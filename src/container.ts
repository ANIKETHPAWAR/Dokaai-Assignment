import {
  GroupPreferenceRepository,
  NotificationGroupRepository,
  NotificationTopicRepository,
  OrganizationRepository,
  TopicPreferenceRepository,
  UserRepository,
} from './repositories';

export const organizationRepository = new OrganizationRepository();
export const userRepository = new UserRepository();
export const notificationGroupRepository = new NotificationGroupRepository();
export const notificationTopicRepository = new NotificationTopicRepository();
export const groupPreferenceRepository = new GroupPreferenceRepository();
export const topicPreferenceRepository = new TopicPreferenceRepository();


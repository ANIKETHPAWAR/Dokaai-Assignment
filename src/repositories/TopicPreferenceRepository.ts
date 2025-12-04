import { TopicPreference } from '../models/topicPreference';

import { InMemoryRepository } from './InMemoryRepository';

export class TopicPreferenceRepository extends InMemoryRepository<TopicPreference> {
  findByUserTopicAndChannel(
    userId: string,
    topicId: string,
    channel: TopicPreference['channel'],
  ): TopicPreference | undefined {
    return this.findAll().find(
      (preference) =>
        preference.userId === userId &&
        preference.topicId === topicId &&
        preference.channel === channel,
    );
  }

  findByUser(userId: string): TopicPreference[] {
    return this.findAll().filter((preference) => preference.userId === userId);
  }

  findByTopic(topicId: string): TopicPreference[] {
    return this.findAll().filter((preference) => preference.topicId === topicId);
  }
}


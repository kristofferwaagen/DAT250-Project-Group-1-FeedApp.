const PollManager = require('../services/pollmanager');
const Poll = require('../models/poll');

// Mock RabbitMQ-kanalen
jest.mock('amqplib', () => ({
  connect: jest.fn().mockResolvedValue({
    createChannel: jest.fn().mockResolvedValue({
      assertQueue: jest.fn(),
      sendToQueue: jest.fn(),
    }),
  }),
}));

describe('PollManager Tests', () => {
  let pollManager;

  beforeAll(async () => {
    pollManager = new PollManager();
    await pollManager.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createPoll should save poll and publish to queue', async () => {
    // Mock Poll.save()
    Poll.prototype.save = jest.fn().mockResolvedValue({
      _id: 'mockPollId',
      question: 'Test Poll',
      publishedAt: new Date(),
      validUntil: new Date(),
      voteOptions: ['Option1', 'Option2'],
    });

    const result = await pollManager.createPoll(
      'Test Poll',
      new Date(),
      new Date(),
      ['Option1', 'Option2']
    );

    expect(result).toHaveProperty('_id', 'mockPollId');
    expect(result).toHaveProperty('question', 'Test Poll');
    expect(pollManager.channel.sendToQueue).toHaveBeenCalledTimes(1);
    expect(pollManager.channel.sendToQueue).toHaveBeenCalledWith(
      pollManager.pollQueue,
      expect.any(Buffer),
      { persistent: true }
    );
  });
});

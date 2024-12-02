const PollManager = require("../services/pollmanager");
const Poll = require("../models/poll");
const { synchronizeDatabase } = require("../setup/setup");
const { Client } = require("pg");

// Mock RabbitMQ channel
jest.mock("amqplib", () => ({
  connect: jest.fn().mockResolvedValue({
    createChannel: jest.fn().mockResolvedValue({
      assertQueue: jest.fn(),
      sendToQueue: jest.fn(),
    }),
  }),
}));

// Mock PostgreSQL Client
jest.mock("../setup/setup", () => ({
  synchronizeDatabase: jest.fn(),
}));

describe("PollManager Tests", () => {
  let pollManager;

  beforeAll(async () => {
    pollManager = new PollManager();
    await pollManager.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("createPoll should save poll and publish to queue", async () => {
    // Mock Poll.save()
    Poll.prototype.save = jest.fn().mockResolvedValue({
      _id: "mockPollId",
      question: "Test Poll",
      publishedAt: new Date(),
      validUntil: new Date(),
      voteOptions: ["Option1", "Option2"],
    });

    const result = await pollManager.createPoll(
      "Test Poll",
      new Date(),
      new Date(),
      ["Option1", "Option2"]
    );

    expect(result).toHaveProperty("_id", "mockPollId");
    expect(result).toHaveProperty("question", "Test Poll");
    expect(pollManager.channel.sendToQueue).toHaveBeenCalledTimes(1);
    expect(pollManager.channel.sendToQueue).toHaveBeenCalledWith(
      pollManager.pollQueue,
      expect.any(Buffer),
      { persistent: true }
    );
  });

  test("synchronizeDatabase ensures data in PostgreSQL matches MongoDB", async () => {
    Poll.find = jest.fn().mockResolvedValue([
      {
        _id: "mockPollId",
        question: "Test Poll for Sync",
        publishedAt: new Date("2024-01-01T00:00:00Z"),
        validUntil: new Date("2024-02-01T00:00:00Z"),
        voteOptions: [
          { _id: "option1", caption: "OptionA", voteCount: 1 },
          { _id: "option2", caption: "OptionB", voteCount: 2 },
        ],
      },
    ]);

    await synchronizeDatabase();

    const mockPostgresClient = new Client();
    mockPostgresClient.query = jest.fn();

    const postgresPolls = [
      { id: "mockPollId", question: "Test Poll for Sync" },
    ];
    const postgresVoteOptions = [
      {
        id: "option1",
        poll_id: "mockPollId",
        caption: "OptionA",
        vote_count: 1,
      },
      {
        id: "option2",
        poll_id: "mockPollId",
        caption: "OptionB",
        vote_count: 2,
      },
    ];

    mockPostgresClient.query.mockImplementation((query) => {
      if (query.includes("SELECT * FROM polls")) {
        return { rows: postgresPolls };
      }
      if (query.includes("SELECT * FROM vote_options")) {
        return { rows: postgresVoteOptions };
      }
      return { rows: [] };
    });

    const savedPolls = await mockPostgresClient.query("SELECT * FROM polls");
    expect(savedPolls.rows).toEqual(expect.arrayContaining(postgresPolls));

    const savedVoteOptions = await mockPostgresClient.query(
      "SELECT * FROM vote_options WHERE poll_id = 'mockPollId'"
    );
    expect(savedVoteOptions.rows).toEqual(
      expect.arrayContaining(postgresVoteOptions)
    );
  });
});

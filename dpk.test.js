const crypto = require("crypto");
const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns partitionkey as a string", () => {
    // Test multiple types as input
    const partitionKeys = ["string", 5, true, { key: "value" }, ["array", 1, 2]];

    for (const partitionKey of partitionKeys) {
      const key = deterministicPartitionKey({ partitionKey });
      expect(typeof key).toBe("string");
    }
  });

  it("Returns a hash of the full event object when no partitionkey is provided", () => {
    const mockHashMethods = {
      update: jest.fn().mockReturnThis(), // so digest can be chained on
      digest: jest.fn().mockReturnValueOnce("hashed_output"),
    };

    jest.spyOn(crypto, "createHash").mockImplementationOnce(() => mockHashMethods);

    const event = {
      foo: "bar",
      key: "value",
    };

    const key = deterministicPartitionKey(event);

    expect(mockHashMethods.update).toHaveBeenCalledWith(JSON.stringify(event));
    expect(key).toBe("hashed_output");
  });

  it("Returns a hash when partitionKey exceeds MAX_PARTITION_KEY_LENGTH", () => {
    const MAX_LENGTH = 256 // could optionally be exported from dpk.js
    const HASHED_LENGTH = 128 // length of sha3-512 hex strings

    const validLengthKey = "a".repeat(MAX_LENGTH);
    const invalidLengthKey = "b".repeat(MAX_LENGTH + 1);

    const keyA = deterministicPartitionKey({partitionKey: validLengthKey});
    const keyB = deterministicPartitionKey({partitionKey: invalidLengthKey});

    expect(keyA.length).toBe(MAX_LENGTH);
    expect(keyB.length).toBe(HASHED_LENGTH);
  });
});

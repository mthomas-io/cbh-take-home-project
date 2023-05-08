const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;

  if (!event) {
    return TRIVIAL_PARTITION_KEY;
  }

  let candidate = event?.partitionKey;

  if (!candidate) {
    // Return and use hashed event as partitionKey instead
    const data = JSON.stringify(event);
    return crypto.createHash("sha3-512").update(data).digest("hex");
  }

  if (typeof candidate !== "string") {
    candidate = JSON.stringify(candidate);
  }
  
  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    // Hash the partitionKey to shorten it
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
  }

  return candidate;
};
"use strict";

const basicAuthorizer = async (event, context, callback) => {
  const { type, authorizationToken } = event;
  if (type !== "TOKEN" || !authorizationToken) {
    callback("Unauthorized");
  }

  try {
    const encodedCreds = authorizationToken.split(" ")[1];
    const buffer = Buffer.from(encodedCreds, "base64");
    const creds = buffer.toString("utf-8").split(":");
    const username = creds[0];
    const password = creds[1];

    console.log(`Username: ${username}, password: ${password}`);
    const storedPassword = process.env[username];
    const isCorrectPassword = storedPassword && storedPassword === password;
    const effect = isCorrectPassword ? "Allow" : "Deny";
    const policy = generatePolicy(encodedCreds, event.methodArn, effect);

    callback(null, policy);
  } catch (err) {
    callback(`Unauthorized: ${err.message}`);
  }

  const {} = event;
};

const generatePolicy = (principalId, resource, effect = "Allow") => {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};

module.exports = {
  basicAuthorizer,
};

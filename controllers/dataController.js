const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const documentClient = new AWS.DynamoDB.DocumentClient();

class DataController {

  async getSensorData(req, res) {
    const { id, init, end, variableName } = req.query;
    try {
      const initDate = new Date(init.replace(/\//g, "-"));
      const endDate = new Date(end.replace(/\//g, "-"));
      const initTimestamp = initDate.getTime() / 1000;
      const endTimestamp = endDate.getTime() / 1000;

      const params = {
        TableName: id,
        FilterExpression:
          "#time > :init AND #time < :end AND #variableName = :variableName",
        ExpressionAttributeNames: {
          "#variableName": "variableName",
          "#time": "time",
        },
        ExpressionAttributeValues: {
          ":variableName": variableName,
          ":init": initTimestamp,
          ":end": endTimestamp,
        },
      };
      const data = await documentClient.scan(params).promise();
      res.status(200).json(data.Items);
    } catch (error) {
      console.error("Error fetching data from DynamoDB:", error);
      res.status(500).send("Error fetching data from DynamoDB");
    }
  }

}

module.exports = DataController;

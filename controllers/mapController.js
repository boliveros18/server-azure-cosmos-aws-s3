const AWS = require("aws-sdk");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const axios = require("axios");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const s3Client = new S3Client({ region: process.env.AWS_REGION });
const s3 = new AWS.S3();

class MapController {
  constructor() {
    this.url = "";
  }

  async createBucket(req, res) {
    try {
      const { id } = req.body;
      const params = {
        Bucket: id.toLowerCase(),
      };
      await s3.createBucket(params).promise();
      res.status(200).json({ message: "Bucket created successfully" });
    } catch (error) {
      console.error("Error creating a bucket in parcels:", error);
      res.status(500).send("Error creating a bucket in parcels");
    }
  }

  async getMapsByParcelId(req, res) {
    const parcel_id = req.body.parcel_id;
    const flight_id = req.body.flight_id;
    const index = req.body.index;
    try {
      const command = new GetObjectCommand({
        Bucket: parcel_id.toLowerCase(),
        Key: `${flight_id}/${index}.png`,
      });
      const url = await getSignedUrl(s3Client, command);
      this.url= url;
      res.status(200).json({ url });
    } catch (error) {
      if (error.Code !== "NoSuchKey") {
        console.error("Error fetching the maps:", error);
        res.status(500).send("Error fetching the maps");
      }
    }
  }

  async getMap(req, res) {
    try {
      const response = await axios.get(this.url, { responseType: "stream" });
      response.data.pipe(res);
    } catch (err) {
      console.error("Error requesting map:", err);
    }
  }

  async getCoordinates(req, res) {
    const parcel_id = req.body.parcel_id;
    const flight_id = req.body.flight_id;

    const params = {
      Bucket: parcel_id.toLowerCase(),
      Key: `${flight_id}/metadata.json`,
    };

    try {
      const data = await s3Client.send(new GetObjectCommand(params));
      const fileStream = data.Body;
      let chunks = [];
      fileStream.on("data", (chunk) => {
        chunks.push(chunk);
      });
      fileStream.on("end", () => {
        const fileBuffer = Buffer.concat(chunks);
        const metadata = JSON.parse(fileBuffer.toString());
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(metadata);
      });
    } catch (error) {
      if (error.Code !== "NoSuchKey") {
        console.error("Error fetching the maps:", error);
        res.status(500).send("Error fetching the maps");
      }
    }
  }

  async getBarColorMaps(req, res) {
    const params = {
      Bucket: process.env.AWS_COLORBAR_BUCKET_NAME,
      Key: "GNDVI_Colorbar.png",
    };
    try {
      const data = await s3Client.send(new GetObjectCommand(params));
      const fileStream = data.Body;
      let chunks = [];
      fileStream.on("data", (chunk) => {
        chunks.push(chunk);
      });
      fileStream.on("end", () => {
        const fileBuffer = Buffer.concat(chunks);
        res.setHeader("Content-Type", "image/png");
        res.status(200).send(fileBuffer);
      });
    } catch (error) {
      console.error("Error fetching the bar color map:", error);
      res.status(500).send("Error fetching the the bar color map");
    }
  }

  async uploadMaps(req, res) {
    try {
      const flight = JSON.parse(req.body.payload);
      const files = req.files;
      for (const file of files) {
        const params = {
          Bucket: flight.grand_parent_id.toLowerCase(),
          Key: `${flight.id}/${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype,
        };
        try {
          await s3.upload(params).promise();
        } catch (error) {
          console.error("Error uploading to S3:", error);
          res.status(500).send("Error uploading the maps");
          return;
        }
      }
      res.status(200).json({ message: "Files uploaded successfully" });
    } catch (error) {
      console.error("Error processing uploadMaps:", error);
      res.status(500).send("Error processing the maps");
    }
  }
}

module.exports = MapController;

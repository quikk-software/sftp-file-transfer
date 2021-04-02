import { IncomingForm } from "formidable";
import fs from "fs";
import { Client } from "ssh2";
require("dotenv").config();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const { method } = req;
  switch (req.method) {
    case "POST":
      try {
        const data = await new Promise((resolve, reject) => {
          const form = new IncomingForm();

          form.parse(req, (err, fields, files) => {
            if (err) return reject(err);
            resolve({ fields, files });
          });
        });

        var conn = new Client();
        conn
          .on("ready", function () {
            conn.sftp(function (err, sftp) {
              if (err) throw err;

              var readStream = fs.createReadStream(data?.files?.file?.path);
              var writeStream = sftp.createWriteStream(`/testFile.txt`);
              writeStream.on("close", () => {
                console.log("- file transferred succesfully");
                conn.end();
                res.status(200).json({
                  message: "file transfer successful",
                });
              });

              writeStream.on("end", () => {
                console.log("sftp connection closed");
                conn.end();
              });

              readStream.pipe(writeStream);
            });
          })
          .connect({
            host: process.env.HOST,
            port: 22,
            username: process.env.USERNAME,
            password: process.env.PASSWORD,
          });
      } catch (error) {
        console.log(error);
        res.status(409).json({
          error,
        });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).send(`Method ${method} Not Allowed`);
      break;
  }
};

import mongoose from "mongoose";
import dbConfig from "../../../utils/dbConfig";
import Code from "../../../models/Code";

dbConfig();

export default async (request, response) => {
  const { method } = request;

  switch (method) {
    case "GET":
      try {
        const data = await Code.find({});
        response.status(200).json({ success: true, data });
      } catch (err) {
        console.log(err);
        response.status(500).json({ success: false, err });
      }
      break;

    case "POST":
      try {
        const data = await Code.create(request.body);
        response.status(200).json({ success: true, data });
      } catch (error) {
        response.status(400).json({ success: false });
      }
      break;

    case "PUT":
      try {
        console.log(request.body);
        const data = await Code.findOneAndUpdate(
          { _id: request.body.id },
          { content: request.body.content },
          { new: true }
        );
        console.log("updated-->", data);
        response.status(200).json({ success: true, data });
      } catch (error) {
        response.status(400).json({ success: false });
      }
      break;
    default:
      response.status(400).json({ success: false });
      break;
  }
};

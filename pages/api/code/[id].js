import dbConfig from "../../../utils/dbConfig";
import Code from "../../../models/Code";

dbConfig();

export default async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const content = await Code.findById({ _id: id });
        if (!content) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: content });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};

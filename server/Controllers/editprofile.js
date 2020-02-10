import UserModel from "../Schemas/User";
import MovieCommentModel from "../Schemas/Movie";

const editUserInfo = async (req, res) => {
  const id = req.body.userId;
  console.log("LLLLDSDLSFLSLDSLFSDFDLLSLfdsKFSDKFDS", req.body);
  try {
    const userInfo = await UserModel.findByIdAndUpdate(id, req.body, {
      runValidators: true
    });
    if (userInfo !== null) res.status(200).send();
  } catch (e) {
    console.error(e);
    res.status(500);
  }
};

export default { editUserInfo };

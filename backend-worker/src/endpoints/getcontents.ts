import { Context } from "hono";
import { DeepRAGProfile, ContentWithImage } from "../../types/workertypes";
import { communityContentPoolService } from "../../services/communityContentPoolService";

const getContents = async (c: Context) => {
  try {
    const communityContent =
      await communityContentPoolService.fetch20CommunityContent(c);
    return c.json({
      statuscode: 200,
      communityContent: communityContent,
    });
  } catch (error) {
    console.error(`Error in getContentsEndPoint: ${error}`);
    return c.json({
      statuscode: 500,
      message: "Internal Server Error while fetching community content"
    });
  }
};

export default getContents;
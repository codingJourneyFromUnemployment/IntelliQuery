import { Context } from "hono";
import { DeepRAGProfile, ContentWithImage } from "../types/workertypes";
import { D1services } from "./D1services";

export const communityContentPoolService = {
  async fetch20CommunityContent(c: Context): Promise<ContentWithImage[]> {
    try {
      const communityContent = await D1services.fetch20DeepRAGProfiles(c);
    const contentArry = communityContent.map((deepRAGProfileString: string) => {
      console.log(deepRAGProfileString);
      const deepRAGProfileObj = JSON.parse(
        deepRAGProfileString
      ) as DeepRAGProfile;

      if (deepRAGProfileObj.content) {
        const content = deepRAGProfileObj.content;

        //extract img_url from content

        const imgMatch = content.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
        const img = imgMatch ? imgMatch[1] : "";

        const contentWithImage: ContentWithImage = {
          content,
          img,
        };

        return contentWithImage;
      } else {
        return "";
      }
    });
    return contentArry;
  } catch (error) {
      console.error(
        `Error in communityContentPoolService.fetch20CommunityContent: ${error}`
      );
      throw new Error("Error in communityContentPoolService.fetch20CommunityContent");
    }
  }
};

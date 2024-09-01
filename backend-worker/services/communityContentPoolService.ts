import { Context } from "hono";
import { DeepRAGProfile, ContentWithImage } from "../types/workertypes";
import { D1services } from "./D1services";

export const communityContentPoolService = {
  async fetch20CommunityContent(c: Context): Promise<ContentWithImage[]> {
    try {
      const communityContent = await D1services.fetch20DeepRAGProfiles(c);
      const contentArray = communityContent
        .map((deepRAGProfile: any) => {
          console.log("Raw deepRAGProfile:", deepRAGProfile);

          let deepRAGProfileObj: DeepRAGProfile;

          if (typeof deepRAGProfile === "string") {
            try {
              deepRAGProfileObj = JSON.parse(deepRAGProfile);
            } catch (parseError) {
              console.error("Failed to parse string:", parseError);
              return null;
            }
          } else if (
            typeof deepRAGProfile === "object" &&
            deepRAGProfile !== null
          ) {
            deepRAGProfileObj = deepRAGProfile;
          } else {
            console.error("Unexpected data type:", typeof deepRAGProfile);
            return null;
          }

          if (deepRAGProfileObj.content) {
            const content = deepRAGProfileObj.content;
            const imgMatch = content.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
            const img = imgMatch ? imgMatch[1] : "";

            const contentWithImage: ContentWithImage = {
              content,
              img,
            };

            return contentWithImage;
          } else {
            return null;
          }
        })
        .filter((item: ContentWithImage) => item !== null);

      return contentArray;
    } catch (error) {
      console.error(
        `Error in communityContentPoolService.fetch20CommunityContent: ${error}`
      );
      throw new Error(
        "Error in communityContentPoolService.fetch20CommunityContent"
      );
    }
  },
};

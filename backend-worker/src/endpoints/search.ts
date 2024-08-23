import { Query } from "../../types/workertypes";

const searchMainEndpoint = async (req: Request) => {
  try {
    const query: Query = await req.json();
    const searchContent = query.content;

    return Response.json({
      data: `Searching for ${searchContent}`,
    });
  } catch (error) {
    console.error(`Error in searchMainEndpoint: ${error}`);
    return Response.json({error: "Error in searchMainEndpoint"}, { status: 500 });  
  }
}

export default searchMainEndpoint;
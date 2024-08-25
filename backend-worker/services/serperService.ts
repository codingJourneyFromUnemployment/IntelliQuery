import { Bindings } from "../types/workertypes";
import { Query, SerperResult } from "../types/workertypes";
import { Context } from "hono";

export const serperService = {
  async serperFetch(query: Query, c: Context): Promise<Response> {
    const serper_api_key = c.env.SERPER_API_KEY;
    if (!query || !serper_api_key) {
      throw new Error("Missing query or serper api key");
    }

    try {
      const myHeaders = new Headers();
      myHeaders.append("X-API-KEY", serper_api_key);
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        q: query.content,
        num: 10,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "https://google.serper.dev/search",
        requestOptions
      );

      return response;
    } catch (error) {
      console.error(`Error in serperFetch: ${error}`);
      return c.json({ error: "Error in serperFetch" }, 500);
    }
  },
};







// var myHeaders = new Headers();
// myHeaders.append("X-API-KEY", "57a4c8412974b9625818688d8b02c553187da614");
// myHeaders.append("Content-Type", "application/json");

// var raw = JSON.stringify({
//   q: "apple inc",
// });

// var requestOptions = {
//   method: "POST",
//   headers: myHeaders,
//   body: raw,
//   redirect: "follow",
// };

// fetch("https://google.serper.dev/search", requestOptions)
//   .then((response) => response.text())
//   .then((result) => console.log(result))
//   .catch((error) => console.log("error", error));

// {
//   "searchParameters": {
//     "q": "hello",
//     "type": "search",
//     "engine": "google"
//   },
//   "organic": [
//     {
//       "title": "Hello Products",
//       "link": "https://www.hello-products.com/?srsltid=AfmBOoqkiA44vaOU74w574dqzaZGjgKievUQTdY8NNHVYJobqXeESuKU",
//       "snippet": "naturally friendly products for naturally friendly people. vegan, cruelty free, and thoughtfully formulated for everyone.",
//       "position": 1
//     },
//     {
//       "title": "Lionel Richie - Hello (Official Music Video) - YouTube",
//       "link": "https://www.youtube.com/watch?v=mHONNcZbwDY",
//       "snippet": "REMASTERED IN HD! Explore the music of Lionel Richie: https://lnk.to/LionelBestOf Watch more ...",
//       "date": "Nov 20, 2020",
//       "attributes": {
//         "Duration": "5:27",
//         "Posted": "Nov 20, 2020"
//       },
//       "imageUrl": "https://i.ytimg.com/vi/mHONNcZbwDY/default.jpg?sqp=-oaymwEECHgQQw&rs=AMzJL3moJ63G9S5AWihHwEcoMKFOclYG-Q",
//       "position": 2
//     },
//     {
//       "title": "HELLO! US Edition - Latest news and Photos",
//       "link": "https://www.hellomagazine.com/us/",
//       "snippet": "HELLO! US edition brings you the latest celebrity & royal news from the US & around the world, magazine exclusives, celeb babies, weddings, pregnancies and ...",
//       "sitelinks": [
//         {
//           "title": "HELLO! Canada",
//           "link": "https://www.hellomagazine.com/ca/"
//         },
//         {
//           "title": "British Royal Family News",
//           "link": "https://www.hellomagazine.com/tags/british-royals/"
//         },
//         {
//           "title": "Hello Happiness",
//           "link": "https://www.hellomagazine.com/us/hello-happiness/"
//         },
//         {
//           "title": "Royalty",
//           "link": "https://www.hellomagazine.com/royalty/"
//         }
//       ],
//       "position": 3
//     },
//     {
//       "title": "HelloFresh®: 10 Free Meals - Free Breakfast For Life",
//       "link": "https://www.hellofresh.com/",
//       "snippet": "Enjoy Free Breakfast for Life with America's #1 Meal Kit Delivery Service! 10 Free Meals Offer is for new subscriptions only across 7 boxes and varies by ...",
//       "position": 4
//     },
//     {
//       "title": "Hello! - Super Simple Songs",
//       "link": "https://supersimple.com/song/hello/",
//       "snippet": "Hello! ... Start off your lesson with “Hello!”, a fun and energetic song to talk about how you feel as you greet each other.",
//       "position": 5
//     },
//     {
//       "title": "Hello Alice: Power your path to profits",
//       "link": "https://helloalice.com/",
//       "snippet": "Join 1.4 million businesses finding focus. Step into Wonderland, the world's most connected community of healthy and growing businesses.",
//       "sitelinks": [
//         {
//           "title": "About",
//           "link": "https://helloalice.com/about/"
//         },
//         {
//           "title": "Hello Alice Support",
//           "link": "https://support.helloalice.com/"
//         },
//         {
//           "title": "Funding",
//           "link": "https://helloalice.com/funding/"
//         },
//         {
//           "title": "Partnerships",
//           "link": "https://helloalice.com/partnerships/"
//         }
//       ],
//       "position": 6
//     },
//     {
//       "title": "Hello - Wikipedia",
//       "link": "https://en.wikipedia.org/wiki/hello",
//       "snippet": "Hello is a salutation or greeting in the English language. It is first attested in writing from 1826. The greeting \"Hello\" became associated with telephones ...",
//       "sitelinks": [
//         {
//           "title": "Hello (disambiguation)",
//           "link": "https://en.wikipedia.org/wiki/Hello_(disambiguation)"
//         },
//         {
//           "title": "Hello Girls",
//           "link": "https://en.wikipedia.org/wiki/Hello_Girls"
//         },
//         {
//           "title": "World Hello Day",
//           "link": "https://en.wikipedia.org/wiki/World_Hello_Day"
//         },
//         {
//           "title": "\"Hello, World!\" program",
//           "link": "https://en.wikipedia.org/wiki/%22Hello,_World!%22_program"
//         }
//       ],
//       "position": 7
//     },
//     {
//       "title": "Hello - YouTube",
//       "link": "https://www.youtube.com/watch?v=yjo_aXygRDI",
//       "snippet": "Provided to YouTube by Beggars Group Digital Ltd. Hello · Adele 25 ℗ 2015 XL Recordings Ltd ...",
//       "date": "Dec 15, 2020",
//       "attributes": {
//         "Duration": "4:56",
//         "Posted": "Dec 15, 2020"
//       },
//       "imageUrl": "https://i.ytimg.com/vi/yjo_aXygRDI/default.jpg?sqp=-oaymwEECHgQQw&rs=AMzJL3nNdbZnT1c712wp2dD-I2HXE1eLmQ",
//       "position": 8
//     }
//   ],
//   "images": [
//     {
//       "title": "Hello! | Kids Greeting Song and Feelings Song | Super Simple Songs ...",
//       "imageUrl": "https://i.ytimg.com/vi/tVlcKp3bWH8/sddefault.jpg",
//       "link": "https://www.youtube.com/watch?v=tVlcKp3bWH8"
//     },
//     {
//       "title": "hello 2.0 — Basic Apple Guy",
//       "imageUrl": "https://basicappleguy.com/s/HelloLight_Mac.png",
//       "link": "https://basicappleguy.com/basicappleblog/hello-20"
//     },
//     {
//       "title": "Highlights Hello Magazine | Highlights for Children",
//       "imageUrl": "https://shop.highlights.com/media/catalog/product/f/y/fy25-hho-main.jpg?optimize=low&fit=bounds&height=700&width=700",
//       "link": "https://shop.highlights.com/hello-magazines-subscription"
//     },
//     {
//       "title": "Hello (Lionel Richie song) - Wikipedia",
//       "imageUrl": "https://upload.wikimedia.org/wikipedia/en/9/9e/Lionel_Richie_Hello.jpg",
//       "link": "https://en.wikipedia.org/wiki/Hello_(Lionel_Richie_song)"
//     },
//     {
//       "title": "Cute word 'Hello' Cartoon style, Vector illustration. 25894618 ...",
//       "imageUrl": "https://static.vecteezy.com/system/resources/previews/025/894/618/original/cute-word-hello-cartoon-style-illustration-vector.jpg",
//       "link": "https://www.vecteezy.com/vector-art/25894618-cute-word-hello-cartoon-style-vector-illustration"
//     },
//     {
//       "title": "Hello SVG, Hello PNG, Hellow DXF , Hello Cut File, Hand Lettered ...",
//       "imageUrl": "https://i.etsystatic.com/29488153/r/il/e0f22b/3860244894/il_fullxfull.3860244894_p9az.jpg",
//       "link": "https://www.etsy.com/listing/1215176242/hello-svg-hello-png-hellow-dxf-hello-cut"
//     },
//     {
//       "title": "Lionel Richie - Hello (Official Music Video) - YouTube",
//       "imageUrl": "https://i.ytimg.com/vi/n7joG_r0hAA/oar2.jpg?sqp=-oaymwEiCNgEENAFSFqQAgHyq4qpAxEIARUAAAAAJQAAyEI9AICiQw==&rs=AOn4CLB9y4PhqCqBaRDkJtqV0fh1oK9dPw",
//       "link": "https://www.youtube.com/watch?v=mHONNcZbwDY"
//     },
//     {
//       "title": "Hello Sign Hello Wood Sign Hello Script Wood Sign Wooden Hello ...",
//       "imageUrl": "https://i.etsystatic.com/9632128/r/il/f40bbd/1169402613/il_570xN.1169402613_lpua.jpg",
//       "link": "https://www.etsy.com/listing/268917859/hello-sign-hello-wood-sign-hello-script"
//     },
//     {
//       "title": "HELLO! (@hellomag) / X",
//       "imageUrl": "https://pbs.twimg.com/profile_images/1574379327273287680/FzXHSyku_400x400.jpg",
//       "link": "https://twitter.com/hellomag"
//     }
//   ],
//   "peopleAlsoAsk": [
//     {
//       "question": "What is the literal meaning of hello?",
//       "snippet": "Hello is a salutation or greeting commonly used to begin conversations or telephone calls. Hello has been used as an English greeting since the 19th century. Most agree that it is related to the older French exclamation “Holà” — which means essentially “Ho there!” — like you might say to a horse to tell it to stop.",
//       "title": "Hello - Definition, Meaning & Synonyms - Vocabulary.com",
//       "link": "https://www.vocabulary.com/dictionary/hello"
//     },
//     {
//       "question": "When did people start saying hello?",
//       "snippet": "In fact, the first published use of \"hello\" was in 1827, and it was mainly used to attract attention or express surprise. It wasn't until the telephone arrived that hello became hi. Thomas Edison is credited with putting hello into common usage, and he urged people who used his phone to say it when they answered.",
//       "title": "The Surprising History of \"Hello\": Origins and Evolution of the Greeting",
//       "link": "https://eternitymarketing.com/blog/the-surprising-history-of-hello-origins-and-evolution-of-the-greeting"
//     },
//     {
//       "question": "Why is hello popular?",
//       "snippet": "Thomas Edison himself claimed to have initiated the use of hello upon receiving a phone call—which required people to address an unseen and unknown person. It was simpler and more efficient than some other greetings used in the early days of the telephone, such as “Do I get you?” and “Are you there?”",
//       "title": "Where does 'hello' come from? - Merriam-Webster",
//       "link": "https://www.merriam-webster.com/wordplay/the-origin-of-hello"
//     },
//     {
//       "question": "What is hello word?",
//       "snippet": ": an expression or gesture of greeting. used interjectionally in greeting, in answering the telephone, or to express surprise.",
//       "title": "Hello Definition & Meaning - Merriam-Webster",
//       "link": "https://www.merriam-webster.com/dictionary/hello"
//     }
//   ],
//   "relatedSearches": [
//     {
//       "query": "Hello Song"
//     },
//     {
//       "query": "Hello Google"
//     },
//     {
//       "query": "Hello pronunciation"
//     },
//     {
//       "query": "Hello Hi"
//     },
//     {
//       "query": "Adele #Hello videos"
//     },
//     {
//       "query": "Hello song lyrics"
//     },
//     {
//       "query": "Hello products"
//     },
//     {
//       "query": "HELLO magazine"
//     }
//   ]
// }
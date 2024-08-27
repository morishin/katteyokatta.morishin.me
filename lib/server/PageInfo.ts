import { Window } from "happy-dom";
import { asinFromUrl } from "~/lib/server/asin";

type PageInfo = {
  asin: string;
  name: string;
  image: string | null;
};

const PageInfo = {
  fetch: async (url: string) => {
    const asin = asinFromUrl(url);
    if (!asin) {
      throw new Error("Invalid URL");
    }

    const html = await fetch(url, { headers: { Accept: "text/html" } }).then(
      (res) => res.text()
    );

    const happyDOMWindow = new Window({
      url,
      settings: {
        disableComputedStyleRendering: true,
        disableCSSFileLoading: true,
        disableJavaScriptEvaluation: true,
        disableJavaScriptFileLoading: true,
      },
    });
    happyDOMWindow.document.write(html);

    const name =
      happyDOMWindow.document
        .querySelector("#productTitle")
        ?.textContent.trim() ??
      happyDOMWindow.document.title.split("|")[1]?.trim() ??
      "";
    const image =
      happyDOMWindow.document
        .querySelector("#landingImage")
        ?.getAttribute("src") ?? null;

    await happyDOMWindow.happyDOM.close();

    return {
      asin,
      name,
      image,
    };
  },
};

export { PageInfo };

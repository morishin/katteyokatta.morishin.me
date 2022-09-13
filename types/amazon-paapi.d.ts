declare module "amazon-paapi" {
  export type AmazonCommonParameters = {
    /** Api access key */
    AccessKey: string;
    /** Api secret key */
    SecretKey: string;
    /** Partner ID (eg: yourtag-20) */
    PartnerTag?: string;
    /**
     * Marketplace url.
     * Default value is US. Note: Host and Region are predetermined based on the marketplace value.
     * There is no need for you to add Host and Region as soon as you specify the correct Marketplace value.
     * If your region is not US or .com, please make sure you add the correct Marketplace value.
     */
    Marketplace: AmazonMarketplace;
  } & {
    /** Default value is Associates. */
    PartnerType: "Associates";
    /** Partner ID (eg: yourtag-20) */
    PartnerTag: string;
  };

  export type AmazonMarketplace =
    | "www.amazon.com" // US (default)
    | "www.amazon.com.au" // Australia
    | "www.amazon.com.br" // Brazil
    | "www.amazon.ca" // Canada
    | "www.amazon.eg" // Egypt
    | "www.amazon.fr" // France
    | "www.amazon.de" // Germany
    | "www.amazon.in" // India
    | "www.amazon.it" // Italy
    | "www.amazon.co.jp" // Japan
    | "www.amazon.com.mx" // Mexico
    | "www.amazon.nl" // Netherlands
    | "www.amazon.pl" // Poland
    | "www.amazon.sg" // Singapore
    | "www.amazon.sa" // Saudi Arabia
    | "www.amazon.es" // Spain
    | "www.amazon.se" // Sweden
    | "www.amazon.com.tr" // Turkey
    | "www.amazon.ae" // United Arab Emirates
    | "www.amazon.co.uk"; // United Kingdom

  export type AmazonMerchant = "All" | "Amazon";

  export type AmazonItemCondition =
    | "Any"
    | "New"
    | "Used"
    | "Collectible"
    | "Refurbished";

  export type AmazonCurrency =
    | "USD"
    | "EUR"
    | "GBP"
    | "AUD"
    | "BRL"
    | "CAD"
    | "EGP"
    | "INR"
    | "JPY"
    | "MXN"
    | "PLN"
    | "SGD"
    | "SAR"
    | "SEK"
    | "TRY"
    | "AED";

  export type AmazonAvailability = "Available" | "IncludeOutOfStock";

  export type AmazonDeliveryType =
    | "AmazonGlobal"
    | "FreeShipping"
    | "FulfilledByAmazon"
    | "Prime";

  export type AmazonSearchSortBy =
    | "AvgCustomerReviews"
    | "Featured"
    | "NewestArrivals"
    | "Price:HighToLow"
    | "Price:LowToHigh"
    | "Relevance";

  export type BrowseNodesResourceType =
    | "BrowseNodes.Ancestor"
    | "BrowseNodes.Children";

  export type ItemsResourceType =
    | "BrowseNodeInfo.BrowseNodes"
    | "BrowseNodeInfo.BrowseNodes.Ancestor"
    | "BrowseNodeInfo.BrowseNodes.SalesRank"
    | "BrowseNodeInfo.WebsiteSalesRank"
    | "Images.Primary.Small"
    | "Images.Primary.Medium"
    | "Images.Primary.Large"
    | "Images.Variants.Small"
    | "Images.Variants.Medium"
    | "Images.Variants.Large"
    | "ItemInfo.ByLineInfo"
    | "ItemInfo.Classifications"
    | "ItemInfo.ContentInfo"
    | "ItemInfo.ContentRating"
    | "ItemInfo.ExternalIds"
    | "ItemInfo.Features"
    | "ItemInfo.ManufactureInfo"
    | "ItemInfo.ProductInfo"
    | "ItemInfo.TechnicalInfo"
    | "ItemInfo.Title"
    | "ItemInfo.TradeInInfo"
    | "Offers.Listings.Availability.MaxOrderQuantity"
    | "Offers.Listings.Availability.Message"
    | "Offers.Listings.Availability.MinOrderQuantity"
    | "Offers.Listings.Availability.Type"
    | "Offers.Listings.Condition"
    | "Offers.Listings.Condition.ConditionNote"
    | "Offers.Listings.Condition.SubCondition"
    | "Offers.Listings.DeliveryInfo.IsAmazonFulfilled"
    | "Offers.Listings.DeliveryInfo.IsFreeShippingEligible"
    | "Offers.Listings.DeliveryInfo.IsPrimeEligible"
    | "Offers.Listings.IsBuyBoxWinner"
    | "Offers.Listings.LoyaltyPoints.Points"
    | "Offers.Listings.MerchantInfo"
    | "Offers.Listings.Price"
    | "Offers.Listings.ProgramEligibility.IsPrimeExclusive"
    | "Offers.Listings.ProgramEligibility.IsPrimePantry"
    | "Offers.Listings.Promotions"
    | "Offers.Listings.SavingBasis"
    | "Offers.Summaries.HighestPrice"
    | "Offers.Summaries.LowestPrice"
    | "Offers.Summaries.OfferCount"
    | "ParentASIN";

  export type VariationsResourceType =
    | ItemsResourceType
    | "VariationSummary.Price.HighestPrice"
    | "VariationSummary.Price.LowestPrice"
    | "VariationSummary.VariationDimension";

  export type SearchItemsResourceType = ItemsResourceType | "SearchRefinements";

  export type AmazonSearchIndex =
    | "All"
    | "Apparel"
    | "Appliances"
    | "Automotive"
    | "Baby"
    | "Beauty"
    | "Books"
    | "Computers"
    | "DigitalMusic"
    | "Electronics"
    | "EverythingElse"
    | "Fashion"
    | "ForeignBooks"
    | "GardenAndOutdoor"
    | "GiftCards"
    | "GroceryAndGourmetFood"
    | "Handmade"
    | "HealthPersonalCare"
    | "HomeAndKitchen"
    | "Industrial"
    | "Jewelry"
    | "KindleStore"
    | "Lighting"
    | "Luggage"
    | "MobileApps"
    | "MoviesAndTV"
    | "Music"
    | "MusicalInstruments"
    | "OfficeProducts"
    | "PetSupplies"
    | "Shoes"
    | "Software"
    | "SportsAndOutdoors"
    | "ToolsAndHomeImprovement"
    | "ToysAndGames"
    | "VideoGames"
    | "Watches";

  export type AmazonResponseError = {
    __type: string;
    Code: string;
    Message: string;
  };

  export type AmazonBrowseNodesRequestParameters = {
    BrowseNodeIds: string[];
    LanguagesOfPreference?: string[];
    Resources?: BrowseNodesResourceType[];
  };

  export type AmazonBrowseNodesResponse = {
    BrowseNodesResult: {
      BrowseNodes: AmazonBrowseNode[];
    };
  };

  export type AmazonBrowseNode = {
    Ancestor?: AmazonBrowseNode;
    Children?: AmazonBrowseNode[];
    ContextFreeName: string;
    DisplayName: string;
    Id: string;
    IsRoot?: boolean;
  };

  export type AmazonItemsRequestParameters = {
    ItemIds: string[];
    ItemIdType?: "ASIN";
    Condition?: AmazonItemCondition;
    CurrencyOfPreference?: AmazonCurrency;
    LanguagesOfPreference?: string[];
    Merchant?: AmazonMerchant;
    OfferCount?: number;
    Resources?: ItemsResourceType[];
  };

  export type AmazonItemsResponse = {
    Errors?: AmazonResponseError[];
    ItemsResult: {
      Items: AmazonItem[];
    };
  };

  export type AmazonItem = {
    ASIN: string;
    DetailPageURL: string;
    Images: AmazonItemImages;
    ItemInfo: AmazonItemInfo;
    Offers: AmazonItemOffers;
    ParentASIN?: string;
  };

  export type AmazonItemInfo = {
    Title?: {
      DisplayValue: string;
      Label: string;
      Locale: string;
    };
    Features?: {
      DisplayValues: string[];
      Label: string;
      Locale: string;
    };
  };

  export type AmazonItemImages = {
    Primary?: AmazonImagesSizes;
    Variants?: AmazonImagesSizes;
  };

  export type AmazonImagesSizes = {
    Small?: AmazonImageInfo;
    Medium?: AmazonImageInfo;
    Large?: AmazonImageInfo;
  };

  export type AmazonImageInfo = {
    Width: number;
    Height: number;
    URL: string;
  };

  export type AmazonItemCondition = {
    DisplayValue: string;
    Label: string;
    Locale: string;
    Value: string;
    SubCondition?: string;
    ConditionNote?: String;
  };

  export type AmazonItemAvailability = {
    MinOrderQuantity: number;
    MaxOrderQuantity: number;
    Message: string;
    Type: "Now";
  };

  export type AmazonItemPrice = {
    Amount: number;
    Currency: AmazonCurrency;
    DisplayAmount: string;
    Percentage?: number;
    PricePerUnit?: number;
    Savings?: AmazonItemPrice;
  };

  export type AmazonItemOffers = {
    Summaries?: Array<{
      Condition?: AmazonItemCondition;
      HighestPrice?: AmazonItemPrice;
      LowestPrice?: AmazonItemPrice;
      OfferCount?: number;
    }>;
    Listings?: Array<{
      Id: string;
      Condition?: AmazonItemCondition;
      Availability;
      IsBuyboxWinner: boolean;
      Price?: AmazonItemPrice;
      ViolatesMAP?: boolean;
      SavingBasis?: AmazonItemPrice;
    }>;
  };

  export type AmazonItemProgramEligibility = {
    IsPrimeExclusive: boolean;
    IsPrimePantry: boolean;
  };

  export type AmazonVariationsRequestParameters = {
    ASIN: string;
    Condition?: AmazonItemCondition;
    CurrencyOfPreference?: AmazonCurrency;
    LanguagesOfPreference?: string;
    Merchant?: AmazonMerchant;
    OfferCount?: number;
    VariationCount?: number;
    VariationPage?: number;
  };

  export type AmazonVariationsResponse = {
    Errors?: AmazonResponseError[];
    VariationsResult: {
      Items: AmazonVariation[];
    };
  };

  export type AmazonVariation = AmazonItem & {
    VariationAttributes?: AmazonVariationAttribute[];
    VariationSummary?: {
      PageCount: number;
      VariationCount: number;
      Price?: {
        HighestPrice?: AmazonItemPrice;
        LowestPrice?: AmazonItemPrice;
      };
      VariationDimensions?: AmazonVariationSummaryDimension[];
    };
  };

  export type AmazonVariationAttribute = {
    Name: string;
    Value: string;
  };

  export type AmazonVariationSummaryDimension = {
    DisplayName: string;
    Name: string;
    Values: string[];
  };

  export type AmazonSearchItemsRequestParameters = {
    Actor?: string;
    Artist?: string;
    Author?: string;
    Availability?: AmazonAvailability;
    Brand?: string;
    BrowseNodeId?: string;
    Condition?: AmazonItemCondition;
    CurrencyOfPreference?: AmazonCurrency;
    DeliveryFlags?: AmazonDeliveryType;
    ItemCount?: number;
    ItemPage?: number;
    Keywords?: string;
    LanguagesOfPreference?: string[];
    MinPrice?: number;
    MaxPrice?: number;
    MinReviewsRating?: number;
    MinSavingPercent?: number;
    OfferCount?: number;
    Properties?: Record<string, string>;
    Resources?: SearchItemsResourceType[];
    SearchIndex?: AmazonSearchIndex;
    SortBy?: AmazonSearchSortBy;
    Title?: string;
  };

  export type AmazonSearchItemsResponse = {
    Errors?: AmazonResponseError[];
    SearchResult: {
      Items: AmazonItem[];
      SearchURL: string;
      TotalResultCount: number;
    };
  };

  export function GetBrowseNodes(
    commonParameters: AmazonCommonParameters,
    requestParameters: AmazonBrowseNodesRequestParameters
  ): Promise<AmazonBrowseNodesResponse>;
  export function GetItems(
    commonParameters: AmazonCommonParameters,
    requestParameters: AmazonItemsRequestParameters
  ): Promise<AmazonItemsResponse>;
  export function GetVariations(
    commonParameters: AmazonCommonParameters,
    requestParameters: AmazonVariationsRequestParameters
  ): Promise<AmazonVariationsResponse>;
  export function SearchItems(
    commonParameters: AmazonCommonParameters,
    requestParameters: AmazonSearchItemsRequestParameters
  ): Promise<AmazonSearchItemsResponse>;
}

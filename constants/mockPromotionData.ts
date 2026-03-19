/*
  We don't have access to the real KUB API, so this file acts as a stand-in.
  It holds fake but realistic data that mimics what the real API would return.
*/

import { Href } from "expo-router";
import { ImageSourcePropType } from "react-native";

// Defines the shape of a promotion object.
// TypeScript uses this to catch errors anywhere PromotionItem is used in the app.
export type PromotionItem = {
   id: string;                   // Unique identifier
   title: string;                // Displayed on the card and detail screen header
   description: string;          // Short text shown on the card
   image: ImageSourcePropType;   // Local image required from assets
   route: Href;                  // Where tapping the card navigates to
}

export const mockPromotions: PromotionItem[] = [
   {
      id: "outage-notifications",
      title: "OUTAGE NOTIFICATIONS",
      description: "Sign up for KUB's Outage Notifications to stay up-to-date with electric outages.",
      image: require("@/assets/images/promotions/outagenotificationcard-promotion.jpg"),
      route: "/(tabs)/billing/promotions/outageNotifications"
   },
   {
      id: "project-help",
      title: "PROJECT HELP",
      description: "Project Help depends solely on contributions from the community to help those in need of emergency energy assistance.",
      image: require("@/assets/images/promotions/projecthelpcard-promotion.jpg"),
      route: "/(tabs)/billing/promotions/projectHelp"
   },
   {
      id: "connectED",
      title: "FREE KUB FIBER FOR K-12 STUDENTS",
      description: "Income eligible Knox County School students could receive free internet through KUB ConnectED.",
      image: require("@/assets/images/promotions/connectEDcard-promotion.jpg"),
      route: "/(tabs)/billing/promotions/connectED"
   },
   {
      id: "natural-gas-financing",
      title: "NATURAL GAS WATER HEATER FINANCING AVAILABLE",
      description: "KUB offers 0% on-bill financing on new natural gas water heaters.",
      image: require("@/assets/images/promotions/naturalgascard-promotion.jpg"),
      route: "/(tabs)/billing/promotions/naturalGasFinancing"
   },
   {
      id: "workshop",
      title: "SAVINGS WORKSHOPS FOR CUSTOMERS OF ALL AGES",
      description: "KUB, in partnership with TVA EnergyRight, offers free kid, teen, and adult workshops to learn simple ways to save energy and water at home, which also saves money on utility bills.",
      image: require("@/assets/images/promotions/workshopscard-promotion.jpg"),
      route: "/(tabs)/billing/promotions/workshop"
   },
   {
      id: "energy-saving",
      title: "ENERGY-SAVING HOME UPGRADE FUNDING AVAILABLE",
      description: "What homeowners need to know about the Inflation Reduction Act and how to get funding for money-saving home upgrades.",
      image: require("@/assets/images/promotions/energysavingcard-promotion.jpg"),
      route: "/(tabs)/billing/promotions/energySaving"
   },
   {
      id: "solar",
      title: "KUB COMMUNITY SOLAR",
      description: "Subscribe to KUB Community Solar by purchasing a share.",
      image: require("@/assets/images/promotions/communitysolarcard-promotion.jpg"),
      route: "/(tabs)/billing/promotions/solar"
   },
   {
      id: "utility-usage",
      title: "TRACK YOUR UTILITY USAGE",
      description: "Track your utility usage down to the hour.",
      image: require("@/assets/images/promotions/utilityusagecard-promotion.jpg"),
      route: "/(tabs)/billing/promotions/utilityUsage"
   },
]
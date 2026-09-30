import type { Influencer } from "../types";
import { InfluencerCreate } from "./InfluencerCreate";
import { InfluencerEdit } from "./InfluencerEdit";
import { InfluencerList } from "./InfluencerList";
import { InfluencerShow } from "./InfluencerShow";

export default {
  list: InfluencerList,
  show: InfluencerShow,
  edit: InfluencerEdit,
  create: InfluencerCreate,
  recordRepresentation: (record: Influencer) => record?.name,
};

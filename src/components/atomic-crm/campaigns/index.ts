import { CampaignCreate } from "./CampaignCreate";
import { CampaignEdit } from "./CampaignEdit";
import { CampaignList } from "./CampaignList";
import { CampaignShow } from "./CampaignShow";

const campaigns = {
  list: CampaignList,
  create: CampaignCreate,
  edit: CampaignEdit,
  show: CampaignShow,
};

export default campaigns;

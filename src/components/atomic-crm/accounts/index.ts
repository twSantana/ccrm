import { AccountsCreate } from "./AccountsCreate";
import { AccountsEdit } from "./AccountsEdit";
import { AccountsList } from "./AccountsList";

export default {
  list: AccountsList,
  create: AccountsCreate,
  edit: AccountsEdit,
  recordRepresentation: (record: { handle?: string }) =>
    `@${record?.handle ?? ""}`,
};

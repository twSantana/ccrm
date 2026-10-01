import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";
import { Eye, Plus } from "lucide-react";
import {
  RecordContextProvider,
  useDataProvider,
  useListContext,
  useNotify,
} from "ra-core";
import { DeleteButton } from "@/components/admin/delete-button";
import { List } from "@/components/admin/list";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CrmDataProvider } from "../providers/types";
import type { SocialAccount } from "../types";
import { TopToolbar } from "../layout/TopToolbar";

export const AccountsList = () => (
  <List
    title={false}
    actions={<AccountsListActions />}
    perPage={25}
    sort={{ field: "handle", order: "ASC" }}
  >
    <AccountsTable />
  </List>
);

const AccountsListActions = () => (
  <TopToolbar>
    <Button asChild>
      <Link to="/accounts/create">
        <Plus className="mr-2 h-4 w-4" />
        Nova conta
      </Link>
    </Button>
  </TopToolbar>
);

const AccountsTable = () => {
  const { data: accounts, isPending, error } = useListContext<SocialAccount>();
  const [selectedAccount, setSelectedAccount] = useState<SocialAccount | null>(
    null,
  );
  const [revealedPassword, setRevealedPassword] = useState<string | null>(null);
  const notify = useNotify();
  const dataProvider = useDataProvider<CrmDataProvider>();
  const { mutate: revealPassword, isPending: isRevealing } = useMutation({
    mutationFn: (id: number) => dataProvider.revealSocialAccountPassword(id),
    onSuccess: (password) => setRevealedPassword(password),
    onError: () =>
      notify("Não foi possível revelar a senha desta conta.", {
        type: "error",
      }),
  });

  const openPasswordDialog = (account: SocialAccount) => {
    setSelectedAccount(account);
    setRevealedPassword(null);
    revealPassword(Number(account.id));
  };

  const closePasswordDialog = (open: boolean) => {
    if (!open) {
      setSelectedAccount(null);
      setRevealedPassword(null);
    }
  };

  if (isPending)
    return <p className="p-6 text-muted-foreground">Carregando contas...</p>;
  if (error) {
    return (
      <p className="rounded-md bg-destructive/10 p-4 text-destructive">
        Não foi possível carregar as contas. {error.message}
      </p>
    );
  }
  if (!accounts?.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
          <h2 className="text-lg font-semibold">Nenhuma conta cadastrada</h2>
          <p className="text-sm text-muted-foreground">
            Cadastre o @, o e-mail e as credenciais de acesso do Instagram.
          </p>
          <Button asChild>
            <Link to="/accounts/create">
              <Plus className="mr-2 h-4 w-4" />
              Cadastrar primeira conta
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden py-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Conta</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Senha</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <RecordContextProvider key={account.id} value={account}>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {account.avatar_url ? (
                            <img
                              src={account.avatar_url}
                              alt={`Foto de @${account.handle}`}
                              className="h-10 w-10 rounded-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                              {account.handle.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <a
                            href={`https://www.instagram.com/${account.handle}/`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-primary hover:underline"
                          >
                            @{account.handle}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>{account.email || "-"}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          disabled={isRevealing}
                          onClick={() => openPasswordDialog(account)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Revelar
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/accounts/${account.id}`}>Editar</Link>
                          </Button>
                          <DeleteButton
                            resource="accounts"
                            redirect="/accounts"
                            label="Excluir"
                            size="sm"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  </RecordContextProvider>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Dialog
        open={selectedAccount !== null}
        onOpenChange={closePasswordDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Senha de @{selectedAccount?.handle}</DialogTitle>
            <DialogDescription>
              A senha é descriptografada no servidor apenas após esta
              solicitação.
            </DialogDescription>
          </DialogHeader>
          <div className="select-all rounded-md border bg-muted p-3 font-mono">
            {isRevealing
              ? "Carregando..."
              : (revealedPassword ?? "Não foi possível obter a senha.")}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

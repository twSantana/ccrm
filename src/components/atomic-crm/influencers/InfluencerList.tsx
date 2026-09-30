import { RecordContextProvider, useGetIdentity, useListContext } from "ra-core";
import { Link } from "react-router";
import { Edit, Eye, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/admin/delete-button";
import { List } from "@/components/admin/list";
import { ReferenceField } from "@/components/admin/reference-field";
import { TopToolbar } from "../layout/TopToolbar";
import { SaleName } from "../sales/SaleName";
import type { Influencer } from "../types";
import {
  formatFemaleAudience,
  formatFollowers,
  getStatusBadgeStyle,
} from "./formatters";
import { InfluencerEmpty } from "./InfluencerEmpty";
import { InfluencerListFilter } from "./InfluencerListFilter";

export const InfluencerList = () => {
  const { identity } = useGetIdentity();

  if (!identity) return null;

  return (
    <List
      title={false}
      actions={<InfluencerListActions />}
      perPage={25}
      sort={{ field: "name", order: "ASC" }}
    >
      <InfluencerListLayout />
    </List>
  );
};

const InfluencerListActions = () => (
  <TopToolbar>
    <Button asChild>
      <Link to="/influencers/create">
        <Plus className="mr-2 h-4 w-4" /> Novo influenciador
      </Link>
    </Button>
  </TopToolbar>
);

const InfluencerListLayout = () => {
  const { data: influencers, isPending, error, filterValues } = useListContext<Influencer>();
  const hasFilters = filterValues && Object.keys(filterValues).length > 0;

  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
        <p className="font-semibold">Erro ao carregar a lista de influenciadores.</p>
        <p className="text-sm">{error.message || "Verifique sua conexão e tente novamente."}</p>
      </div>
    );
  }

  if (!influencers?.length && !hasFilters) {
    return <InfluencerEmpty />;
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Influenciadores
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie seus influencers e acompanhe informações de audiência e contato.
          </p>
        </div>
        <div>
          <Button asChild className="sm:hidden">
            <Link to="/influencers/create">
              <Plus className="mr-2 h-4 w-4" /> Novo influenciador
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <InfluencerListFilter />

        {/* Content Table / Cards */}
        <div className="flex-1 min-w-0">
          <Card className="py-0 overflow-hidden">
            <CardContent className="p-0">
              {influencers?.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Nenhum influenciador encontrado com os filtros aplicados.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Influenciador</TableHead>
                        <TableHead>Instagram</TableHead>
                        <TableHead className="text-right">Seguidores</TableHead>
                        <TableHead className="text-right">Público feminino</TableHead>
                        <TableHead>Nicho</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Responsável</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {influencers?.map((influencer) => (
                        <RecordContextProvider key={influencer.id} value={influencer}>
                          <TableRow className="hover:bg-muted/50 transition-colors">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                                  {influencer.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                  <Link
                                    to={`/influencers/${influencer.id}/show`}
                                    className="hover:underline text-foreground font-semibold"
                                  >
                                    {influencer.name}
                                  </Link>
                                  {influencer.email && (
                                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                                      {influencer.email}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="text-muted-foreground">
                              {influencer.handle_instagram ? (
                                <a
                                  href={`https://instagram.com/${influencer.handle_instagram.replace("@", "")}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="hover:underline text-primary"
                                >
                                  {influencer.handle_instagram.startsWith("@")
                                    ? influencer.handle_instagram
                                    : `@${influencer.handle_instagram}`}
                                </a>
                              ) : (
                                "-"
                              )}
                            </TableCell>

                            <TableCell className="text-right font-medium">
                              {formatFollowers(influencer.followers_count)}
                            </TableCell>

                            <TableCell className="text-right font-medium">
                              {formatFemaleAudience(influencer.female_audience_pct)}
                            </TableCell>

                            <TableCell>
                              {influencer.niche ? (
                                <Badge variant="secondary" className="font-normal text-xs">
                                  {influencer.niche}
                                </Badge>
                              ) : (
                                "-"
                              )}
                            </TableCell>

                            <TableCell>
                              {influencer.status ? (
                                <Badge className={`text-xs ${getStatusBadgeStyle(influencer.status)}`}>
                                  {influencer.status}
                                </Badge>
                              ) : (
                                "-"
                              )}
                            </TableCell>

                            <TableCell>
                              <ReferenceField
                                source="assigned_user_id"
                                reference="sales"
                                record={influencer}
                                empty="-"
                              >
                                <SaleName />
                              </ReferenceField>
                            </TableCell>

                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  title="Ver detalhes"
                                >
                                  <Link to={`/influencers/${influencer.id}/show`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  title="Editar"
                                >
                                  <Link to={`/influencers/${influencer.id}`}>
                                    <Edit className="h-4 w-4" />
                                  </Link>
                                </Button>
                                <DeleteButton
                                  resource="influencers"
                                  size="icon"
                                  variant="ghost"
                                  redirect={false}
                                  confirmTitle="Excluir influenciador"
                                  confirmContent="Tem certeza que deseja excluir este influenciador?"
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        </RecordContextProvider>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

import { ShowBase, useGetList, useGetMany, useShowContext } from "ra-core";
import { Link } from "react-router";
import { ArrowLeft, Edit, Instagram, Mail, Megaphone, Phone, QrCode, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteButton } from "@/components/admin/delete-button";
import { ReferenceField } from "@/components/admin/reference-field";
import type { Campaign, Influencer } from "../types";
import { SaleName } from "../sales/SaleName";
import type { Tag } from "../types";
import { calculateLucro, calculateROI } from "../types";
import { formatFemaleAudience, formatFollowers, getStatusBadgeStyle } from "./formatters";
import { formatCurrency, formatROI, getLucroColor, getROIColor, getStageBadgeStyle } from "../campaigns/formatters";

export const InfluencerShow = () => (
  <ShowBase>
    <InfluencerShowContent />
  </ShowBase>
);

const InfluencerShowContent = () => {
  const { record, isPending } = useShowContext<Influencer>();
  const { data: tags } = useGetMany<Tag>(
    "tags",
    { ids: record?.tags ?? [] },
    { enabled: Boolean(record?.tags?.length) },
  );

  if (isPending || !record) return null;

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link to="/influencers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {record.name}
              </h1>
              {record.status && (
                <Badge className={getStatusBadgeStyle(record.status)}>
                  {record.status}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {record.niche || "Sem nicho definido"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to={`/influencers/${record.id}`}>
              <Edit className="mr-2 h-4 w-4" /> Editar
            </Link>
          </Button>
          <DeleteButton
            resource="influencers"
            redirect="/influencers"
            confirmTitle="Excluir influenciador"
            confirmContent="Tem certeza que deseja excluir este influenciador?"
          />
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Key Stats & Social */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Audiência & Redes Sociais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" /> Seguidores
              </span>
              <span className="font-semibold text-foreground">
                {formatFollowers(record.followers_count)}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">
                Público Feminino
              </span>
              <span className="font-semibold text-foreground">
                {formatFemaleAudience(record.female_audience_pct)}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Instagram className="h-4 w-4" /> Instagram
              </span>
              <span className="font-medium text-foreground">
                {record.handle_instagram ? (
                  <a
                    href={`https://instagram.com/${record.handle_instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline text-primary"
                  >
                    {record.handle_instagram.startsWith("@")
                      ? record.handle_instagram
                      : `@${record.handle_instagram}`}
                  </a>
                ) : (
                  "-"
                )}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">TikTok</span>
              <span className="font-medium text-foreground">
                {record.handle_tiktok ? (
                  <a
                    href={`https://tiktok.com/@${record.handle_tiktok.replace("@", "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline text-primary"
                  >
                    {record.handle_tiktok.startsWith("@")
                      ? record.handle_tiktok
                      : `@${record.handle_tiktok}`}
                  </a>
                ) : (
                  "-"
                )}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Center Column: Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Informações de Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" /> E-mail
              </span>
              <span className="font-medium text-foreground truncate max-w-[200px]">
                {record.email || "-"}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Phone className="h-4 w-4" /> Telefone
              </span>
              <span className="font-medium text-foreground">
                {record.phone || "-"}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <QrCode className="h-4 w-4" /> Chave Pix
              </span>
              <span className="font-medium text-foreground truncate max-w-[200px]">
                {record.pix_key || "-"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Notes */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Observações Internas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {record.notes || "Nenhuma observação registrada."}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Responsável e tags
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Responsável</p>
            <ReferenceField
              source="assigned_user_id"
              reference="sales"
              record={record}
              empty="-"
            >
              <SaleName />
            </ReferenceField>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Tags</p>
            <div className="flex flex-wrap gap-2">
              {tags?.length ? (
                tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="text-black"
                    style={{ backgroundColor: tag.color, border: 0 }}
                  >
                    {tag.name}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">Sem tags</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Section */}
      <InfluencerCampaigns influencerId={record.id} />
    </div>
  );
};

const InfluencerCampaigns = ({ influencerId }: { influencerId: number | string }) => {
  const { data: campaigns, isPending } = useGetList<Campaign>("campaigns", {
    filter: { influencer_id: influencerId },
    sort: { field: "created_at", order: "DESC" },
    pagination: { page: 1, perPage: 10 },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Megaphone className="h-4 w-4" />
          Campanhas Realizadas
        </CardTitle>
        <Button size="sm" asChild variant="outline">
          <Link to={`/campaigns/create`}>Nova Campanha</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isPending && (
          <p className="text-sm text-muted-foreground">Carregando campanhas...</p>
        )}
        {!isPending && (!campaigns || campaigns.length === 0) && (
          <p className="text-sm text-muted-foreground italic">
            Nenhuma campanha registrada para esta influenciadora.
          </p>
        )}
        {!isPending && campaigns && campaigns.length > 0 && (
          <div className="space-y-3">
            {campaigns.map((campaign) => {
              const lucro = calculateLucro(campaign.commission ?? 0, campaign.investment ?? 0);
              const roi = calculateROI(campaign.commission ?? 0, campaign.investment ?? 0);
              return (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <Link
                      to={`/campaigns/${campaign.id}/show`}
                      className="text-sm font-semibold text-foreground hover:underline"
                    >
                      {campaign.name}
                    </Link>
                    {campaign.infoproduct_name && (
                      <span className="text-xs text-muted-foreground">
                        {campaign.infoproduct_name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <Badge className={`text-xs ${getStageBadgeStyle(campaign.stage)}`}>
                      {campaign.stage}
                    </Badge>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-muted-foreground">Lucro</p>
                      <p className={`font-semibold text-sm ${getLucroColor(lucro)}`}>
                        {formatCurrency(lucro)}
                      </p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-muted-foreground">ROI</p>
                      <p className={`font-semibold text-sm ${getROIColor(roi)}`}>
                        {formatROI(roi)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

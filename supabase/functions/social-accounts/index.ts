import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { corsHeaders, createErrorResponse } from "../_shared/utils.ts";

const accountFields =
  "id, platform, handle, email, avatar_url, created_at, updated_at";
const encoder = new TextEncoder();
const decoder = new TextDecoder();

type AccountInput = {
  platform?: string;
  handle?: string;
  email?: string | null;
  avatar_url?: string | null;
  password?: string;
};

function encodeBase64(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function decodeBase64(value: string) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

async function getEncryptionKey() {
  const encodedKey = Deno.env.get("ACCOUNT_ENCRYPTION_KEY");
  if (!encodedKey) {
    throw new Error("ACCOUNT_ENCRYPTION_KEY is not configured");
  }

  const rawKey = decodeBase64(encodedKey);
  if (rawKey.length !== 32) {
    throw new Error("ACCOUNT_ENCRYPTION_KEY must decode to exactly 32 bytes");
  }

  return crypto.subtle.importKey("raw", rawKey, "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
}

async function encryptPassword(password: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    await getEncryptionKey(),
    encoder.encode(password),
  );

  return `${encodeBase64(iv)}.${encodeBase64(new Uint8Array(encrypted))}`;
}

async function decryptPassword(value: string) {
  const [encodedIv, encodedPassword] = value.split(".");
  if (!encodedIv || !encodedPassword) {
    throw new Error("Stored password has an invalid encrypted format");
  }

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: decodeBase64(encodedIv) },
    await getEncryptionKey(),
    decodeBase64(encodedPassword),
  );

  return decoder.decode(decrypted);
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

function validateAccount(input: AccountInput, requirePassword: boolean) {
  if (typeof input.handle !== "string") {
    return { error: "Informe um @ do Instagram válido (até 30 caracteres)." };
  }
  const handle = input.handle.trim().replace(/^@/, "");
  if (!handle || !/^[A-Za-z0-9._]{1,30}$/.test(handle)) {
    return { error: "Informe um @ do Instagram válido (até 30 caracteres)." };
  }

  if (input.platform !== undefined && input.platform !== "instagram") {
    return { error: "No momento, somente contas do Instagram são suportadas." };
  }

  const password = input.password;
  if (password !== undefined && typeof password !== "string") {
    return { error: "A senha informada é inválida." };
  }
  if ((requirePassword && !password) || (password && password.length > 1024)) {
    return { error: "A senha é obrigatória e deve ter até 1024 caracteres." };
  }

  if (input.email != null && typeof input.email !== "string") {
    return { error: "Informe um e-mail válido." };
  }
  const email = input.email?.trim();
  if (
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 320
  ) {
    return { error: "Informe um e-mail válido." };
  }

  if (input.avatar_url != null && typeof input.avatar_url !== "string") {
    return { error: "Informe uma URL válida para a foto." };
  }
  const avatarUrl = input.avatar_url?.trim() || null;
  if (avatarUrl) {
    try {
      const url = new URL(avatarUrl);
      if (url.protocol !== "https:") {
        return { error: "A URL da foto deve usar HTTPS." };
      }
    } catch {
      return { error: "Informe uma URL válida para a foto." };
    }
  }

  return {
    data: {
      platform: "instagram",
      handle,
      email,
      avatar_url: avatarUrl,
    },
    password: password || undefined,
  };
}

async function handleRequest(req: Request) {
  const authorization = req.headers.get("Authorization");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!authorization || !supabaseUrl || !supabaseAnonKey) {
    return createErrorResponse(401, "Unauthorized");
  }

  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) {
    return createErrorResponse(401, "Unauthorized");
  }

  const { data: currentSale, error: saleError } = await supabaseAdmin
    .from("sales")
    .select("administrator")
    .eq("user_id", userData.user.id)
    .single();
  if (saleError || !currentSale?.administrator) {
    return createErrorResponse(
      403,
      "Somente administradores podem acessar as contas.",
    );
  }

  const body = await req.json();
  const action = body?.action;

  if (action === "list") {
    const page = Math.max(1, Number(body.page) || 1);
    const perPage = Math.min(100, Math.max(1, Number(body.perPage) || 25));
    const sortFields = new Set(["id", "handle", "email", "created_at"]);
    const sortField = sortFields.has(body.sortField)
      ? body.sortField
      : "handle";
    const ascending = body.sortOrder !== "DESC";
    const { data, error, count } = await supabaseAdmin
      .from("social_accounts")
      .select(accountFields, { count: "exact" })
      .order(sortField, { ascending })
      .range((page - 1) * perPage, page * perPage - 1);

    if (error)
      return createErrorResponse(500, "Não foi possível listar as contas.");
    return jsonResponse({ data, total: count ?? 0 });
  }

  if (action === "get" || action === "reveal") {
    const id = Number(body.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
      return createErrorResponse(400, "Identificador de conta inválido.");
    }
    const { data, error } = await supabaseAdmin
      .from("social_accounts")
      .select(action === "reveal" ? "encrypted_password" : accountFields)
      .eq("id", id)
      .single();
    if (error || !data)
      return createErrorResponse(404, "Conta não encontrada.");

    if (action === "reveal") {
      return jsonResponse({
        password: await decryptPassword(data.encrypted_password),
      });
    }
    return jsonResponse(data);
  }

  if (action === "create") {
    const validated = validateAccount(body.data ?? {}, true);
    if ("error" in validated) {
      return createErrorResponse(400, validated.error);
    }
    if (!validated.password) {
      return createErrorResponse(400, "A senha é obrigatória.");
    }
    const encryptedPassword = await encryptPassword(validated.password);
    const { data, error } = await supabaseAdmin
      .from("social_accounts")
      .insert({ ...validated.data, encrypted_password: encryptedPassword })
      .select(accountFields)
      .single();
    if (error || !data) {
      console.error("Failed to create social account:", error);
      return createErrorResponse(500, "Não foi possível salvar a conta.");
    }
    return jsonResponse(data, 201);
  }

  if (action === "update") {
    const id = Number(body.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
      return createErrorResponse(400, "Identificador de conta inválido.");
    }
    const validated = validateAccount(body.data ?? {}, false);
    if ("error" in validated) {
      return createErrorResponse(400, validated.error);
    }
    const updateData: Record<string, unknown> = { ...validated.data };
    if (validated.password) {
      updateData.encrypted_password = await encryptPassword(validated.password);
    }
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from("social_accounts")
      .update(updateData)
      .eq("id", id)
      .select(accountFields)
      .single();
    if (error || !data) {
      console.error("Failed to update social account:", error);
      return createErrorResponse(500, "Não foi possível atualizar a conta.");
    }
    return jsonResponse(data);
  }

  if (action === "delete") {
    const id = Number(body.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
      return createErrorResponse(400, "Identificador de conta inválido.");
    }
    const { data, error } = await supabaseAdmin
      .from("social_accounts")
      .delete()
      .eq("id", id)
      .select(accountFields)
      .single();
    if (error || !data)
      return createErrorResponse(404, "Conta não encontrada.");
    return jsonResponse(data);
  }

  return createErrorResponse(400, "Ação de conta inválida.");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return createErrorResponse(405, "Method Not Allowed");
  }

  try {
    return await handleRequest(req);
  } catch (error) {
    console.error("Social accounts request failed:", error);
    return createErrorResponse(500, "Erro interno ao processar a conta.");
  }
});

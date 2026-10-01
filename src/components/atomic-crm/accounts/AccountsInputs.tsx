import { required } from "ra-core";
import { TextInput } from "@/components/admin/text-input";

const validateEmail = [required("Informe o e-mail de acesso")];

export const AccountsInputs = ({ editing = false }: { editing?: boolean }) => (
  <div className="grid gap-4 md:grid-cols-2">
    <TextInput
      source="handle"
      label="Usuário do Instagram (@)"
      placeholder="exemplo"
      validate={required("Informe o @ da conta")}
      isRequired
    />
    <TextInput
      source="email"
      label="E-mail de acesso"
      type="email"
      validate={validateEmail}
      isRequired
    />
    <TextInput
      source="password"
      label={editing ? "Nova senha (opcional)" : "Senha"}
      type="password"
      autoComplete="new-password"
      validate={editing ? undefined : required("Informe a senha")}
      isRequired={!editing}
      helperText={
        editing
          ? "Deixe em branco para manter a senha atual."
          : "A senha será criptografada no servidor antes de ser salva."
      }
    />
    <TextInput
      source="avatar_url"
      label="URL da foto de perfil"
      type="url"
      placeholder="https://..."
      helperText="Opcional. O Instagram não fornece a foto automaticamente apenas pelo @."
    />
  </div>
);

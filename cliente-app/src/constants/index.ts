// Preços por combinação Tipo / Serviço
export const PRECO_TABLE: Record<string, number> = {
  "Calça|Lavar": 12.5,
  "Calça|Secar": 6,
  "Camisa|Lavar": 8,
  "Camisa|Passar": 5,
  "Vestido|Lavar": 20,
  "Vestido|Pacote Completo": 30,
  "Calça|Pacote Completo": 22,
  "Camisa|Pacote Completo": 13,
};

export const TIPOS = ["Calça", "Camisa", "Vestido"];
export const SERVICOS = ["Lavar", "Secar", "Passar", "Pacote Completo"];

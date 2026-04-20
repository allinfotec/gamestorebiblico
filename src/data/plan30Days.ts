export interface PlanDay {
  day: number;
  label: string;
  readings: { abbrev: string, chapter: number }[];
}

export const plan30Days: PlanDay[] = [
  { day: 1, label: "A Criação e Queda", readings: [{abbrev: "gn", chapter: 1}, {abbrev: "gn", chapter: 2}, {abbrev: "gn", chapter: 3}] },
  { day: 2, label: "O Dilúvio e a Aliança", readings: [{abbrev: "gn", chapter: 8}, {abbrev: "gn", chapter: 9}] },
  { day: 3, label: "A Promessa a Abraão", readings: [{abbrev: "gn", chapter: 12}, {abbrev: "gn", chapter: 15}] },
  { day: 4, label: "A História de José", readings: [{abbrev: "gn", chapter: 37}, {abbrev: "gn", chapter: 39}] },
  { day: 5, label: "A Libertação do Egito", readings: [{abbrev: "ex", chapter: 3}, {abbrev: "ex", chapter: 14}] },
  { day: 6, label: "Os Dez Mandamentos", readings: [{abbrev: "ex", chapter: 20}] },
  { day: 7, label: "A Terra Prometida", readings: [{abbrev: "js", chapter: 1}, {abbrev: "js", chapter: 24}] },
  { day: 8, label: "Davi e Golias", readings: [{abbrev: "1sm", chapter: 17}] },
  { day: 9, label: "Louvor e Proteção", readings: [{abbrev: "sl", chapter: 23}, {abbrev: "sl", chapter: 91}] },
  { day: 10, label: "Ensinos de Sabedoria", readings: [{abbrev: "pv", chapter: 1}, {abbrev: "pv", chapter: 3}] },
  { day: 11, label: "Nascimento de Jesus", readings: [{abbrev: "lc", chapter: 1}, {abbrev: "lc", chapter: 2}] },
  { day: 12, label: "O Batismo e a Tentação", readings: [{abbrev: "mt", chapter: 3}, {abbrev: "mt", chapter: 4}] },
  { day: 13, label: "Sermão do Monte (Parte 1)", readings: [{abbrev: "mt", chapter: 5}, {abbrev: "mt", chapter: 6}] },
  { day: 14, label: "Sermão do Monte (Parte 2)", readings: [{abbrev: "mt", chapter: 7}] },
  { day: 15, label: "Parábolas do Reino", readings: [{abbrev: "mt", chapter: 13}] },
  { day: 16, label: "A Misericórdia de Deus", readings: [{abbrev: "lc", chapter: 15}] },
  { day: 17, label: "Jesus é o Verbo", readings: [{abbrev: "jo", chapter: 1}] },
  { day: 18, label: "O Novo Nascimento", readings: [{abbrev: "jo", chapter: 3}] },
  { day: 19, label: "O Pão da Vida", readings: [{abbrev: "jo", chapter: 6}] },
  { day: 20, label: "O Bom Pastor", readings: [{abbrev: "jo", chapter: 10}] },
  { day: 21, label: "A Ressurreição de Lázaro", readings: [{abbrev: "jo", chapter: 11}] },
  { day: 22, label: "A Última Ceia", readings: [{abbrev: "lc", chapter: 22}] },
  { day: 23, label: "A Morte de Jesus", readings: [{abbrev: "lc", chapter: 23}] },
  { day: 24, label: "A Ressurreição", readings: [{abbrev: "lc", chapter: 24}] },
  { day: 25, label: "A Descida do Espírito Santo", readings: [{abbrev: "at", chapter: 2}] },
  { day: 26, label: "A Conversão de Saulo", readings: [{abbrev: "at", chapter: 9}] },
  { day: 27, label: "Justificação pela Fé", readings: [{abbrev: "rm", chapter: 5}, {abbrev: "rm", chapter: 8}] },
  { day: 28, label: "O Dom do Amor", readings: [{abbrev: "1co", chapter: 13}] },
  { day: 29, label: "O Fruto do Espírito", readings: [{abbrev: "gl", chapter: 5}] },
  { day: 30, label: "A Nova Jerusalém", readings: [{abbrev: "ap", chapter: 21}, {abbrev: "ap", chapter: 22}] }
];

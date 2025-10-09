export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatBTC(value: number): string {
  return `${value.toFixed(8)} BTC`;
}

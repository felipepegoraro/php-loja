export type Order = {
  id: number;
  idUsuario: number;
  data: string;
  status: 'pendente' | 'pago' | 'enviado' | 'outro';
  total: number;
}

export type OrderItem = {
  id: number;
  userId: number;
  itemId: number;
  quantity: number;
  price: number;
  finalized: boolean;
  orderId: number;
}

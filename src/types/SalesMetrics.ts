// export type Order = {
//   id: number;
//   idUsuario: number;
//   data: string;
//   status: 'pendente' | 'pago' | 'enviado' | 'outro';
//   total: number;
// }
//
// export type OrderItem = {
//   id: number;
//   userId: number;
//   itemId: number;
//   quantity: number;
//   price: number;
//   finalized: boolean;
//   orderId: number;
// }

import type {Item} from './item';
import type {Order, OrderItem} from './order';
import axios from 'axios';


export default class SalesMetrics {

    private endpoint: string = process.env.REACT_APP_ENDPOINT as string;
    private orders: Order[] = [];

    private topcustomers: Array<{
        nome:string,
        total:number
    }> = [];

    private topitems: Array<Item & {totalVendido: number}> = [];

    constructor () {
        return this;
    }

    async fetchOrder(){
        try {
            const response = await axios.get(`${this.endpoint}/order-get.php`, {withCredentials: true});
            if (!response.data.success) {
                console.error('Erro ao carregar pedidos:', response.data.message);
                return;
            }

            if (response.data.special) {
                console.log(response.data.message);
                return;
            }

            this.orders = response.data.value;
        } catch (error) {
            console.error('Erro ao fazer a requisição', error);
        }

        return this;
    }

    getOrders(){
        return this.orders;
    }

    async fetchTopCustomers() {
        try {
            const response = await axios.get(`${this.endpoint}/top-customers.php`, {withCredentials: true});
            if (response.data.success) {
                this.topcustomers  = response.data.message;
            } else {
                console.error('Erro ao obter os maiores compradores:', response.data.message);
            }
        } catch (error) {
            console.error('Erro ao fazer a requisição', error);
        }

        return this;
    }
    
    getTopCustomers() {
        return this.topcustomers;
    }

    /* Análise de vendas totais
     Calcula a soma de todas as vendas.
    */
    calculateTotalSales() {
        return this.orders.reduce((sum: number, item: Order) => {
            const totalValue = parseFloat(item.total.toString());
            return sum + (isNaN(totalValue) ? 0 : totalValue);
        }, 0);
    }

    /* Calcular vendas em determinado mês/ano */
    calculateSalesByMonth(year: number, month: number) {
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0);

        return this.orders.reduce((sum: number, item: Order) => {
            const totalValue = parseFloat(item.total.toString());
            const orderDate = new Date(item.data);

            // Verifica se a data do pedido está dentro do mês especificado
            if (orderDate >= startOfMonth && orderDate <= endOfMonth) {
                return sum + (isNaN(totalValue) ? 0 : totalValue);
            }

            return sum;
        }, 0);
    }

    /* Calcular total de vendas no mês atual */
    calculateMonthSales() {
        return this.calculateSalesByMonth(new Date().getFullYear(), new Date().getMonth() + 1);
    }

    /* Comparação de vendas entre períodos
     Compara as vendas entre dois períodos para calcular a variação.
    */
    compareSalesPeriods() {
    }

    /* Taxa de crescimento das vendas
     Calcula a taxa de crescimento entre mês atual e passado.
    */
    calculateGrowthRate() {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        const currentMonthSales = this.calculateMonthSales();

        const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const previousMonthSales = this.calculateSalesByMonth(currentYear, previousMonth);

        if (previousMonthSales === 0) {
            // Acho que é inifinito mesmo, 100% seria o dobro do mês passado
            return currentMonthSales > 0 ? Infinity : 0;
        }

        const growthRate = ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100;
        return growthRate;
    }

    // esse aqui ignora categoria e subcategoria pq teria q fazer 4 inner join e obviamente isso nao é bom ne
    async fetchTopItems(type: "quantidade" | "valor", maxItems: number) {
        try {
            const response = await axios.get(`${this.endpoint}/top-itens.php?type=${type}&limit=${maxItems}`, { withCredentials: true });
            if (!response.data.success) {
                console.error('Erro ao obter os produtos mais vendidos:', response.data.message);
                return;
            }

            if (response.data.special){
                console.log(response.data);
                console.log(response.data.message);
                return;
            }

            this.topitems = response.data.data;
        } catch (error) {
            console.error('Erro ao fazer a requisição', error);
        }

        return this;
    }

    getTopItems() {
        return this.topitems;
    }

    /* Análise de estoques
     Verifica o nível de estoque de cada produto com base nas vendas.
    */
    checkInventory() {
        // TODO
    }

    /* Frequência de compras dos clientes
     Calcula a frequência com que cada cliente realiza compras.
    */
    calculatePurchaseFrequency() {
        // TODO
    }

    /* Ticket médio por cliente
     Calcula o valor médio gasto por cada cliente nas suas compras.
    */
    calculateAverageTicket() {
        // TODO
    }
}

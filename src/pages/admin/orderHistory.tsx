import { useState, useEffect } from 'react';
import SalesMetrics from '../../types/SalesMetrics';
import type {Item} from '../../types/item';

const OrderHistory = () => {
    const [settings, setSettings] = useState<{ sortBy: 'valor' | 'quantidade'; maxItems: number }>({
        sortBy: 'valor',
        maxItems: 5
    });
    const [metrics, setMetrics] = useState<SalesMetrics | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value as 'valor' | 'quantidade';
        setSettings((prevSettings) => ({
            ...prevSettings,
            sortBy: value
        }));
    };

    const handleMaxItemsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSettings((prevSettings) => ({
            ...prevSettings,
            maxItems: Number(event.target.value)
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            const salesMetrics = new SalesMetrics();
            await salesMetrics.fetchTopCustomers();
            await salesMetrics.fetchOrder();
            await salesMetrics.fetchTopItems(settings.sortBy, settings.maxItems);

            setMetrics(salesMetrics);
            setLoading(false);
        };

        fetchData();
    }, [settings.sortBy, settings.maxItems]);

    if (loading) return <div>Carregando...</div>;

    return metrics && (
        <main className="container">
            <div>
                <h3>Vendas</h3>
                    <ul>
                        <li>Total de vendas: {metrics.calculateTotalSales()}</li>
                        <li>Vendas esse mês: {metrics.calculateMonthSales()}</li>
                        <li>Variação de vendas em relação ao mês passado (%): {metrics.calculateGrowthRate()}</li>
                    </ul>
            </div>

            <div>
                <h3>Compradores</h3>
                <p>Top {metrics.getTopCustomers().length} maiores compradores: </p>
                <ul>
                    {metrics.getTopCustomers().map((i: {nome:string, total:number}, index: number) => (
                        <li key={index}>{i.nome}: {i.total}</li>
                    ))}
                </ul>
            </div>

            <div>
                <label htmlFor="maxItems">Número máximo de itens: </label>
                <input 
                    id="maxItems" 
                    type="number" 
                    value={settings.maxItems} 
                    onChange={handleMaxItemsChange} 
                    min="1" 
                />
            </div>

            <div>
                <h3>Produtos</h3>
                <div>
                    <label htmlFor="sortBy">Ordenar por: </label>
                    <select id="sortBy" value={settings.sortBy} onChange={handleSortChange}>
                        <option value="valor">Valor</option>
                        <option value="quantidade">Quantidade</option>
                    </select>
                </div>
                <ul>
                    {metrics.getTopItems().map((i: Item & {totalVendido: number}, index: number) => (
                        <li key={index}>id({i.id}): {i.nome}: {settings.sortBy === "valor" ? "R$ " : "x"}{i.totalVendido}</li>
                    ))}
                </ul>
            </div>

            <button className="btn btn-primary" disabled>
                Gerar relatório (.pdf)
            </button>
        </main>
    );
};

export default OrderHistory;

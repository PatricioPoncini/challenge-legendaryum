// Configuración de una moneda específica
interface CoinData {
    id: string;
    room: string;
    position: Position;
}

interface Position {
    x: number;
    y: number;
    z: number;
}

export default CoinData;

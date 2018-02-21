export interface IPagamento {
    id: number;
    forma_de_pagamento?: string;
    valor?: number;
    moeda?: string;
    status?: string;
    data?: Date;
    descricao?: string;
}

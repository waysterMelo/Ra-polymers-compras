import { Injectable } from '@nestjs/common';

// O TaxCreditEngine é o coração fiscal do sistema
// Ele recebe o contexto da compra e decide o que é crédito recuperável

export interface TaxContext {
  buyerRegime: string;     // REAL | PRESUMIDO | SIMPLES
  supplierRegime: string;  // REAL | PRESUMIDO | SIMPLES
  itemUseType: string;     // INDUSTRIAL_INPUT | RESALE | CONSUMPTION | FIXED_ASSET
  price: number;           // Preço Unitário Base
  quantity: number;
  freight: number;         // Frete Total
  ipiRate: number;
  icmsRate: number;
  pisRate: number;
  cofinsRate: number;
}

@Injectable()
export class TaxCreditService {
  
  calculate(ctx: TaxContext) {
    const { 
      buyerRegime, supplierRegime, itemUseType, 
      price, quantity, freight,
      ipiRate, icmsRate, pisRate, cofinsRate 
    } = ctx;

    const freightPerUnit = freight / (quantity || 1);

    // 1. Valores Nominais dos Impostos (Base = Preço Unitário)
    // Assumindo que o preço informado já contém ICMS/PIS/COFINS por dentro (padrão BR), mas IPI é por fora.
    const ipiValue = price * (ipiRate / 100);
    
    // O valor monetário que "estaria" embutido ou destacado para crédito
    const icmsMonetary = price * (icmsRate / 100);
    const pisMonetary = price * (pisRate / 100);
    const cofinsMonetary = price * (cofinsRate / 100);

    // 2. Custo Bruto (O que sai do caixa imediatamente)
    // Preço (com impostos "por dentro") + Frete + IPI ("por fora")
    const grossCostUnit = price + freightPerUnit + ipiValue;

    // 3. MOTOR DE REGRAS DE CRÉDITO (TRAVAS FISCAIS)
    let creditIcms = 0;
    let creditPis = 0;
    let creditCofins = 0;
    let creditIpi = 0;
    let alerts: string[] = [];

    // REGRA DE OURO: Uso e Consumo NUNCA gera crédito
    if (itemUseType === 'CONSUMPTION') {
       alerts.push('Créditos anulados: Mercadoria destinada a Uso e Consumo.');
       // Retorna sem créditos
       return {
         grossCost: grossCostUnit,
         creditIcms: 0,
         creditPis: 0,
         creditCofins: 0,
         netCost: grossCostUnit,
         alerts,
         taxMemory: { ...ctx, grossCostUnit, netCostUnit: grossCostUnit, credits: { total: 0 } }
       };
    }

    // Tratamento de Ativo Imobilizado (FIXED_ASSET)
    const isInputOrResale = ['INDUSTRIAL_INPUT', 'RESALE', 'FIXED_ASSET'].includes(itemUseType);

    if (isInputOrResale) {
      // 1. CRÉDITO DE ICMS (Lucro Real e Presumido)
      if (buyerRegime === 'REAL' || buyerRegime === 'PRESUMIDO') {
         creditIcms = icmsMonetary;
      }

      // 2. CRÉDITO DE PIS/COFINS (Apenas Lucro Real)
      if (buyerRegime === 'REAL') {
        if (supplierRegime === 'SIMPLES') {
           // Trava do Fornecedor Simples
           creditPis = 0;
           creditCofins = 0;
           if (pisRate > 0 || cofinsRate > 0) {
             alerts.push('Aviso: Créditos de PIS/COFINS zerados pois Fornecedor é Simples Nacional.');
           }
        } else {
           // Fornecedor Lucro Real ou Presumido -> Gera Crédito
           creditPis = pisMonetary;
           creditCofins = cofinsMonetary;
        }
      }
    }

    // IPI: Apenas Indústria (Real/Presumido) recupera se for insumo
    if (buyerRegime !== 'SIMPLES' && itemUseType === 'INDUSTRIAL_INPUT') {
       creditIpi = ipiValue; 
    }

    // 4. Fechamento
    const totalCredits = creditIcms + creditPis + creditCofins + creditIpi;
    const netCostUnit = grossCostUnit - totalCredits;

    // Memória de Cálculo (Para Auditoria)
    const taxMemory = {
      calculationDate: new Date().toISOString(),
      buyerRegime,
      supplierRegime,
      itemUseType,
      grossCostUnit,
      credits: {
        icms: creditIcms,
        pis: creditPis,
        cofins: creditCofins,
        ipi: creditIpi,
        total: totalCredits
      },
      netCostUnit,
      alerts
    };

    return {
      grossCost: grossCostUnit,
      creditIcms,
      creditPis,
      creditCofins,
      netCost: netCostUnit,
      taxMemory,
      alerts
    };
  }
}

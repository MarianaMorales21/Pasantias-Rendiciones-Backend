import { reportsModel } from "../models/reportsModel.js";
import { numeroALetrasConDecimales, formatearMonto } from "../libs/numeroALetras.js";

// GET /reports/renditions — Lista de rendiciones para el selector
export const getRenditionList = async (req, res) => {
    try {
        const renditions = await reportsModel.getRenditionListModel();

        // Calcular porcentaje acumulativo por OPG (considerando reintegros)
        let lastOpg = null;
        let cumulativeNeto = 0;

        const list = renditions.map(r => {
            const montoOpg = parseFloat(r.mon_opg);
            const totalRendido = parseFloat(r.total_rendido);
            const reintegro = parseFloat(r.rnt_rnd || 0);

            if (r.cod_opg !== lastOpg) {
                cumulativeNeto = 0;
                lastOpg = r.cod_opg;
            }

            cumulativeNeto += totalRendido - reintegro;
            const porcentaje = montoOpg > 0 ? ((cumulativeNeto * 100) / montoOpg) : 0;

            return {
                cod_rnd: r.cod_rnd,
                num_rnd: r.num_rnd,
                fec_rnd: r.fec_rnd,
                prd_rnd: r.prd_rnd,
                avs_rnd: r.avs_rnd,
                rnt_rnd: reintegro,
                cod_opg: r.cod_opg,
                num_opg: r.num_opg,
                fec_opg: r.fec_opg,
                mon_opg: montoOpg,
                total_rendido: totalRendido,
                porcentaje: parseFloat(porcentaje.toFixed(2)),
                label: `OPG ${r.num_opg} - R${r.num_rnd} (${porcentaje.toFixed(1)}% acum.)`
            };
        });

        res.json({ ok: true, data: list });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Error al obtener lista de rendiciones' });
    }
};

export const getOPGExecutionByRendition = async (req, res) => {
    try {
        const { cod_rnd } = req.params;
        const data = await reportsModel.getOPGExecutionByRenditionModel(cod_rnd);
        res.json({ ok: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Error al obtener ejecución de OPG' });
    }
};

// GET /reports/detailed/:cod_rnd — Reporte detallado de una rendición
export const getDetailedReport = async (req, res) => {
    try {
        const { cod_rnd } = req.params;

        const header = await reportsModel.getReportHeaderModel(cod_rnd);
        if (!header) {
            return res.status(404).json({ ok: false, message: 'No se encontró la rendición' });
        }

        const details = await reportsModel.getRenditionDetailsModel(cod_rnd);
        
        // Obtener cálculos históricos acumulados de rendiciones anteriores y reintegros
        const calculationData = await reportsModel.getDetailedReportCalculationsModel(cod_rnd, header.cod_opg);

        const round2 = (n) => Math.round(n * 100) / 100;
        const montoOpg = parseFloat(header.mon_opg);
        const montoRendidoActual = details.reduce((acc, curr) => acc + parseFloat(curr.mon_drn), 0);
        const reintegro = header.rnt_rnd ? parseFloat(header.rnt_rnd) : 0;

        // Fórmulas requeridas de reintegro
        const montoAnterior = calculationData.previousSpent - calculationData.previousReintegros - reintegro;
        const montoPorRendir = round2(montoOpg - montoAnterior - montoRendidoActual);
        
        const porcentajeRendido = montoOpg > 0 ? (((montoAnterior + montoRendidoActual) * 100) / montoOpg) : 0;
        const porcentajePorRendir = 100 - porcentajeRendido;

        // Agrupar detalles por programa (nom_pro ahora viene del JOIN)
        const programGroups = {};
        for (const detail of details) {
            const key = detail.cod_pro; // agrupar por ID numérico, más seguro que el nombre
            if (!programGroups[key]) {
                programGroups[key] = {
                    cod_pro: detail.cod_pro,
                    nom_pro: detail.programa,
                    items: [],
                    subtotal: 0
                };
            }
            programGroups[key].items.push({
                num_ndb: detail.num_ndb,
                fec_ndb: detail.fec_ndb,
                partida: detail.partida,
                ban_ndb: detail.ban_ndb,
                ref_ndb: detail.ref_ndb,
                nom_ben: detail.nom_ben,
                rif_ben: detail.rif_ben,
                dir_ben: detail.dir_ben || "N/A",
                des_drn: detail.con_ndb,        // ← concepto de la nota, no del detalle
                mon_drn: parseFloat(detail.mon_drn)
            });
            programGroups[key].subtotal += parseFloat(detail.mon_drn);
        }

        
        res.json({
            ok: true,
            header: {
                ...header,
                mon_opg: montoOpg
            },
            details: Object.values(programGroups),
            summary: {
                montoAsignado: montoOpg,
                montoRendidoAnterior: montoAnterior,
                montoRendido: montoRendidoActual,
                reintegro,
                montoPorRendir,
                porcentajeRendido: parseFloat(porcentajeRendido.toFixed(2)),
                porcentajePorRendir: parseFloat(porcentajePorRendir.toFixed(2)),
                // Formateados
                montoAsignadoFmt: formatearMonto(montoOpg),
                montoRendidoAnteriorFmt: formatearMonto(montoAnterior),
                montoRendidoFmt: formatearMonto(montoRendidoActual),
                reintegroFmt: formatearMonto(reintegro),
                montoPorRendirFmt: formatearMonto(montoPorRendir),
            }
        });
    } catch (error) {
        console.error('❌ getDetailedReport ERROR:', error?.message || error);
        console.error('❌ SQL STATE:', error?.sqlState, '| SQL MSG:', error?.sqlMessage);
        res.status(500).json({ ok: false, message: 'Error al generar datos del reporte detallado', debug: error?.message });
    }
};

// GET /reports/opg/:cod_opg — Reporte del historial COMPLETO de una OPG
export const getFullOPGReport = async (req, res) => {
    try {
        const { cod_opg } = req.params;
        const history = await reportsModel.getFullOPGHistoryModel(cod_opg);
        const summary = await reportsModel.getOPGExecutionSummaryModel(cod_opg);

        const monOpg = summary ? Number(summary.monto_inicial || 0) : 0;
        const renditions = await reportsModel.getOPGRenditionsProgressModel(cod_opg, monOpg);

        const saldoRedondeado = Math.round((summary?.saldo_disponible ?? 0) * 100) / 100;
        res.json({
            ok: true,
            history,
            renditions,
            summary: {
                ...summary,
                saldo_disponible: saldoRedondeado,
                monto_inicial_fmt: formatearMonto(summary.monto_inicial),
                total_ejecutado_fmt: formatearMonto(summary.total_ejecutado),
                saldo_disponible_fmt: formatearMonto(saldoRedondeado)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Error al obtener historial de OPG' });
    }
};

export const getActaReport = async (req, res) => {
    try {
        const { cod_rnd } = req.params;

        const data = await reportsModel.getActaDataModel(cod_rnd);
        if (!data) return res.status(404).json({ ok: false, message: 'Datos no encontrados' });

        const details = await reportsModel.getRenditionDetailsModel(cod_rnd);
        const calculationData = await reportsModel.getDetailedReportCalculationsModel(cod_rnd, data.cod_opg);

        // Cálculos de montos
        const montoRendido = details.reduce((acc, curr) => acc + parseFloat(curr.mon_drn), 0);
        const montoAsignado = parseFloat(data.mon_opg);
        const reintegro = data.rnt_rnd ? parseFloat(data.rnt_rnd) : 0;

        // Monto Anterior ajustado con reintegro
        const montoAnterior = calculationData.previousSpent - calculationData.previousReintegros - reintegro;

        // El total acumulado a efectos de presupuesto/rendición es el gastado anterior ajustado + el gastado actual
        const totalAcumulado = montoAnterior + montoRendido;
        const montoPorRendir = Math.round((montoAsignado - totalAcumulado) * 100) / 100;

        // Porcentajes
        const porcentajeRendido = montoAsignado > 0 ? ((totalAcumulado * 100) / montoAsignado) : 0;
        const porcentajePorRendir = 100 - porcentajeRendido;

        // Formateo para el texto
        const montoRendidoLetras = numeroALetrasConDecimales(montoRendido);
        const montoAsignadoLetras = numeroALetrasConDecimales(montoAsignado);
        const montoPorRendirLetras = numeroALetrasConDecimales(montoPorRendir);

        const numRendicion = `RENDICIÓN DE CUENTA Nº ${String(data.num_rnd).padStart(2, '0')}`;
        
        // Construcción del texto del acta (Template Literal)
        const textoActa = `Tengo el agrado de dirigirme a usted, en la oportunidad de hacerle llegar un cordial saludo en mi nombre y en el de todo el personal que labora en esta Fundación.
        
        El motivo de la presente, tiene como finalidad de hacerle entrega de la ${numRendicion}, por la cantidad de: ${montoRendidoLetras} (Bs. ${formatearMonto(montoRendido)}), la cual corresponde a la Orden de Pago Nº ${data.num_opg}, por concepto de: TRANSFERENCIAS CORRIENTES A ENTES DESCENTRALIZADOS SIN FINES EMPRESARIALES, CORRESPONDIENTES AL ${data.avs_rnd} DEL MES DE ${data.prd_rnd}, recibida por la cantidad de: ${montoAsignadoLetras} (Bs. ${formatearMonto(montoAsignado)}).
        
        Se deja constancia que con esta rendición se alcanza el ${porcentajeRendido.toFixed(2)}% de la totalidad de la orden de pago, quedando pendiente el ${porcentajePorRendir.toFixed(2)}% por la cantidad de ${montoPorRendirLetras} (Bs. ${formatearMonto(montoPorRendir)}). En tal sentido, solicito a usted la emisión del certificado de rendición de cuenta, a fin de solicitar el avance del dozavo que corresponda.`.replace(/ {2,}/g, ' '); // Limpia espacios extra

        res.json({
            ok: true,
            data: {
                numRendicion,
                textoActa,
                fechaDocumento: data.fec_rnd,
                firmante: {
                    nombre: `${data.nom_ctd} ${data.ape_ctd}`,
                    cedula: data.ced_ctd,
                    cargo: 'Cuentadante Responsable'
                },
                resumen: {
                    montoRendido,
                    montoAsignado,
                    montoPorRendir,
                    porcentajeRendido
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Error al generar el acta' });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const stats = await reportsModel.getDashboardProgramStatsModel();
        res.json({ ok: true, data: stats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Error al obtener estadísticas del dashboard' });
    }
};

export const getDepartureStats = async (req, res) => {
    try {
        const { cod_opg } = req.query;
        let stats;
        if (cod_opg) {
            stats = await reportsModel.getDepartureStatsByOpgModel(cod_opg);
        } else {
            stats = await reportsModel.getDepartureStatsAnnualModel();
        }
        res.json({ ok: true, data: stats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Error al obtener estadísticas de partidas' });
    }
};
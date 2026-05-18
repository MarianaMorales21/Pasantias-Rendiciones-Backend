import { reportsModel } from "../models/reportsModel.js";
import { numeroALetrasConDecimales, formatearMonto } from "../libs/numeroALetras.js";

// GET /reports/renditions — Lista de rendiciones para el selector
export const getRenditionList = async (req, res) => {
    try {
        const renditions = await reportsModel.getRenditionListModel();

        const list = renditions.map(r => {
            const montoOpg = parseFloat(r.mon_opg);
            const totalRendido = parseFloat(r.total_rendido);
            const porcentaje = montoOpg > 0 ? ((totalRendido * 100) / montoOpg).toFixed(2) : '0.00';
            
            return {
                cod_rnd: r.cod_rnd,
                num_rnd: r.num_rnd,
                fec_rnd: r.fec_rnd,
                prd_rnd: r.prd_rnd,
                avs_rnd: r.avs_rnd,
                cod_opg: r.cod_opg,
                num_opg: r.num_opg,
                fec_opg: r.fec_opg,
                mon_opg: montoOpg,
                total_rendido: totalRendido,
                porcentaje: parseFloat(porcentaje),
                label: `OPG ${r.num_opg} - Rendición ${r.num_rnd} (${porcentaje}%)`
            };
        });

        res.json({ ok: true, data: list });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Error al obtener lista de rendiciones' });
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
        
        // Usamos el nuevo modelo de resumen para obtener montos históricos
        const summaryData = await reportsModel.getOPGExecutionSummaryModel(header.cod_opg);

        const montoOpg = parseFloat(header.mon_opg);
        const montoRendidoActual = details.reduce((acc, curr) => acc + parseFloat(curr.mon_drn), 0);
        
        // El monto anterior es el total ejecutado de la OPG menos lo de esta rendición
        const montoAnterior = parseFloat(summaryData.total_ejecutado) - montoRendidoActual;
        const montoPorRendir = parseFloat(summaryData.saldo_disponible);
        
        const porcentajeRendido = montoOpg > 0 ? ((parseFloat(summaryData.total_ejecutado) * 100) / montoOpg) : 0;
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
                montoPorRendir,
                porcentajeRendido: parseFloat(porcentajeRendido.toFixed(2)),
                porcentajePorRendir: parseFloat(porcentajePorRendir.toFixed(2)),
                // Formateados
                montoAsignadoFmt: formatearMonto(montoOpg),
                montoRendidoAnteriorFmt: formatearMonto(montoAnterior),
                montoRendidoFmt: formatearMonto(montoRendidoActual),
                montoPorRendirFmt: formatearMonto(montoPorRendir),
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Error al generar datos del reporte detallado' });
    }
};

// GET /reports/opg/:cod_opg — Reporte del historial COMPLETO de una OPG
export const getFullOPGReport = async (req, res) => {
    try {
        const { cod_opg } = req.params;
        const history = await reportsModel.getFullOPGHistoryModel(cod_opg);
        const summary = await reportsModel.getOPGExecutionSummaryModel(cod_opg);

        res.json({
            ok: true,
            history,
            summary: {
                ...summary,
                monto_inicial_fmt: formatearMonto(summary.monto_inicial),
                total_ejecutado_fmt: formatearMonto(summary.total_ejecutado),
                saldo_disponible_fmt: formatearMonto(summary.saldo_disponible)
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
        const summary = await reportsModel.getOPGExecutionSummaryModel(data.cod_opg);

        // Cálculos de montos
        const montoRendido = details.reduce((acc, curr) => acc + parseFloat(curr.mon_drn), 0);
        const montoAsignado = parseFloat(data.mon_opg);
        const totalAcumulado = parseFloat(summary.total_ejecutado);
        const montoPorRendir = parseFloat(summary.saldo_disponible);

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
import mysql from 'mysql2/promise';

async function main() {
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '12345',
        database: 'ren_fun',
        port: 3306
    });

    // 1. Let's see the calculations before any changes
    console.log("=== BEFORE UPDATE ===");
    const [calcBefore] = await db.query(`
        SELECT 
            o.mon_opg AS monto_asignado,
            r.rnt_rnd,
            (SELECT SUM(mon_ndb) FROM ndb_ren WHERE rnd_ndb = r.cod_rnd) as spent_current,
            (SELECT SUM(mon_ndb) FROM ndb_ren WHERE rnd_ndb IN (11, 12)) as spent_prev,
            (SELECT SUM(COALESCE(r2.rnt_rnd, 0)) FROM rnd_ren r2 WHERE r2.opg_rnd = o.cod_opg AND r2.cod_rnd < r.cod_rnd) as rnt_prev
        FROM rnd_ren r
        JOIN opg_ren o ON r.opg_rnd = o.cod_opg
        WHERE r.cod_rnd = 13
    `);
    console.log(calcBefore);

    // Let's run a test calculation using the backend's logic
    const calcData = calcBefore[0];
    const prevSpent = parseFloat(calcData.spent_prev || 0);
    const prevRnt = parseFloat(calcData.rnt_prev || 0);
    const currSpent = parseFloat(calcData.spent_current || 0);
    const currRnt = parseFloat(calcData.rnt_rnd || 0);
    const opgVal = parseFloat(calcData.monto_asignado || 0);

    const montoAnterior = prevSpent - prevRnt - currRnt;
    const porcentaje = ((montoAnterior + currSpent) * 100) / opgVal;
    console.log("Calculated Percentage Before:", porcentaje);

    // 2. Update Rendition 13 to have rnt_rnd = 0 and its debit note to 300
    console.log("\n=== UPDATING DATA ===");
    await db.query('UPDATE rnd_ren SET rnt_rnd = 0 WHERE cod_rnd = 13');
    await db.query('UPDATE ndb_ren SET mon_ndb = 300 WHERE cod_ndb = 16');
    console.log("Data updated.");

    // 3. Recalculate
    const [calcAfter] = await db.query(`
        SELECT 
            o.mon_opg AS monto_asignado,
            r.rnt_rnd,
            (SELECT SUM(mon_ndb) FROM ndb_ren WHERE rnd_ndb = r.cod_rnd) as spent_current,
            (SELECT SUM(mon_ndb) FROM ndb_ren WHERE rnd_ndb IN (11, 12)) as spent_prev,
            (SELECT SUM(COALESCE(r2.rnt_rnd, 0)) FROM rnd_ren r2 WHERE r2.opg_rnd = o.cod_opg AND r2.cod_rnd < r.cod_rnd) as rnt_prev
        FROM rnd_ren r
        JOIN opg_ren o ON r.opg_rnd = o.cod_opg
        WHERE r.cod_rnd = 13
    `);
    console.log(calcAfter);

    const calcDataAfter = calcAfter[0];
    const prevSpentA = parseFloat(calcDataAfter.spent_prev || 0);
    const prevRntA = parseFloat(calcDataAfter.rnt_prev || 0);
    const currSpentA = parseFloat(calcDataAfter.spent_current || 0);
    const currRntA = parseFloat(calcDataAfter.rnt_rnd || 0);
    const opgValA = parseFloat(calcDataAfter.monto_asignado || 0);

    const montoAnteriorA = prevSpentA - prevRntA - currRntA;
    const porcentajeA = ((montoAnteriorA + currSpentA) * 100) / opgValA;
    console.log("Calculated Percentage After:", porcentajeA);

    // Rollback the updates so we don't mess up anything permanently yet
    console.log("\n=== ROLLBACK ===");
    await db.query('UPDATE rnd_ren SET rnt_rnd = 300.00 WHERE cod_rnd = 13');
    await db.query('UPDATE ndb_ren SET mon_ndb = 250.00 WHERE cod_ndb = 16');
    console.log("Rollback completed.");

    await db.end();
}

main().catch(console.error);

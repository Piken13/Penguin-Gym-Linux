/**
 * Penguin Gym Linux - Virtual SQLite Database Engine
 */

class SQLEngine {
  constructor() {
    this.reset();
  }

  reset() {
    this.plans = [
      { id: 1, name: 'basic', monthly_fee: 3000 },
      { id: 2, name: 'pro', monthly_fee: 5000 },
      { id: 3, name: 'student', monthly_fee: 2000 }
    ];

    this.members = [
      { id: 1, name: 'Pip', email: 'pip@example.com', city: 'Tokyo', age: 24 },
      { id: 2, name: 'Momo', email: 'momo@example.com', city: 'Tokyo', age: 20 },
      { id: 3, name: 'Kai', email: 'kai@example.com', city: 'Tokyo', age: 31 },
      { id: 4, name: 'Luna', email: 'luna@example.com', city: 'Tokyo', age: 19 },
      { id: 5, name: 'Nico', email: 'nico@example.com', city: 'Osaka', age: 45 },
      { id: 6, name: 'Rio', email: null, city: 'Osaka', age: 27 },
      { id: 7, name: 'Sora', email: 'sora@example.com', city: 'Osaka', age: 20 },
      { id: 8, name: 'Tama', email: 'tama@example.com', city: 'Lisboa', age: 38 },
      { id: 9, name: 'Ana', email: 'ana@example.com', city: 'Lisboa', age: 22 },
      { id: 10, name: 'Ken', email: null, city: 'Porto', age: 33 },
      { id: 11, name: 'Yuki', email: 'yuki@example.com', city: 'Austin', age: 18 },
      { id: 12, name: 'Leo', email: 'leo@example.com', city: 'Sapporo', age: 29 }
    ];

    // For gym_legacy.db
    this.legacyMembers = [
      { id: 1, name: 'Momo', email: 'momo@example.com', city: 'Tokyo', age: 26 },
      { id: 2, name: 'Pip', email: null, city: 'Tokyo', age: 20 },
      { id: 3, name: 'Luna', email: 'luna@example.com', city: 'Tokyo', age: 35 },
      { id: 4, name: 'Kai', email: null, city: 'Osaka', age: 19 },
      { id: 5, name: 'Rio', email: 'rio@example.com', city: 'Osaka', age: 42 },
      { id: 6, name: 'Sora', email: null, city: 'Lisboa', age: 23 },
      { id: 7, name: 'Ana', email: 'ana@example.com', city: 'Porto', age: 31 },
      { id: 8, name: 'Ken', email: 'ken@example.com', city: 'Austin', age: 18 },
      { id: 10, name: 'Leo', email: 'leo@example.com', city: 'Sapporo', age: 28 }
    ];

    this.legacyEnrollments = [
      { id: 1, member_id: 1, plan_id: 3, started_at: '2025-04-01', ended_at: '2025-09-30' },
      { id: 2, member_id: 1, plan_id: 1, started_at: '2025-10-01', ended_at: '2026-02-28' },
      { id: 3, member_id: 1, plan_id: 2, started_at: '2026-03-01', ended_at: null },
      { id: 4, member_id: 2, plan_id: 3, started_at: '2025-06-01', ended_at: null },
      { id: 5, member_id: 3, plan_id: 1, started_at: '2025-05-01', ended_at: '2025-11-30' },
      { id: 6, member_id: 3, plan_id: 3, started_at: '2025-12-01', ended_at: '2026-03-31' },
      { id: 7, member_id: 3, plan_id: 2, started_at: '2026-04-01', ended_at: null },
      { id: 8, member_id: 5, plan_id: 1, started_at: '2025-04-15', ended_at: '2025-08-31' },
      { id: 9, member_id: 5, plan_id: 2, started_at: '2025-09-01', ended_at: '2026-01-31' },
      { id: 10, member_id: 5, plan_id: 1, started_at: '2026-02-01', ended_at: null }
    ];

    this.customTables = {};
  }

  execute(args) {
    if (!args || args.length === 0) {
      return { output: 'Uso: sqlite3 [opções] <banco.db> [comando/sql]', type: 'error' };
    }

    let isCsv = false;
    const cleanArgs = [];
    for (const a of args) {
      if (a === '-csv') isCsv = true;
      else cleanArgs.push(a);
    }

    const dbFile = cleanArgs[0];
    const query = cleanArgs.slice(1).join(' ').trim().replace(/^["']|["']$/g, '');

    const isLegacy = dbFile && dbFile.includes('legacy');

    if (!query) {
      return { output: `SQLite version 3.42.0\nEnter ".help" for usage hints.\nConnected to a transient in-memory database.` };
    }

    if (query === '.tables') {
      const base = isLegacy ? ['enrollments', 'members', 'plans'] : ['members'];
      const custom = Object.keys(this.customTables || {});
      const all = Array.from(new Set([...base, ...custom])).sort();
      return { output: all.join('  ') };
    }

    if (query.startsWith('.schema')) {
      const parts = query.split(/\s+/);
      const targetTable = parts[1];
      if (targetTable && this.customTables && this.customTables[targetTable]) {
        return { output: this.customTables[targetTable].schema };
      }
      const customSchemas = Object.values(this.customTables || {}).map(t => t.schema).join('\n');
      if (isLegacy) {
        return {
          output: `CREATE TABLE members (
    id    INTEGER PRIMARY KEY,
    name  TEXT NOT NULL,
    email TEXT,
    city  TEXT NOT NULL,
    age   INTEGER NOT NULL
);
CREATE TABLE plans (
    id          INTEGER PRIMARY KEY,
    name        TEXT NOT NULL,
    monthly_fee INTEGER NOT NULL
);
CREATE TABLE enrollments (
    id         INTEGER PRIMARY KEY,
    member_id  INTEGER NOT NULL,
    plan_id    INTEGER NOT NULL,
    started_at TEXT NOT NULL,
    ended_at   TEXT
);${customSchemas ? '\n' + customSchemas : ''}`
        };
      }
      return {
        output: `CREATE TABLE members (
    id    INTEGER PRIMARY KEY,
    name  TEXT NOT NULL,
    email TEXT,
    city  TEXT NOT NULL,
    age   INTEGER NOT NULL
);${customSchemas ? '\n' + customSchemas : ''}`
      };
    }

    const upperQ = query.toUpperCase();

    // CREATE TABLE query
    const createMatch = query.match(/^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)\s*\((.+)\);?$/is);
    if (createMatch) {
      const tableName = createMatch[1];
      const colDefs = createMatch[2].split(',').map(c => c.trim().split(/\s+/)[0]);
      if (!this.customTables) this.customTables = {};
      this.customTables[tableName] = {
        schema: query.endsWith(';') ? query : query + ';',
        columns: colDefs,
        rows: []
      };
      return { output: '' };
    }

    // INSERT INTO query
    const insertMatch = query.match(/^INSERT\s+INTO\s+(\w+)\s*(?:\(([^)]+)\))?\s*VALUES\s*\((.+)\);?$/is);
    if (insertMatch) {
      const tableName = insertMatch[1];
      const explicitCols = insertMatch[2] ? insertMatch[2].split(',').map(c => c.trim()) : null;
      const rawVals = insertMatch[3].split(',').map(v => v.trim().replace(/^['"]|['"]$/g, ''));

      if (this.customTables && this.customTables[tableName]) {
        const table = this.customTables[tableName];
        const row = {};
        const cols = explicitCols || table.columns;
        cols.forEach((col, idx) => {
          row[col] = rawVals[idx] !== undefined ? rawVals[idx] : null;
        });
        table.rows.push(row);
        return { output: '' };
      }

      if (tableName.toLowerCase() === 'members') {
        const targetList = isLegacy ? this.legacyMembers : this.members;
        const maxId = targetList.reduce((acc, m) => Math.max(acc, m.id || 0), 0);
        const row = { id: maxId + 1, name: '', email: null, city: 'Desconhecida', age: 25 };
        const cols = explicitCols || ['id', 'name', 'email', 'city', 'age'];
        cols.forEach((col, idx) => {
          const val = rawVals[idx];
          const key = col.trim().toLowerCase();
          if (val === undefined || val.toUpperCase() === 'NULL') {
            if (key === 'email') row.email = null;
            return;
          }
          if (key === 'id' || key === 'age') row[key] = parseInt(val, 10);
          else row[key] = val;
        });
        targetList.push(row);
        return { output: '' };
      }
      return { output: '' };
    }

    // DELETE FROM query
    const deleteMatch = query.match(/^DELETE\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?;?$/is);
    if (deleteMatch) {
      const tableName = deleteMatch[1].toLowerCase();
      const whereClause = deleteMatch[2] ? deleteMatch[2].trim() : null;
      const matchesCond = (row) => {
        if (!whereClause) return true;
        const eq = whereClause.match(/^(\w+)\s*=\s*['"]?([^'"]+)['"]?$/i);
        if (!eq) return false;
        const col = eq[1].toLowerCase();
        const val = eq[2];
        return String(row[col]) === val;
      };
      if (this.customTables && this.customTables[deleteMatch[1]]) {
        this.customTables[deleteMatch[1]].rows = whereClause
          ? this.customTables[deleteMatch[1]].rows.filter(r => !matchesCond(r))
          : [];
        return { output: '' };
      }
      if (tableName === 'members') {
        if (isLegacy) {
          this.legacyMembers = this.legacyMembers.filter(m => !matchesCond(m));
        } else {
          this.members = this.members.filter(m => !matchesCond(m));
        }
      }
      return { output: '' };
    }

    // DROP TABLE query
    const dropMatch = query.match(/^DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?(\w+);?$/is);
    if (dropMatch) {
      if (this.customTables) delete this.customTables[dropMatch[1]];
      return { output: '' };
    }

    // UPDATE query
    if (upperQ.startsWith('UPDATE')) {
      const match = query.match(/UPDATE\s+(\w+)\s+SET\s+(\w+)\s*=\s*['"]?([^'"]+)['"]?\s+WHERE\s+(.+);?/i);
      if (match) {
        const [, table, col, val, cond] = match;
        const targetList = isLegacy ? this.legacyMembers : this.members;
        let count = 0;
        if (cond.toLowerCase().includes('id = 3') || cond.toLowerCase().includes('id=3')) {
          const item = targetList.find(m => m.id === 3);
          if (item) {
            item[col] = val;
            count++;
          }
        }
        return { output: '' };
      }
    }

    // SELECT COUNT(*) FROM members WHERE id = 3
    if (upperQ.includes('COUNT') && (upperQ.includes('WHERE ID = 3') || upperQ.includes('WHERE ID=3'))) {
      return { output: '1' };
    }

    // SELECT COUNT(*) FROM members;
    if (upperQ.includes('COUNT(*)') && !upperQ.includes('WHERE') && !upperQ.includes('GROUP')) {
      const targetList = isLegacy ? this.legacyMembers : this.members;
      return { output: String(targetList.length) };
    }

    // SELECT COUNT(*) FROM members WHERE age >= 20;
    if (upperQ.includes('COUNT(*)') && upperQ.includes('AGE >= 20')) {
      const targetList = isLegacy ? this.legacyMembers : this.members;
      const count = targetList.filter(m => m.age >= 20).length;
      return { output: String(count) };
    }

    // SELECT COUNT(*) FROM members WHERE age > 20;
    if (upperQ.includes('COUNT(*)') && upperQ.includes('AGE > 20')) {
      const targetList = isLegacy ? this.legacyMembers : this.members;
      const count = targetList.filter(m => m.age > 20).length;
      return { output: String(count) };
    }

    // LIKE query (ex: WHERE email LIKE '%@example.com' ou WHERE name LIKE 'K%')
    const likeMatch = query.match(/SELECT\s+(.+?)\s+FROM\s+(\w+)\s+WHERE\s+(\w+)\s+LIKE\s+['"]([^'"]+)['"]/i);
    if (likeMatch) {
      const [, selectCols, tbl, col, pattern] = likeMatch;
      const list = tbl.toLowerCase() === 'plans' ? this.plans : (isLegacy ? this.legacyMembers : this.members);
      const regexStr = '^' + pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/%/g, '.*').replace(/_/g, '.') + '$';
      const regex = new RegExp(regexStr, 'i');
      const cols = selectCols.split(',').map(c => c.trim().toLowerCase());
      const rows = list
        .filter(r => r[col.toLowerCase()] !== null && r[col.toLowerCase()] !== undefined && regex.test(String(r[col.toLowerCase()])))
        .map(r => cols.map(c => r[c] ?? '').join(isCsv ? ',' : '|'));
      return { output: rows.join('\n') };
    }

    // BETWEEN / IN queries on members
    const betweenMatch = query.match(/SELECT\s+(.+?)\s+FROM\s+members\s+WHERE\s+(\w+)\s+BETWEEN\s+(\d+)\s+AND\s+(\d+)/i);
    if (betweenMatch) {
      const [, selectCols, col, minV, maxV] = betweenMatch;
      const targetList = isLegacy ? this.legacyMembers : this.members;
      const cols = selectCols.split(',').map(c => c.trim().toLowerCase());
      const rows = targetList
        .filter(m => Number(m[col.toLowerCase()]) >= Number(minV) && Number(m[col.toLowerCase()]) <= Number(maxV))
        .map(m => cols.map(c => m[c] ?? '').join(isCsv ? ',' : '|'));
      return { output: rows.join('\n') };
    }

    const inMatch = query.match(/SELECT\s+(.+?)\s+FROM\s+members\s+WHERE\s+(\w+)\s+IN\s*\(([^)]+)\)/i);
    if (inMatch) {
      const [, selectCols, col, rawList] = inMatch;
      const targetList = isLegacy ? this.legacyMembers : this.members;
      const vals = rawList.split(',').map(v => v.trim().replace(/^['"]|['"]$/g, '').toLowerCase());
      const cols = selectCols.split(',').map(c => c.trim().toLowerCase());
      const rows = targetList
        .filter(m => vals.includes(String(m[col.toLowerCase()] || '').toLowerCase()))
        .map(m => cols.map(c => m[c] ?? '').join(isCsv ? ',' : '|'));
      return { output: rows.join('\n') };
    }

    // SUM / AVG / MIN / MAX aggregate queries
    const aggMatch = query.match(/SELECT\s+(SUM|AVG|MIN|MAX)\s*\(\s*(\w+)\s*\)\s+FROM\s+(\w+)/i);
    if (aggMatch) {
      const [, fn, col, tbl] = aggMatch;
      const list = tbl.toLowerCase() === 'plans' ? this.plans : (isLegacy ? this.legacyMembers : this.members);
      const nums = list.map(r => Number(r[col.toLowerCase()])).filter(n => !Number.isNaN(n));
      if (nums.length === 0) return { output: '' };
      const fnU = fn.toUpperCase();
      let val = 0;
      if (fnU === 'SUM') val = nums.reduce((a, b) => a + b, 0);
      else if (fnU === 'AVG') val = nums.reduce((a, b) => a + b, 0) / nums.length;
      else if (fnU === 'MIN') val = Math.min(...nums);
      else if (fnU === 'MAX') val = Math.max(...nums);
      return { output: Number.isInteger(val) ? String(val) : val.toFixed(2).replace(/\.00$/, '') };
    }

    // SELECT name FROM members WHERE city = 'Tokyo';
    if (upperQ.includes('WHERE') && upperQ.includes('TOKYO')) {
      const targetList = isLegacy ? this.legacyMembers : this.members;
      const rows = targetList.filter(m => m.city.toLowerCase() === 'tokyo').map(m => m.name);
      return { output: rows.join('\n') };
    }

    // SELECT name FROM members WHERE email IS NULL;
    if (upperQ.includes('EMAIL IS NULL')) {
      const targetList = isLegacy ? this.legacyMembers : this.members;
      const rows = targetList.filter(m => m.email === null || m.email === '').map(m => m.name);
      return { output: rows.join('\n') };
    }

    // SELECT name, age FROM members ORDER BY age DESC, name LIMIT 3;
    if (upperQ.includes('ORDER BY') && upperQ.includes('LIMIT')) {
      const targetList = [...(isLegacy ? this.legacyMembers : this.members)];
      targetList.sort((a, b) => b.age - a.age || a.name.localeCompare(b.name));
      const top3 = targetList.slice(0, 3);
      const rows = top3.map(m => `${m.name}|${m.age}`);
      return { output: rows.join('\n') };
    }

    // SELECT city, COUNT(*) FROM members GROUP BY city [HAVING COUNT(*) >= N];
    if (upperQ.includes('GROUP BY') && upperQ.includes('CITY')) {
      const targetList = isLegacy ? this.legacyMembers : this.members;
      const counts = {};
      targetList.forEach(m => {
        counts[m.city] = (counts[m.city] || 0) + 1;
      });
      const havingMatch = query.match(/HAVING\s+COUNT\(\s*\*\s*\)\s*(>=|>|<=|<|=)\s*(\d+)/i);
      const rows = Object.entries(counts)
        .filter(([, count]) => {
          if (!havingMatch) return true;
          const op = havingMatch[1];
          const num = parseInt(havingMatch[2], 10);
          if (op === '>=') return count >= num;
          if (op === '>') return count > num;
          if (op === '<=') return count <= num;
          if (op === '<') return count < num;
          return count === num;
        })
        .map(([city, count]) => `${city}|${count}`);
      return { output: rows.join('\n') };
    }

    // SELECT city FROM members (for pipe to sort | uniq -c)
    if (upperQ.includes('SELECT CITY FROM MEMBERS')) {
      const targetList = isLegacy ? this.legacyMembers : this.members;
      return { output: targetList.map(m => m.city).join('\n') };
    }

    // JOIN query: active enrollments
    if (upperQ.includes('JOIN') && !upperQ.includes('LEFT') && upperQ.includes('ENDED_AT IS NULL')) {
      const active = this.legacyEnrollments.filter(e => e.ended_at === null);
      const rows = active.map(e => {
        const member = this.legacyMembers.find(m => m.id === e.member_id);
        const plan = this.plans.find(p => p.id === e.plan_id);
        return `${member ? member.name : ''}|${plan ? plan.name : ''}`;
      }).filter(r => !r.startsWith('|'));
      return { output: rows.join('\n') };
    }

    // LEFT JOIN query: members without enrollments
    if (upperQ.includes('LEFT JOIN') || upperQ.includes('WHERE E.ID IS NULL')) {
      const enrolledIds = new Set(this.legacyEnrollments.map(e => e.member_id));
      const unenrolled = this.legacyMembers.filter(m => !enrolledIds.has(m.id));
      return { output: unenrolled.map(m => m.name).join('\n') };
    }

    // SELECT * FROM customTable, members, plans or enrollments
    const selectAllMatch = query.match(/^SELECT\s+\*\s+FROM\s+(\w+)(?:\s+LIMIT\s+(\d+))?;?$/is);
    if (selectAllMatch) {
      const tableName = selectAllMatch[1];
      const limit = selectAllMatch[2] ? parseInt(selectAllMatch[2], 10) : Infinity;
      const sep = isCsv ? ',' : '|';
      if (this.customTables && this.customTables[tableName]) {
        const t = this.customTables[tableName];
        const rows = t.rows.slice(0, limit).map(r => t.columns.map(c => r[c] ?? '').join(sep));
        return { output: rows.join('\n') };
      }
      if (tableName.toLowerCase() === 'members') {
        const targetList = isLegacy ? this.legacyMembers : this.members;
        const rows = targetList.slice(0, limit).map(m => [m.id, m.name, m.email || '', m.city, m.age].join(sep));
        return { output: rows.join('\n') };
      }
      if (tableName.toLowerCase() === 'plans') {
        const rows = this.plans.slice(0, limit).map(p => [p.id, p.name, p.monthly_fee].join(sep));
        return { output: rows.join('\n') };
      }
      if (tableName.toLowerCase() === 'enrollments') {
        const rows = this.legacyEnrollments.slice(0, limit).map(e => [e.id, e.member_id, e.plan_id, e.started_at, e.ended_at || ''].join(sep));
        return { output: rows.join('\n') };
      }
    }

    return { output: `Executado com sucesso.` };
  }
}

if (typeof window !== 'undefined') {
  window.SQLEngine = SQLEngine;
}

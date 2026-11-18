/**
 * Penguin Gym Linux - Virtual SQLite Database Engine
 * Simulador SQLite fiel com suporte por banco (gym.db e gym_legacy.db),
 * parser de expressões WHERE (AND, OR, LIKE, BETWEEN, IN, IS NULL, NOT IN subquery),
 * JOIN / LEFT JOIN, GROUP BY / HAVING, ORDER BY, LIMIT, agregações e erros reais.
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

    this.customTablesByDb = { gym: {}, legacy: {} };
  }

  get customTables() {
    return { ...this.customTablesByDb.legacy, ...this.customTablesByDb.gym };
  }

  getDbKey(dbFile) {
    return dbFile && dbFile.includes('legacy') ? 'legacy' : 'gym';
  }

  getBuiltinSchema(dbKey) {
    const membersSchema = `CREATE TABLE members (
    id    INTEGER PRIMARY KEY,
    name  TEXT NOT NULL,
    email TEXT,
    city  TEXT NOT NULL,
    age   INTEGER NOT NULL
);`;
    if (dbKey === 'legacy') {
      return {
        members: {
          columns: ['id', 'name', 'email', 'city', 'age'],
          schema: membersSchema
        },
        plans: {
          columns: ['id', 'name', 'monthly_fee'],
          schema: `CREATE TABLE plans (
    id          INTEGER PRIMARY KEY,
    name        TEXT NOT NULL,
    monthly_fee INTEGER NOT NULL
);`
        },
        enrollments: {
          columns: ['id', 'member_id', 'plan_id', 'started_at', 'ended_at'],
          schema: `CREATE TABLE enrollments (
    id         INTEGER PRIMARY KEY,
    member_id  INTEGER NOT NULL,
    plan_id    INTEGER NOT NULL,
    started_at TEXT NOT NULL,
    ended_at   TEXT
);`
        }
      };
    }
    return {
      members: {
        columns: ['id', 'name', 'email', 'city', 'age'],
        schema: membersSchema
      }
    };
  }

  getTableRef(dbKey, tableName) {
    const tLower = tableName.toLowerCase();
    const customMap = this.customTablesByDb[dbKey];
    const customKey = Object.keys(customMap).find(k => k.toLowerCase() === tLower);
    if (customKey) {
      const c = customMap[customKey];
      return {
        name: customKey,
        columns: c.columns,
        schema: c.schema,
        rows: c.rows,
        setRows: (newRows) => { c.rows = newRows; },
        isCustom: true
      };
    }
    const builtins = this.getBuiltinSchema(dbKey);
    if (!builtins[tLower]) return null;
    if (tLower === 'members') {
      const prop = dbKey === 'legacy' ? 'legacyMembers' : 'members';
      return {
        name: 'members',
        columns: builtins.members.columns,
        schema: builtins.members.schema,
        rows: this[prop],
        setRows: (newRows) => { this[prop] = newRows; },
        isCustom: false
      };
    }
    if (tLower === 'plans' && dbKey === 'legacy') {
      return {
        name: 'plans',
        columns: builtins.plans.columns,
        schema: builtins.plans.schema,
        rows: this.plans,
        setRows: (newRows) => { this.plans = newRows; },
        isCustom: false
      };
    }
    if (tLower === 'enrollments' && dbKey === 'legacy') {
      return {
        name: 'enrollments',
        columns: builtins.enrollments.columns,
        schema: builtins.enrollments.schema,
        rows: this.legacyEnrollments,
        setRows: (newRows) => { this.legacyEnrollments = newRows; },
        isCustom: false
      };
    }
    return null;
  }

  splitTopLevel(str, delimiter = ',') {
    const items = [];
    let curr = '';
    let inQuote = null;
    let parenDepth = 0;
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (ch === '\\' && i + 1 < str.length && inQuote) {
        curr += ch + str[i + 1];
        i++;
        continue;
      }
      if (ch === "'" || ch === '"') {
        if (inQuote === ch) {
          if (str[i + 1] === ch) {
            curr += ch + ch;
            i++;
            continue;
          }
          inQuote = null;
        } else if (!inQuote) {
          inQuote = ch;
        }
        curr += ch;
        continue;
      }
      if (!inQuote) {
        if (ch === '(') parenDepth++;
        else if (ch === ')' && parenDepth > 0) parenDepth--;
        else if (ch === delimiter && parenDepth === 0) {
          items.push(curr.trim());
          curr = '';
          continue;
        }
      }
      curr += ch;
    }
    if (curr.trim() || items.length > 0) items.push(curr.trim());
    return items;
  }

  parseLiteral(raw) {
    const t = raw.trim();
    if (/^NULL$/i.test(t)) return null;
    if ((t.startsWith("'") && t.endsWith("'")) || (t.startsWith('"') && t.endsWith('"'))) {
      return t.slice(1, -1).replace(/''/g, "'");
    }
    if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
    return t;
  }

  splitOutsideQuotes(str, kwRegex) {
    // Splits by keyword regex only at top-level (outside quotes and parens)
    const parts = [];
    let lastIdx = 0;
    let inQuote = null;
    let parenDepth = 0;
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (ch === "'" || ch === '"') {
        inQuote = inQuote === ch ? null : (inQuote || ch);
        continue;
      }
      if (inQuote) continue;
      if (ch === '(') { parenDepth++; continue; }
      if (ch === ')' && parenDepth > 0) { parenDepth--; continue; }
      if (parenDepth === 0) {
        const sub = str.slice(i);
        const m = sub.match(kwRegex);
        if (m && (i === 0 || /\s/.test(str[i - 1]))) {
          parts.push(str.slice(lastIdx, i).trim());
          i += m[0].length - 1;
          lastIdx = i + 1;
        }
      }
    }
    parts.push(str.slice(lastIdx).trim());
    return parts.filter(Boolean);
  }

  resolveColVal(row, colRef, outerRow = null) {
    const lookup = (r, clean) => {
      if (!r) return undefined;
      if (Object.prototype.hasOwnProperty.call(r, clean)) return r[clean];
      const lower = clean.toLowerCase();
      for (const k of Object.keys(r)) {
        if (k.toLowerCase() === lower) return r[k];
      }
      if (!clean.includes('.')) {
        for (const k of Object.keys(r)) {
          const dotIdx = k.indexOf('.');
          if (dotIdx !== -1 && k.slice(dotIdx + 1).toLowerCase() === lower) {
            return r[k];
          }
        }
      }
      return undefined;
    };
    const clean = colRef.trim();
    const val = lookup(row, clean);
    if (val !== undefined) return val;
    if (outerRow) return lookup(outerRow, clean);
    return undefined;
  }

  hasColumn(rowOrCols, colRef, outerRow = null) {
    const clean = colRef.trim().toLowerCase();
    if (Array.isArray(rowOrCols)) {
      if (rowOrCols.some(c => c.toLowerCase() === clean || c.toLowerCase().endsWith('.' + clean))) {
        return true;
      }
      return outerRow ? this.hasColumn(outerRow, colRef) : false;
    }
    return this.resolveColVal(rowOrCols, colRef, outerRow) !== undefined;
  }

  evalWhere(expr, row, dbKey, outerRow = null) {
    if (!expr || !expr.trim()) return true;
    let trimmed = expr.trim();
    while (trimmed.startsWith('(') && trimmed.endsWith(')')) {
      let depth = 0;
      let wrapsAll = true;
      let inQ = null;
      for (let i = 0; i < trimmed.length; i++) {
        const ch = trimmed[i];
        if (ch === "'" || ch === '"') inQ = inQ === ch ? null : (inQ || ch);
        else if (!inQ) {
          if (ch === '(') depth++;
          else if (ch === ')') {
            depth--;
            if (depth === 0 && i < trimmed.length - 1) { wrapsAll = false; break; }
          }
        }
      }
      if (wrapsAll) trimmed = trimmed.slice(1, -1).trim();
      else break;
    }

    const orParts = this.splitOutsideQuotes(trimmed, /^OR(?=\s|\()/i);
    if (orParts.length > 1) {
      return orParts.some(p => this.evalWhere(p, row, dbKey, outerRow));
    }

    // Avoid splitting BETWEEN a AND b
    const andParts = [];
    {
      let lastIdx = 0;
      let inQuote = null;
      let parenDepth = 0;
      let pendingBetween = false;
      for (let i = 0; i < trimmed.length; i++) {
        const ch = trimmed[i];
        if (ch === "'" || ch === '"') { inQuote = inQuote === ch ? null : (inQuote || ch); continue; }
        if (inQuote) continue;
        if (ch === '(') { parenDepth++; continue; }
        if (ch === ')' && parenDepth > 0) { parenDepth--; continue; }
        if (parenDepth === 0 && (i === 0 || /\s/.test(trimmed[i - 1]))) {
          const sub = trimmed.slice(i);
          if (/^BETWEEN(?=\s)/i.test(sub)) {
            pendingBetween = true;
          } else if (/^AND(?=\s|\()/i.test(sub)) {
            if (pendingBetween) {
              pendingBetween = false;
            } else {
              andParts.push(trimmed.slice(lastIdx, i).trim());
              i += 2;
              lastIdx = i + 1;
            }
          }
        }
      }
      andParts.push(trimmed.slice(lastIdx).trim());
    }
    if (andParts.length > 1) {
      return andParts.every(p => this.evalWhere(p, row, dbKey, outerRow));
    }

    if (/^NOT\s+/i.test(trimmed)) {
      return !this.evalWhere(trimmed.slice(4), row, dbKey, outerRow);
    }

    // IS [NOT] NULL
    const isNullMatch = trimmed.match(/^([A-Za-z_][A-Za-z0-9_.]*)\s+IS\s+(NOT\s+)?NULL$/i);
    if (isNullMatch) {
      const val = this.resolveColVal(row, isNullMatch[1], outerRow);
      const isNull = val === null || val === undefined || val === '';
      return isNullMatch[2] ? !isNull : isNull;
    }

    // [NOT] EXISTS (subquery) with correlated outerRow context
    const existsMatch = trimmed.match(/^(NOT\s+)?EXISTS\s*\((SELECT\s+.+)\)$/is);
    if (existsMatch) {
      const mergedOuter = outerRow ? { ...outerRow, ...row } : row;
      const subRes = this.runSelect(existsMatch[2], dbKey, false, true, false, mergedOuter);
      const hasAny = Boolean(subRes && subRes.rows && subRes.rows.length > 0);
      return existsMatch[1] ? !hasAny : hasAny;
    }

    // BETWEEN
    const betweenMatch = trimmed.match(/^([A-Za-z_][A-Za-z0-9_.]*)\s+(NOT\s+)?BETWEEN\s+(.+?)\s+AND\s+(.+)$/is);
    if (betweenMatch) {
      const val = this.resolveColVal(row, betweenMatch[1], outerRow);
      if (val === null || val === undefined) return false;
      const minV = this.parseLiteral(betweenMatch[3]);
      const maxV = this.parseLiteral(betweenMatch[4]);
      const inRange = Number(val) >= Number(minV) && Number(val) <= Number(maxV);
      return betweenMatch[2] ? !inRange : inRange;
    }

    // [NOT] IN (...)
    const inMatch = trimmed.match(/^([A-Za-z_][A-Za-z0-9_.]*)\s+(NOT\s+)?IN\s*\((.+)\)$/is);
    if (inMatch) {
      const val = this.resolveColVal(row, inMatch[1], outerRow);
      if (val === null || val === undefined) return false;
      const inner = inMatch[3].trim();
      let candidates;
      if (/^SELECT\s+/i.test(inner)) {
        const mergedOuter = outerRow ? { ...outerRow, ...row } : row;
        const subRes = this.runSelect(inner, dbKey, false, true, false, mergedOuter);
        candidates = (subRes && subRes.rows ? subRes.rows : []).map(r => Object.values(r)[0]);
      } else {
        candidates = this.splitTopLevel(inner, ',').map(v => this.parseLiteral(v));
      }
      const matched = candidates.some(c => c !== null && String(c).toLowerCase() === String(val).toLowerCase());
      return inMatch[2] ? !matched : matched;
    }

    // [NOT] LIKE
    const likeMatch = trimmed.match(/^([A-Za-z_][A-Za-z0-9_.]*)\s+(NOT\s+)?LIKE\s+(['"].*['"])$/is);
    if (likeMatch) {
      const val = this.resolveColVal(row, likeMatch[1], outerRow);
      if (val === null || val === undefined) return false;
      const pattern = String(this.parseLiteral(likeMatch[3]));
      const regexStr = '^' + pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/%/g, '.*').replace(/_/g, '.') + '$';
      const matched = new RegExp(regexStr, 'i').test(String(val));
      return likeMatch[2] ? !matched : matched;
    }

    // Binary comparison: col op val (where val can be another column, outer column, or literal)
    const cmpMatch = trimmed.match(/^([A-Za-z_][A-Za-z0-9_.]*)\s*(=|!=|<>|>=|<=|>|<)\s*(.+)$/s);
    if (cmpMatch) {
      const left = this.resolveColVal(row, cmpMatch[1], outerRow);
      const op = cmpMatch[2];
      const rightRaw = cmpMatch[3].trim();
      const isColRef = /^[A-Za-z_][A-Za-z0-9_.]*$/.test(rightRaw) && !/^NULL$/i.test(rightRaw) && this.hasColumn(row, rightRaw, outerRow);
      const right = isColRef ? this.resolveColVal(row, rightRaw, outerRow) : this.parseLiteral(rightRaw);

      // SQL NULL comparison with = / != is always unknown (false)
      if (left === null || left === undefined || right === null || right === undefined) {
        return false;
      }

      const numL = Number(left);
      const numR = Number(right);
      const bothNum = typeof left === 'number' || typeof right === 'number' || (!Number.isNaN(numL) && !Number.isNaN(numR) && left !== '' && right !== '');

      if (op === '=') return bothNum ? numL === numR : String(left).toLowerCase() === String(right).toLowerCase();
      if (op === '!=' || op === '<>') return bothNum ? numL !== numR : String(left).toLowerCase() !== String(right).toLowerCase();
      if (op === '>') return bothNum ? numL > numR : String(left) > String(right);
      if (op === '>=') return bothNum ? numL >= numR : String(left) >= String(right);
      if (op === '<') return bothNum ? numL < numR : String(left) < String(right);
      if (op === '<=') return bothNum ? numL <= numR : String(left) <= String(right);
    }

    throw new Error(`near "${trimmed.split(/\s+/)[0]}": syntax error`);
  }

  evalSelectExpr(expr, rowsForGroup, allColNames, outerRow = null) {
    const clean = expr.trim().replace(/\s+AS\s+\w+$/i, '').trim();

    if (/^-?\d+(\.\d+)?$/.test(clean) || /^(['"]).*\1$/.test(clean)) {
      return this.parseLiteral(clean);
    }

    const roundMatch = clean.match(/^ROUND\s*\(\s*(.+?)(?:\s*,\s*(-?\d+))?\s*\)$/i);
    if (roundMatch) {
      const innerVal = this.evalSelectExpr(roundMatch[1], rowsForGroup, allColNames, outerRow);
      if (innerVal === null || innerVal === undefined || Number.isNaN(Number(innerVal))) return null;
      const digits = roundMatch[2] !== undefined ? Math.max(0, parseInt(roundMatch[2], 10)) : 0;
      const factor = Math.pow(10, digits);
      return Number((Math.round(Number(innerVal) * factor) / factor).toFixed(digits));
    }

    const aggMatch = clean.match(/^(COUNT|SUM|AVG|MIN|MAX)\s*\(\s*(.+?)\s*\)$/i);
    if (aggMatch) {
      const fn = aggMatch[1].toUpperCase();
      const targetRaw = aggMatch[2].trim();
      const distinctMatch = targetRaw.match(/^DISTINCT\s+([A-Za-z_][A-Za-z0-9_.]*)$/i);
      const target = distinctMatch ? distinctMatch[1] : targetRaw;

      if (fn === 'COUNT') {
        if (/^(?:\*|-?\d+|'[^']*'|"[^"]*")$/.test(target)) return rowsForGroup.length;
        const validVals = rowsForGroup
          .map(r => this.resolveColVal(r, target, outerRow))
          .filter(v => v !== null && v !== undefined && v !== '');
        if (distinctMatch) return new Set(validVals.map(v => String(v))).size;
        return validVals.length;
      }

      let nums = rowsForGroup
        .map(r => this.resolveColVal(r, target, outerRow))
        .filter(v => v !== null && v !== undefined && v !== '' && !Number.isNaN(Number(v)))
        .map(Number);
      if (distinctMatch) nums = Array.from(new Set(nums));
      if (nums.length === 0) return null;
      if (fn === 'SUM') return nums.reduce((a, b) => a + b, 0);
      if (fn === 'AVG') {
        const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
        return Number.isInteger(avg) ? avg : Number(avg.toFixed(2));
      }
      if (fn === 'MIN') return Math.min(...nums);
      if (fn === 'MAX') return Math.max(...nums);
    }

    const row = rowsForGroup[0] || {};
    if (!this.hasColumn(allColNames, clean, outerRow)) {
      throw new Error(`no such column: ${clean}`);
    }
    return this.resolveColVal(row, clean, outerRow);
  }

  evalHavingExpr(expr, gRows, allColNames, aliasMap, outerRow = null) {
    const trimmed = (expr || '').trim();
    if (!trimmed) return true;
    const orParts = this.splitOutsideQuotes(trimmed, /^OR(?=\s|\()/i);
    if (orParts.length > 1) {
      return orParts.some(p => this.evalHavingExpr(p, gRows, allColNames, aliasMap, outerRow));
    }
    const andParts = this.splitOutsideQuotes(trimmed, /^AND(?=\s|\()/i);
    if (andParts.length > 1) {
      return andParts.every(p => this.evalHavingExpr(p, gRows, allColNames, aliasMap, outerRow));
    }
    const hMatch = trimmed.match(/^(.+?)\s*(=|!=|<>|>=|<=|>|<)\s*(.+)$/);
    if (!hMatch) {
      throw new Error(`near "${trimmed.split(/\s+/)[0]}": syntax error in HAVING`);
    }
    const lhsRaw = hMatch[1].trim();
    const op = hMatch[2];
    const rhsVal = this.parseLiteral(hMatch[3]);
    const aliasKey = lhsRaw.toLowerCase();
    const leftVal = Object.prototype.hasOwnProperty.call(aliasMap, aliasKey)
      ? aliasMap[aliasKey]
      : this.evalSelectExpr(lhsRaw, gRows, allColNames, outerRow);
    if (leftVal === null || leftVal === undefined) return false;
    const nL = Number(leftVal);
    const nR = Number(rhsVal);
    const bothNum = !Number.isNaN(nL) && !Number.isNaN(nR);
    if (op === '=') return bothNum ? nL === nR : String(leftVal) === String(rhsVal);
    if (op === '!=' || op === '<>') return bothNum ? nL !== nR : String(leftVal) !== String(rhsVal);
    if (op === '>') return nL > nR;
    if (op === '>=') return nL >= nR;
    if (op === '<') return nL < nR;
    if (op === '<=') return nL <= nR;
    return false;
  }

  runSelect(rawQuery, dbKey, isCsv, returnRaw = false, showHeader = false, outerRow = null) {
    const q = rawQuery.trim().replace(/;+$/, '').trim();
    // Parse clauses using top-level clause keywords
    const selectMatch = q.match(/^SELECT\s+(DISTINCT\s+)?(.+?)(?:\s+FROM\s+(.+))?$/is);
    if (!selectMatch || !selectMatch[3]) {
      return { output: `Error: near "${q.split(/\s+/)[0]}": syntax error`, type: 'error', code: 1 };
    }

    const isDistinct = Boolean(selectMatch[1]);
    const selectListRaw = selectMatch[2].trim();
    const afterFrom = selectMatch[3].trim();

    // Find top-level WHERE / GROUP BY / HAVING / ORDER BY / LIMIT
    const findClausePositions = (str) => {
      const found = [];
      let inQ = null;
      let paren = 0;
      for (let i = 0; i < str.length; i++) {
        const ch = str[i];
        if (ch === "'" || ch === '"') { inQ = inQ === ch ? null : (inQ || ch); continue; }
        if (inQ) continue;
        if (ch === '(') { paren++; continue; }
        if (ch === ')' && paren > 0) { paren--; continue; }
        if (paren === 0 && (i === 0 || /\s/.test(str[i - 1]))) {
          const sub = str.slice(i);
          const m = sub.match(/^(WHERE|GROUP\s+BY|HAVING|ORDER\s+BY|LIMIT)(?=\s)/i);
          if (m) {
            found.push({ kw: m[1].toUpperCase().replace(/\s+/g, ' '), start: i, bodyStart: i + m[0].length });
          }
        }
      }
      return found;
    };

    const positions = findClausePositions(afterFrom);
    const fromClause = (positions.length > 0 ? afterFrom.slice(0, positions[0].start) : afterFrom).trim();
    const clauses = {};
    for (let idx = 0; idx < positions.length; idx++) {
      const end = idx + 1 < positions.length ? positions[idx + 1].start : afterFrom.length;
      clauses[positions[idx].kw] = afterFrom.slice(positions[idx].bodyStart, end).trim();
    }

    // Parse FROM table + optional JOINs
    const joinParts = [];
    const joinTokenizer = /\b(LEFT\s+(?:OUTER\s+)?JOIN|INNER\s+JOIN|JOIN)\b/gi;
    let lastPos = 0;
    let jm;
    let firstJoinType = null;
    while ((jm = joinTokenizer.exec(fromClause)) !== null) {
      const chunk = fromClause.slice(lastPos, jm.index).trim();
      joinParts.push({ type: firstJoinType, raw: chunk });
      firstJoinType = jm[1].toUpperCase().includes('LEFT') ? 'LEFT' : 'INNER';
      lastPos = jm.index + jm[0].length;
    }
    joinParts.push({ type: firstJoinType, raw: fromClause.slice(lastPos).trim() });

    const parseTableSpec = (spec) => {
      const m = spec.match(/^(\w+)(?:\s+(?:AS\s+)?(\w+))?$/i);
      if (!m) return null;
      return { table: m[1], alias: m[2] || m[1] };
    };

    const baseSpec = parseTableSpec(joinParts[0].raw);
    if (!baseSpec) return { output: 'Error: syntax error in FROM clause', type: 'error', code: 1 };
    const baseRef = this.getTableRef(dbKey, baseSpec.table);
    if (!baseRef) return { output: `Error: no such table: ${baseSpec.table}`, type: 'error', code: 1 };

    const allColNames = [];
    const starColumns = [];
    const prefixRow = (r, alias, cols) => {
      const out = {};
      for (const c of cols) {
        out[c] = r[c];
        out[`${alias}.${c}`] = r[c];
      }
      return out;
    };
    baseRef.columns.forEach(c => {
      allColNames.push(c, `${baseSpec.alias}.${c}`);
      starColumns.push({ expr: `${baseSpec.alias}.${c}`, label: c });
    });

    let workingRows = baseRef.rows.map(r => prefixRow(r, baseSpec.alias, baseRef.columns));

    for (let j = 1; j < joinParts.length; j++) {
      const jType = joinParts[j].type;
      const onMatch = joinParts[j].raw.match(/^(.+?)\s+ON\s+(.+)$/is);
      if (!onMatch) return { output: 'Error: syntax error in JOIN ON clause', type: 'error', code: 1 };
      const jSpec = parseTableSpec(onMatch[1].trim());
      if (!jSpec) return { output: 'Error: syntax error in JOIN table', type: 'error', code: 1 };
      const jRef = this.getTableRef(dbKey, jSpec.table);
      if (!jRef) return { output: `Error: no such table: ${jSpec.table}`, type: 'error', code: 1 };

      jRef.columns.forEach(c => {
        allColNames.push(c, `${jSpec.alias}.${c}`);
        starColumns.push({ expr: `${jSpec.alias}.${c}`, label: c });
      });

      const onExpr = onMatch[2].trim();
      const nextRows = [];
      const nullRight = {};
      jRef.columns.forEach(c => {
        nullRight[`${jSpec.alias}.${c}`] = null;
      });

      for (const leftRow of workingRows) {
        let matchedAny = false;
        for (const rRaw of jRef.rows) {
          const rightPrefixed = {};
          for (const c of jRef.columns) {
            rightPrefixed[`${jSpec.alias}.${c}`] = rRaw[c];
            if (!Object.prototype.hasOwnProperty.call(leftRow, c)) {
              rightPrefixed[c] = rRaw[c];
            }
          }
          const merged = { ...leftRow, ...rightPrefixed };
          if (this.evalWhere(onExpr, merged, dbKey, outerRow)) {
            nextRows.push(merged);
            matchedAny = true;
          }
        }
        if (!matchedAny && jType === 'LEFT') {
          nextRows.push({ ...leftRow, ...nullRight });
        }
      }
      workingRows = nextRows;
    }

    // WHERE
    if (clauses.WHERE) {
      workingRows = workingRows.filter(r => this.evalWhere(clauses.WHERE, r, dbKey, outerRow));
    }

    // Build projection list
    const selectItems = selectListRaw === '*'
      ? starColumns.map(s => s.expr)
      : this.splitTopLevel(selectListRaw, ',');

    const headerLabels = selectListRaw === '*'
      ? starColumns.map(s => s.label)
      : selectItems.map(item => {
          const asMatch = item.match(/\s+AS\s+(\w+)\s*$/i);
          if (asMatch) return asMatch[1];
          const dotIdx = item.indexOf('.');
          return dotIdx !== -1 && /^[A-Za-z_][A-Za-z0-9_.]*$/.test(item.trim()) ? item.trim().slice(dotIdx + 1) : item.trim();
        });

    const hasAgg = selectItems.some(item => /\b(COUNT|SUM|AVG|MIN|MAX)\s*\(/i.test(item));
    const groupByCol = clauses['GROUP BY'] ? clauses['GROUP BY'].trim() : null;

    let projectedRows = [];
    if (groupByCol) {
      if (!this.hasColumn(allColNames, groupByCol)) {
        return { output: `Error: no such column: ${groupByCol}`, type: 'error', code: 1 };
      }
      const groups = new Map();
      for (const r of workingRows) {
        const keyVal = this.resolveColVal(r, groupByCol);
        const mapKey = String(keyVal);
        if (!groups.has(mapKey)) groups.set(mapKey, []);
        groups.get(mapKey).push(r);
      }
      for (const [, gRows] of groups.entries()) {
        const outObj = {};
        const aliasMap = {};
        const vals = selectItems.map((item, i) => {
          const v = this.evalSelectExpr(item, gRows, allColNames, outerRow);
          const exprNoAs = item.trim().replace(/\s+AS\s+\w+$/i, '').trim().toLowerCase();
          const hdrKey = headerLabels[i].toLowerCase();
          outObj[item] = v;
          outObj[`_col${i}`] = v;
          outObj[hdrKey] = v;
          outObj[exprNoAs] = v;
          aliasMap[hdrKey] = v;
          aliasMap[exprNoAs] = v;
          return v;
        });
        if (clauses.HAVING && !this.evalHavingExpr(clauses.HAVING, gRows, allColNames, aliasMap, outerRow)) {
          continue;
        }
        projectedRows.push({ vals, raw: gRows[0], outObj });
      }
    } else if (hasAgg) {
      const outObj = {};
      const vals = selectItems.map((item, i) => {
        const v = this.evalSelectExpr(item, workingRows, allColNames, outerRow);
        const exprNoAs = item.trim().replace(/\s+AS\s+\w+$/i, '').trim().toLowerCase();
        outObj[item] = v;
        outObj[`_col${i}`] = v;
        outObj[headerLabels[i].toLowerCase()] = v;
        outObj[exprNoAs] = v;
        return v;
      });
      projectedRows.push({ vals, raw: workingRows[0] || {}, outObj });
    } else {
      for (const r of workingRows) {
        const outObj = {};
        const vals = selectItems.map((item, i) => {
          const v = this.evalSelectExpr(item, [r], allColNames, outerRow);
          const exprNoAs = item.trim().replace(/\s+AS\s+\w+$/i, '').trim().toLowerCase();
          outObj[item] = v;
          outObj[`_col${i}`] = v;
          outObj[headerLabels[i].toLowerCase()] = v;
          outObj[exprNoAs] = v;
          return v;
        });
        projectedRows.push({ vals, raw: r, outObj });
      }
    }

    // ORDER BY
    if (clauses['ORDER BY']) {
      const orderSpecs = this.splitTopLevel(clauses['ORDER BY'], ',').map(s => {
        const m = s.match(/^(.+?)(?:\s+(ASC|DESC))?$/i);
        return { col: m[1].trim(), desc: (m[2] || '').toUpperCase() === 'DESC' };
      });
      for (const spec of orderSpecs) {
        const specLower = spec.col.toLowerCase();
        const inProjected = projectedRows.some(p =>
          Object.prototype.hasOwnProperty.call(p.outObj, spec.col) ||
          Object.prototype.hasOwnProperty.call(p.outObj, specLower)
        );
        if (!this.hasColumn(allColNames, spec.col) && !inProjected) {
          return { output: `Error: no such column: ${spec.col}`, type: 'error', code: 1 };
        }
      }
      projectedRows.sort((a, b) => {
        for (const spec of orderSpecs) {
          const specLower = spec.col.toLowerCase();
          let va = this.resolveColVal(a.raw, spec.col);
          if (va === undefined) va = Object.prototype.hasOwnProperty.call(a.outObj, spec.col) ? a.outObj[spec.col] : a.outObj[specLower];
          let vb = this.resolveColVal(b.raw, spec.col);
          if (vb === undefined) vb = Object.prototype.hasOwnProperty.call(b.outObj, spec.col) ? b.outObj[spec.col] : b.outObj[specLower];
          if (va === vb) continue;
          if (va === null || va === undefined) return spec.desc ? 1 : -1;
          if (vb === null || vb === undefined) return spec.desc ? -1 : 1;
          let cmp;
          if (typeof va === 'number' && typeof vb === 'number') cmp = va - vb;
          else cmp = String(va).localeCompare(String(vb));
          if (cmp !== 0) return spec.desc ? -cmp : cmp;
        }
        return 0;
      });
    }

    // DISTINCT
    if (isDistinct) {
      const seen = new Set();
      projectedRows = projectedRows.filter(p => {
        const k = JSON.stringify(p.vals);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    }

    // LIMIT
    if (clauses.LIMIT !== undefined) {
      const lim = parseInt(clauses.LIMIT, 10);
      if (Number.isNaN(lim) || lim < 0) {
        return { output: 'Error: invalid LIMIT value', type: 'error', code: 1 };
      }
      projectedRows = projectedRows.slice(0, lim);
    }

    if (returnRaw) {
      return { rows: projectedRows.map(p => p.outObj) };
    }

    const sep = isCsv ? ',' : '|';
    const outLines = projectedRows.map(p => p.vals.map(v => (v === null || v === undefined ? '' : String(v))).join(sep));
    if (showHeader && projectedRows.length > 0) {
      outLines.unshift(headerLabels.join(sep));
    }
    return { output: outLines.join('\n'), code: 0 };
  }

  execute(args) {
    if (!args || args.length === 0) {
      return { output: 'Uso: sqlite3 [opções] <banco.db> [comando/sql]', type: 'error', code: 1 };
    }

    let isCsv = false;
    let showHeader = false;
    const cleanArgs = [];
    for (const a of args) {
      if (a === '-csv') isCsv = true;
      else if (a === '-header') showHeader = true;
      else if (a === '-noheader') showHeader = false;
      else cleanArgs.push(a);
    }

    const dbFile = cleanArgs[0];
    let query = cleanArgs.slice(1).join(' ').trim();
    if ((query.startsWith('"') && query.endsWith('"')) || (query.startsWith("'") && query.endsWith("'"))) {
      query = query.slice(1, -1).trim();
    }
    const dbKey = this.getDbKey(dbFile);

    if (!query) {
      return { output: `SQLite version 3.42.0\nEnter ".help" for usage hints.\nConnected to a transient in-memory database.`, code: 0 };
    }

    if (query === '.tables') {
      const base = dbKey === 'legacy' ? ['enrollments', 'members', 'plans'] : ['members'];
      const custom = Object.keys(this.customTablesByDb[dbKey] || {});
      const all = Array.from(new Set([...base, ...custom])).sort();
      return { output: all.join('  '), code: 0 };
    }

    if (query.startsWith('.schema')) {
      const parts = query.split(/\s+/);
      const targetTable = parts[1];
      const builtins = this.getBuiltinSchema(dbKey);
      const customMap = this.customTablesByDb[dbKey] || {};
      if (targetTable) {
        const ref = this.getTableRef(dbKey, targetTable);
        if (!ref) return { output: '', code: 0 };
        return { output: ref.schema, code: 0 };
      }
      const allSchemas = [
        ...Object.values(builtins).map(b => b.schema),
        ...Object.values(customMap).map(c => c.schema)
      ];
      return { output: allSchemas.join('\n'), code: 0 };
    }

    if (query.startsWith('.')) {
      return { output: `Error: unknown command or invalid arguments:  "${query.split(/\s+/)[0]}". Enter ".help" for help`, type: 'error', code: 1 };
    }

    // CREATE TABLE
    const createMatch = query.match(/^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)\s*\((.+)\)\s*;?$/is);
    if (createMatch) {
      const tableName = createMatch[1];
      const colDefs = this.splitTopLevel(createMatch[2], ',').map(c => c.trim().split(/\s+/)[0]).filter(Boolean);
      this.customTablesByDb[dbKey][tableName] = {
        schema: query.endsWith(';') ? query : query + ';',
        columns: colDefs,
        rows: []
      };
      return { output: '', code: 0 };
    }

    // DROP TABLE
    const dropMatch = query.match(/^DROP\s+TABLE\s+(IF\s+EXISTS\s+)?(\w+)\s*;?$/is);
    if (dropMatch) {
      const tName = dropMatch[2];
      const existing = Object.keys(this.customTablesByDb[dbKey]).find(k => k.toLowerCase() === tName.toLowerCase());
      if (!existing && !dropMatch[1]) {
        return { output: `Error: no such table: ${tName}`, type: 'error', code: 1 };
      }
      if (existing) delete this.customTablesByDb[dbKey][existing];
      return { output: '', code: 0 };
    }

    // INSERT INTO
    const insertMatch = query.match(/^INSERT\s+INTO\s+(\w+)\s*(?:\(([^)]+)\))?\s*VALUES\s*\((.+)\)\s*;?$/is);
    if (insertMatch) {
      const tableName = insertMatch[1];
      const ref = this.getTableRef(dbKey, tableName);
      if (!ref) {
        return { output: `Error: no such table: ${tableName}`, type: 'error', code: 1 };
      }
      const explicitCols = insertMatch[2] ? this.splitTopLevel(insertMatch[2], ',').map(c => c.trim()) : null;
      const rawVals = this.splitTopLevel(insertMatch[3], ',').map(v => this.parseLiteral(v));
      const cols = explicitCols || ref.columns;
      if (rawVals.length !== cols.length) {
        return { output: `Error: table ${tableName} has ${cols.length} columns but ${rawVals.length} values were supplied`, type: 'error', code: 1 };
      }
      const row = {};
      if (!ref.isCustom && ref.name === 'members') {
        const maxId = ref.rows.reduce((acc, m) => Math.max(acc, m.id || 0), 0);
        Object.assign(row, { id: maxId + 1, name: '', email: null, city: 'Desconhecida', age: 25 });
      }
      cols.forEach((col, idx) => {
        const matchedCol = ref.columns.find(c => c.toLowerCase() === col.toLowerCase()) || col;
        row[matchedCol] = rawVals[idx];
      });
      ref.rows.push(row);
      return { output: '', code: 0 };
    }

    // UPDATE
    const updateMatch = query.match(/^UPDATE\s+(\w+)\s+SET\s+(.+?)(?:\s+WHERE\s+(.+?))?\s*;?$/is);
    if (updateMatch) {
      const [, tableName, setClause, whereClause] = updateMatch;
      const ref = this.getTableRef(dbKey, tableName);
      if (!ref) {
        return { output: `Error: no such table: ${tableName}`, type: 'error', code: 1 };
      }
      const assignments = this.splitTopLevel(setClause, ',').map(a => {
        const eqIdx = a.indexOf('=');
        if (eqIdx === -1) throw new Error('near "SET": syntax error');
        const col = a.slice(0, eqIdx).trim();
        const matchedCol = ref.columns.find(c => c.toLowerCase() === col.toLowerCase());
        if (!matchedCol) throw new Error(`no such column: ${col}`);
        const val = this.parseLiteral(a.slice(eqIdx + 1));
        return [matchedCol, val];
      });
      try {
        for (const row of ref.rows) {
          if (!whereClause || this.evalWhere(whereClause, row, dbKey)) {
            for (const [col, val] of assignments) row[col] = val;
          }
        }
        return { output: '', code: 0 };
      } catch (err) {
        return { output: `Error: ${err.message}`, type: 'error', code: 1 };
      }
    }

    // DELETE FROM
    const deleteMatch = query.match(/^DELETE\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?\s*;?$/is);
    if (deleteMatch) {
      const [, tableName, whereClause] = deleteMatch;
      const ref = this.getTableRef(dbKey, tableName);
      if (!ref) {
        return { output: `Error: no such table: ${tableName}`, type: 'error', code: 1 };
      }
      try {
        const remaining = whereClause
          ? ref.rows.filter(r => !this.evalWhere(whereClause, r, dbKey))
          : [];
        ref.setRows(remaining);
        return { output: '', code: 0 };
      } catch (err) {
        return { output: `Error: ${err.message}`, type: 'error', code: 1 };
      }
    }

    // SELECT
    if (/^SELECT\s+/i.test(query)) {
      try {
        return this.runSelect(query, dbKey, isCsv, false, showHeader);
      } catch (err) {
        return { output: `Error: ${err.message}`, type: 'error', code: 1 };
      }
    }

    return { output: `Error: near "${query.split(/\s+/)[0]}": syntax error`, type: 'error', code: 1 };
  }
}

if (typeof window !== 'undefined') {
  window.SQLEngine = SQLEngine;
}

import { query } from "../../config/db.js";
import { InsertResult } from "../../types/db.js";

function buildFilters(filters: any) {
  const where: string[] = [];
  const params: unknown[] = [];

  if (filters.status) {
    where.push("t.status = ?");
    params.push(filters.status);
  }
  if (filters.priority) {
    where.push("t.priority = ?");
    params.push(filters.priority);
  }
  if (filters.assigneeId) {
    where.push("t.assignee_id = ?");
    params.push(filters.assigneeId);
  }
  if (filters.reporterId) {
    where.push("t.reporter_id = ?");
    params.push(filters.reporterId);
  }
  if (filters.search) {
    where.push("(t.title LIKE ? OR t.description LIKE ?)");
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  const sqlWhere = where.length ? `WHERE ${where.join(" AND ")}` : "";
  return { sqlWhere, params };
}

export const ticketRepository = {
  create({ title, description, priority, reporterId, assigneeId = null }: any) {
    return query<InsertResult>(
      "INSERT INTO tickets (title, description, priority, reporter_id, assignee_id) VALUES (?, ?, ?, ?, ?)",
      [title, description, priority, reporterId, assigneeId]
    );
  },

  async findAll(filters: any) {
    const page = Number(filters.page || 1);
    const limit = Number(filters.limit || 10);
    const offset = (page - 1) * limit;
    const { sqlWhere, params } = buildFilters(filters);

    const data = await query(
      `SELECT
        t.id, t.title, t.description, t.status, t.priority, t.created_at, t.updated_at,
        reporter.id AS reporter_id, reporter.name AS reporter_name,
        assignee.id AS assignee_id, assignee.name AS assignee_name
      FROM tickets t
      INNER JOIN users reporter ON reporter.id = t.reporter_id
      LEFT JOIN users assignee ON assignee.id = t.assignee_id
      ${sqlWhere}
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const countRows = await query(
      `SELECT COUNT(*) AS total
       FROM tickets t
       ${sqlWhere}`,
      params
    );
    const total = Number((countRows as any)[0].total || 0);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  findById(id: number) {
    return query(
      `SELECT
        t.id, t.title, t.description, t.status, t.priority, t.created_at, t.updated_at,
        reporter.id AS reporter_id, reporter.name AS reporter_name,
        assignee.id AS assignee_id, assignee.name AS assignee_name
      FROM tickets t
      INNER JOIN users reporter ON reporter.id = t.reporter_id
      LEFT JOIN users assignee ON assignee.id = t.assignee_id
      WHERE t.id = ?
      LIMIT 1`,
      [id]
    ).then((rows: any) => rows[0]);
  },

  update(id: number, fields: Record<string, unknown>) {
    const updates: string[] = [];
    const params: unknown[] = [];
    Object.entries(fields).forEach(([key, value]) => {
      updates.push(`${key} = ?`);
      params.push(value);
    });
    if (!updates.length) return Promise.resolve({ affectedRows: 0 });

    params.push(id);
    return query(`UPDATE tickets SET ${updates.join(", ")} WHERE id = ?`, params);
  },

  remove(id: number) {
    return query("DELETE FROM tickets WHERE id = ?", [id]);
  }
};

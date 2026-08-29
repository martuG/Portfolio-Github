import { query } from "../../config/db.js";

export const dashboardRepository = {
  async getStats() {
    const [totals] = await query<
      {
        total: number;
        open: number;
        inProgress: number;
        closed: number;
      }[]
    >(
      `SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS open,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS inProgress,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) AS closed
      FROM tickets`
    );

    const byPriority = await query(
      `SELECT priority, COUNT(*) AS total
       FROM tickets
       GROUP BY priority`
    );

    const topAssignees = await query(
      `SELECT u.id, u.name, COUNT(t.id) AS total
       FROM users u
       LEFT JOIN tickets t ON t.assignee_id = u.id
       GROUP BY u.id, u.name
       ORDER BY total DESC
       LIMIT 5`
    );

    return { totals, byPriority, topAssignees };
  }
};

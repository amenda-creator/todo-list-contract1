const { Tables } = require('../../Constants/Tables').Tables;
const { SqliteDatabase } = require('../Common.Services/dbHandler');
const settings = require('../../settings.json').settings;

class ToDoService {
  constructor(message) {
    this.message = message;
    this.db = new SqliteDatabase(settings.dbPath);
  }

  async addTask() {
    try {
      this.db.open();
      const desc = (this.message.data && this.message.data.description) || '';
      const res = await this.db.insertValue(Tables.TODO, {
        Description: desc,
        Status: 'Pending',
        CreatedOn: new Date().toISOString(),
        LastUpdatedOn: new Date().toISOString()
      });
      return { success: { id: res.lastId } };
    } catch (e) {
      return { error: e.message || String(e) };
    } finally { this.db.close(); }
  }

  async completeTask() {
    try {
      this.db.open();
      const id = (this.message.data && this.message.data.id) || 0;
      const res = await this.db.updateValue(Tables.TODO, { Status: 'Completed', LastUpdatedOn: new Date().toISOString() }, { Id: id });
      return { success: { changes: res.changes } };
    } catch (e) {
      return { error: e.message || String(e) };
    } finally { this.db.close(); }
  }

  async getAllTasks() {
    try {
      this.db.open();
      const rows = await this.db.runSelectQuery(`SELECT Id, Description, Status, CreatedOn, LastUpdatedOn FROM ${Tables.TODO}`);
      const tasks = rows.map(r => ({ id: r.Id, description: r.Description, status: r.Status, createdOn: r.CreatedOn, lastUpdatedOn: r.LastUpdatedOn }));
      return { success: tasks };
    } catch (e) {
      return { error: e.message || String(e) };
    } finally { this.db.close(); }
  }
}

module.exports = ToDoService;

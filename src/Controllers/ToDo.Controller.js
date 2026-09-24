const ToDoService = require('../Services/Domain.Services/ToDo.service');

/**
 * Controller for all ToDo-related contract requests.
 *
 * The controller's role is intentionally thin: it translates the incoming
 * message.Action into the corresponding domain service call and returns the
 * service result unchanged.
 */
class ToDoController {
  /**
   * @param {object} message Incoming request payload (already parsed from user input).
   * Expected shape:
   *  - Action: string (e.g. 'AddTask', 'CompleteTask', 'GetAllTasks')
   *  - data: object (action-specific payload)
   */
  constructor(message) {
    // Store the original message for later action routing.
    this.message = message;

    // Domain service encapsulating all DB/business logic for the ToDo feature.
    this.service = new ToDoService(message);
  }

  /**
   * Routes the request to the correct service method based on message.Action.
   *
   * NOTE: The returned objects follow the project's convention:
   *  - { success: ... } for successful outcomes
   *  - { error: '...' } for errors / invalid actions
   *
   * @returns {Promise<object>} Service response object.
   */
  async handleRequest() {
    // Action string that determines which ToDo operation to execute.
    const action = this.message.Action;

    // Dispatch based on the action name.
    // Keep the controller free of business logic; service handles validation/DB.
    if (action === 'AddTask') return await this.service.addTask();
    if (action === 'CompleteTask') return await this.service.completeTask();
    if (action === 'GetAllTasks') return await this.service.getAllTasks();

    // If the action is not recognized, return a standard error.
    return { error: 'Invalid action' };
  }
}

module.exports = ToDoController;

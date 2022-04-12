import Item from "../Item";
import GetEmployees from "../../Requests/Employees/GetEmployees";

export default class AllEmployees extends Item {
  execute() {
    const getEmployees = new GetEmployees()

    return getEmployees.all()
  }
}
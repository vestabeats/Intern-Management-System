import moment from "moment";
export const formatDate = (date) => {
    // Get the month, day, and year
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
  
    const formattedDate = `${day}-${month}-${year}`;
  
    return formattedDate;
  };
  export const formatter=(dbb)=>{
    const val = moment(dbb)
    return val.format('DD/MM/YYYY')
  }
  export function dateFormatter(dateString) {
    const inputDate = new Date(dateString);
  
    if (isNaN(inputDate)) {
      return "Invalid Date";
    }
  
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, "0");
    const day = String(inputDate.getDate()).padStart(2, "0");
  
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }

  export function getInitials(fullName) {
    const names = fullName.split("");
  
    const initials = names.slice(0, 2).map((name) => name[0].toUpperCase());
  
    const initialsStr = initials.join("");
  
    return initialsStr;
  }
export const PRIOTITYSTYELS = {
    high: "text-red-600",
    medium: "text-yellow-600",
    low: "text-blue-600",
  };
  export const TASK_TYPE = {
    todo: "bg-blue-600",
    "in progress": "bg-yellow-600",
    completed: "bg-green-600",
  };
  
  export const DUTY_TYPE = {
    supervisor: "bg-blue-600",
    apprentice: "bg-yellow-600",
    intern: "bg-green-600",
  };
  export const USER_ROLE = {
    intern: "bg-blue-600",
    apprentice: "bg-yellow-600",
    supervisor: "bg-green-600",
  };

  
  export const BGS = [
    "bg-blue-600",
    "bg-yellow-600",
    "bg-red-600",
    "bg-green-600",
  ];
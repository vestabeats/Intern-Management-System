import Notice from "../models/notification.js";
import Task from "../models/task.js";
import User from "../models/user.js";

export const createTask=async(req,res)=>{
    try{
        const { userId } = req.user;

        const { title, team, stage, date, priority, assets } = req.body;
        let text = "New task has been assigned to you.";
        if (team?.length > 1) {
          text = text + ` and ${team?.length - 1} others.`;
        }
    
        text =
          text +
          ` The task priority is set to a ${priority} priority, so check and act accordingly. The task due date is ${new Date(
            date
          ).toDateString()}. Thank you!!!`;
          const data = {
            performance:"pending",
            mark:"pending",
            by: userId,
           
          };
       
        const task = await Task.create({
            title,
            team,
            stage: stage.toLowerCase(),
            date,
            priority: priority.toLowerCase(),
            assets,
           evaluation:data
          });
      
          await Notice.create({
            team,
            text,
            task: task._id,
          });
      
          res
            .status(200)
            .json({ status: true, task, message: "Task created successfully." });
    

    }catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
}


export const postTaskActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { mark } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found." });
    }

    // Determine the performance based on the mark
    let performance;
    if (mark >= 0 && mark <= 4) {
      performance = 'very bad';
    } else if (mark >= 5 && mark <= 9) {
      performance = 'bad';
    } else if (mark >= 10 && mark <= 11) {
      performance = 'fair';
    } else if (mark >= 12 && mark <= 14) {
      performance = 'good';
    } else if (mark >= 15 && mark <= 16) {
      performance = 'very good';
    } else if (mark >= 17 && mark <= 20) {
      performance = 'excellent';
    } else {
      return res.status(400).json({ status: false, message: "Invalid mark value." });
    }

    const data = {
      performance,
      mark,
      by: userId,
      date: new Date() // Ensure the activity has a date
    };

    task.evaluation = data;
    await task.save();

    res.status(200).json({ status: true, message: "Evaluation posted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, message: "Error in evaluation" });
  }
};


export const dashboardStatistics =async(req,res)=>{
    try{
        const{userId,isSup } = req.user
        const allTasks = isSup
        ? await Task.find({
            "evaluation.by":userId
          }).sort({ _id: -1 })
        : await Task.find({
            
            team: { $all: [userId] },
          }).sort({ _id: -1 });
        
        const groupTaskks = allTasks.reduce((result, task) => {
            const stage = task.stage;
      
            if (!result[stage]) {
              result[stage] = 1;
            } else {
              result[stage] += 1;
            }
      
            return result;
          }, {});
        // Group tasks by priority
    const groupData = Object.entries(
        allTasks.reduce((result, task) => {
          const { priority } = task;
  
          result[priority] = (result[priority] || 0) + 1;
          return result;
        }, {})
      ).map(([name, total]) => ({ name, total }));
  
      // calculate total tasks
      const totalTasks = allTasks?.length;
      
  
      const summary = {
        totalTasks,
        tasks: groupTaskks,
        graphData: groupData,
      };
  
      res.status(200).json({
        status: true,
        message: "Successfully",
        ...summary,
      });

    }catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
}


export const getTasks = async (req, res) => {
    try {
        const { userId, isSup } = req.user;
        const { stage, search } = req.query;
        let query = {};

        if (isSup) {
            query = {
                "evaluation.by": userId
            };
        } else {
            query = {
              team: { $in: [userId] }
            };
        }

        if (stage) {
            query.stage = stage;
        }
        if (search !== '') {
          // Use a logical OR operator to search by either surname or firstname
          query.$or = [
              { title: { $regex: search, $options: 'i' } },
              { priority: { $regex: search, $options: 'i' } },
              { stage: { $regex: search, $options: 'i' } }
          ];
      }

        const tasks = await Task.find(query)
            .populate({
                path: "team",
                select: "surname firstname role email",
            }).populate({path:"subTask.by", select:"surname role firstname"})
            .sort({ _id: -1 });

        res.status(200).json({
            status: true,
            tasks,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
};
export const getTaskEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const query ={ team: { $in: [id] }}
    const task = await Task.find( query)
      .populate({
        path: "team",
        select: "surname firstname role email",
      })
      .populate({
        path: "evaluation.by",
        select: "surname firstname",
      }) .populate({
          path: "subTask.by",
          select: "surname firstname"});

    res.status(200).json({
      status: true,
      task,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

  export const getTask = async (req, res) => {
    try {
      const { id } = req.params;
  
      const task = await Task.findById(id)
        .populate({
          path: "team",
          select: "surname firstname role email",
        })
        .populate({
          path: "evaluation.by",
          select: "surname firstname",
        }) .populate({
            path: "subTask.by",
            select: "surname firstname"});
  
      res.status(200).json({
        status: true,
        task,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
  };
  export const createSubTask = async (req, res) => {
    try {
        const { userId } = req.user;
        const { title, assets, tag } = req.body;
        const { id } = req.params;
       
        // Validate incoming data
        if (!title || !assets || !tag) {
            return res.status(400).json({ status: false, message: "Title, assets, and tag are required." });
        }

        // Check if the task with the specified id exists
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ status: false, message: "Task not found." });
        }

        // Create a new subtask
        const newSubTask = {
            title,
            tag,
            assets,
            by: userId
        };

        // Add the new subtask to the task
        task.subTask.push(newSubTask);

        // Update the stage of the task to "in progress"
        task.stage = "in progress";

        // Save the updated task
        await task.save();

        // Return a success response
        return res.status(200).json({ status: true, message: "Subtask added successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Internal server error." });
    }
};
export const validateTask=async(req,res)=>{
  try{
    const { id } = req.params;
    const task = await Task.findById(id);
    if(task.stage==="in progress"){
      task.stage="completed"
    }else{
      task.stage="in progress"
    }
    await task.save()
    res
    .status(200)
    .json({ status: true, message: "Task Validated successfully." });
  }catch(error){
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
}
export const updateTask =async(req,res)=>{
    try{
        const { id } = req.params;
        const { title, date, team, stage, priority, assets } = req.body;
    
        const task = await Task.findById(id);
    
        task.title = title;
        task.date = date;
        task.priority = priority.toLowerCase();
        task.assets = assets;
        task.stage = stage.toLowerCase();
        task.team = team;
    
        await task.save();
    
        res
          .status(200)
          .json({ status: true, message: "Task updated successfully." });

    }catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
}

export const trashTask =async(req,res)=>{
    try{

        const { id } = req.params;

         await Task.findByIdAndDelete(id);
    

        res.status(200).json({
          status: true,
          message: `Task trashed successfully.`,
        });

    }catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
}


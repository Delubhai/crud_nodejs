// Define Common Files
const en_TXT = require('../../../../config/apiResponse');
const common = require('../../../../config/common');
const Todo = require('../../../models/todo.model');

exports.todoList = async (req, res) => {
  try {
    let allTodoList = await Todo.find({ oUserId: req.userId, bIsDeleted: false });
    console.log(allTodoList, '>>>>>>>.allTodoList')
    return res.status(200).send({ data: allTodoList, message: "Success" })
  } catch (error) {
    console.log(error, "userlist error");
    return res.status(500).send({ message: "Internal server error" })
  }
}

exports.getTodoById = async (req, res) => {
  try {
    let todo = await Todo.findOne({ oUserId: req.userId, _id: req.params.id });
    console.log(todo, '>>>>>>>.todo')
    return res.status(200).send({ data: todo, message: "Success" })
  } catch (error) {
    console.log(error, "userlist error");
    return res.status(500).send({ message: "Internal server error" })
  }
}

exports.deleteTodo = async (req, res) => {
  try {
    let currentTime = common.getEpoch();
    let deleteTodo = await Todo.updateOne({ _id: req.params.id }, { $set: { bIsDeleted: true, updatedAt: currentTime } })
    if (deleteTodo) { return common.commonSuccessResponse(res, { message: en_TXT.todo_delete }); }
    else {
      return common.commonResponse(res, { status: false, code: 400, message: en_TXT.todo_delete_failed });
    }
  } catch (error) {
    console.log(error, '>>>>>>>error')
    return res.status(500).send({ message: "Internal server error" })
  }
}

exports.todoMarkCompleted = async (req, res) => {
  try {
    let currentTime = common.getEpoch();

    let updateTodo = await Todo.updateOne({ _id: req.params.id }, { $set: { bMarkCompleted: true, updatedAt: currentTime } })
    if (updateTodo) { return common.commonSuccessResponse(res, { message: en_TXT.todo_mark_completed }); }
    else {
      return common.commonResponse(res, { status: false, code: 400, message: en_TXT.todo_mark_completed_failed });
    }
  } catch (error) {
    console.log(error, '>>>>>>>error')
    return res.status(500).send({ message: "Internal server error" })
  }
}

exports.updateTodo = async (req, res) => {
  try {
    let currentTime = common.getEpoch();
    let updateTodo = await Todo.updateOne({ _id: req.params.id, }, {
      $set: {
        vTitle: req.body.vTitle,
        vDescription: req.body.vDescription,
        iDueDate: req.body.iDueDate,
        iUpdatedAt: currentTime
      }
    })
    if (updateTodo) { return common.commonSuccessResponse(res, { message: en_TXT.todo_update }); }
    else {
      return common.commonResponse(res, { status: false, code: 400, message: en_TXT.todo_update_failed });
    }
  } catch (error) {
    console.log(error, '>>>>>>>error')
    return res.status(500).send({ message: "Internal server error" })
  }
}

exports.createTodo = async (req, res) => {
  try {
    let currentTime = common.getEpoch();
    let createObj = {
      vTitle: req.body.vTitle,
      vDescription: req.body.vDescription,
      oUserId: req.userId,
      bIsDeleted: false,
      bMarkCompleted: false,
      iDueDate: new Date(req.body.iDueDate) / 1000,
      iCreatedAt: currentTime,
      iUpdatedAt: currentTime,
    }
    let createNew = await Todo.create(createObj)
    if (createNew) {
      return common.commonSuccessResponse(res, { message: en_TXT.todo_create });
    } else {
      return common.commonResponse(res, { status: false, code: 400, message: en_TXT.todo_create_failed });
    }
  } catch (error) {
    console.log(error, '>>>>>>>>error')
    return res.status(500).send({ message: "Internal server error" })
  }
}
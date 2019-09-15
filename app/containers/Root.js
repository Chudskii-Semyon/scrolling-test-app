import React, { Component } from 'react';
import { format } from 'date-fns';
import classes from './Root.modules.css';

let knex = require('knex')({
  client: 'sqlite3', connection: { filename: './tasks.sqlite' }
});

let tasksDiv = null;

const memoizedSize = 60;
const fetchLimit = 20;

class Root extends Component {
  state = {
    tasks: []
  };

  fetchTasks = () => {
    const tasks = this.state.tasks;

    if (tasks.length) {
      if (tasks.length < memoizedSize) {
        knex('tasks').where('created_at', '<', tasks[tasks.length - 1].created_at)
          .limit(fetchLimit)
          .orderBy('created_at', 'desc')
          .then(res => {
            this.setState({ tasks: [...this.state.tasks, ...res] });
          });

      } else {
        knex('tasks').where('created_at', '<', tasks[tasks.length - 1].created_at)
          .limit(fetchLimit)
          .orderBy('created_at', 'desc')
          .then(res => {

            const slicedTasks = tasks.slice(fetchLimit, tasks.length);
            const updatedTasks = [...slicedTasks, ...res];

            this.setState({
              tasks: updatedTasks
            });

            tasksDiv.scrollTop = 1300;
          });
      }
    }
  };

  fetchPrevTasks = () => {
    const tasks = this.state.tasks;

    if (tasks.length >= memoizedSize) {

      knex('tasks')
        .where('created_at', '>', tasks[0].created_at)
        .orderBy('created_at', 'asc')
        .limit(fetchLimit)
        .then(res => {
          if (res.length) {
            res.reverse();
            const slicedTasks = tasks.slice(0, tasks.length - fetchLimit);

            this.setState({ tasks: [...res, ...slicedTasks] });
            tasksDiv.scrollTop = 1000;
          }
        });
    }
  };

  componentDidMount() {
    tasksDiv = document.getElementById('tasks');
    tasksDiv.addEventListener('scroll', this.scroll);

    knex('tasks').where({})
      .limit(fetchLimit)
      .orderBy('created_at', 'desc')
      .then(res => {
        this.setState({ tasks: res });
      });

    setInterval(this.updateTask, 5000);
  }

  updateTask = () => {
    const randomId = Math.floor(Math.random() * 400);


    const updatedTitle = 'Updated title';

    knex('tasks').where('id', randomId).update({ title: updatedTitle })
      .then(res => console.log('Response = ', res));

    const tasks = this.state.tasks;

    let taskIndex = null;

    tasks.forEach((task, index) => {
      if (task.id === randomId) {
        taskIndex = index;
      }
    });

    if (taskIndex) {
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex].title = updatedTitle;

      this.setState({ title: updatedTitle });
    }
  };

  scroll = event => {
    if (tasksDiv.scrollHeight - tasksDiv.scrollTop === tasksDiv.offsetHeight) {
      this.fetchTasks();
    } else if (tasksDiv.scrollTop === 0) {
      this.fetchPrevTasks();
    }
  };


  render() {
    return (
      <div id="tasks" className={classes.Root}>
        {this.state.tasks.length ? this.state.tasks.map(task => (
          <p key={task.id}>{task.id}: {task.title} | {format(task.created_at, 'MM/dd/yyyy')}</p>
        )) : null
        }
        Hello
      </div>
    );
  }
}

export default Root;
